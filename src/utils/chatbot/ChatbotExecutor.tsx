
import { chatbotStateExtended } from "@/features/backend/chatbotBackendImpl";
import astraDB from "@/lib/astraDB";
import HelperFunctions from "@/lib/HelperFunctions";
import Claude from "@/lib/llms/Claude";
import { chatbotMessageContentType } from "@/schemas/chatbot.index";

import { ChatbotResponse } from "./llm/claude/ToolResponse";
import { ClaudeToolsEnum, getClaudeTool } from "./llm/claude/Tools";

interface ChatbotExecutorStateResponsesType {
  id: string;
  responses: any[];
}
export interface chatbotEditorStateCheckpointType {
  messages: chatbotMessageContentType[];
}

export default class ChatbotExecutor {
  state: chatbotEditorStateCheckpointType = {
    messages: [],
  };

  globalPrompt?: string;
  collectionId?: string;

  constructor(messages: chatbotMessageContentType[]) {
    if (messages) {
      this.state.messages = messages;
    }
  }

  initFromChatbotBackendImpl(data: chatbotStateExtended) {
    if (data.globalPrompt) {
      this.globalPrompt = data.globalPrompt;
    }
    if (data.collectionId) {
      this.collectionId = data.collectionId;
    }
  }

  getState() {
    return this.state;
  }

  setCollectionId(collectionId: string) {
    this.collectionId = collectionId;
  }

  async executeChatbot(): Promise<chatbotMessageContentType | undefined> {
    if (this.collectionId) {
      const astraDBHandler = new astraDB();
      const query = this.state.messages[this.state.messages.length - 1].content;
      const docs = await astraDBHandler.queryVectorStore(
        this.collectionId,
        query
      );
      const response = await this.executeLLM(JSON.stringify(docs));
      return response;
    }
  }

  async processEdge() {
    const edgeSystemPrompt = `
        You are a system designed to analyze edges in a chatbot workflow and determine the correct edge to follow based on provided conditions and logic. The workflow is represented as a directed graph where:
        Nodes are actions, decisions, or responses in the chatbot.
        Edges define transitions between nodes, each with specific conditions.
  
        Your tasks are as follows:
   
        -------------------------------
        Input Structure:
        You will receive a list of edges connected to a specific node in the following format:
        [
          {
            "id": "1-2",
            "data": {"label": "some condition"},
          },
          ...
        ]
        Each edge includes its unique ID, source, target, type, and any associated conditions (in data.label).
  
        -------------------------------
  
        Goal:
        Based on the provided edges and conditions:
        - Analyze the conditions (data.label) for all edges.
        - Determine the most appropriate edge to follow.
  
        -------------------------------
  
        Output Structure:
        Provide your output in the following JSON format(Don't include any text before and after the output):
        {
          "edgeToTake": "{{edgeId}}"
        }
        - Replace {{edgeId}} with the ID of the edge you determine should be taken.
  
        -------------------------------
        Logic to Follow:
        Use the provided conditions to decide the best match.
        If multiple conditions are valid, choose the most specific or relevant edge.
        If no valid condition is found, indicate an error or fallback decision.
      `;

    const formatMessageForClaude =
      await HelperFunctions.convertMessagesToClaudeFormat(this.state.messages);

    formatMessageForClaude[
      formatMessageForClaude.length - 1
    ].content[0].text = `
          <userMessage>
            ${
              formatMessageForClaude[formatMessageForClaude.length - 1]
                .content[0].text
            }
          </userMessage>
  
          <Rules>
          ${edgeSystemPrompt}
          </Rules>
        `;
    const claudeHandler = new Claude(formatMessageForClaude);
    if (this.globalPrompt) {
      claudeHandler.setSystemPrompt(this.globalPrompt);
    }

    const response = await claudeHandler.chatCompletions();
    return;
  }

  async executeLLM(options: string) {
    try {
      const formatMessageForClaude =
        await HelperFunctions.convertMessagesToClaudeFormat(
          this.state.messages
        );
      formatMessageForClaude[
        formatMessageForClaude.length - 1
      ].content[0].text = `
          <userMessage>
            ${
              formatMessageForClaude[formatMessageForClaude.length - 1]
                .content[0].text
            }
          </userMessage>
  
          <information>
            ${options}
          </information>


          Use the print_response tool

          Rules:
            - Confirm and acknowledge when all required information has been collected.
            - Be clear, concise, friendly, and patient in your responses.
            - Adapt to user inputs to keep the conversation natural and engaging.
            
          Use the ${ClaudeToolsEnum.ChatbotResponse} tool.
        `;
      const claudeHandler = new Claude(formatMessageForClaude);
      if (this.globalPrompt) {
        claudeHandler.setSystemPrompt(this.globalPrompt);
      }

      claudeHandler.setTools([getClaudeTool(ClaudeToolsEnum.ChatbotResponse)]);

      const response = await claudeHandler.chatCompletions();
      //@ts-ignore
      claudeHandler.setMessageResponse(response);
      const finalMessage = claudeHandler.getSpecificToolResponse(
        ClaudeToolsEnum.ChatbotResponse
      ) as ChatbotResponse;
      if (finalMessage) {
        const responseMessage: chatbotMessageContentType = {
          role: "system",
          content: finalMessage.response,
        };
        return responseMessage;
      }
      return response;
    } catch (e: any) {
      throw e;
    }
  }
}
