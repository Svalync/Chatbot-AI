import configEnv from "@/config";
import Anthropic from "@anthropic-ai/sdk";
import { Message, Tool } from "@anthropic-ai/sdk/resources/messages.mjs";
import { getCurrentUser } from "@/next-auth/utils";
import {
  getInvoicesByUserEmail,
  getUserByEmail,
  isEligibleForRefund,
  processRefund,
  sendBugInfoAndFeedback,
} from "@/utils/chatbot/ProcessTool";
import axiosInstance from "../axios";

const anthropic = new Anthropic({
  apiKey: configEnv.apps.claude.apiKey,
});

export default class Claude {
  messages: any[];
  systemPrompt: string = "";
  messageResponse?: Message;
  // structured response tool will also be present here.
  tools: Tool[] = [];

  constructor(messages: any[]) {
    this.messages = messages;
  }

  setSystemPrompt(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }

  setTools(tools: Tool[]) {
    this.tools = tools;
  }

  addTool(tool: Tool) {
    this.tools.push(tool);
  }

  setMessageResponse(messageResponse: Message) {
    this.messageResponse = messageResponse;
  }

  async chatCompletions() {
    const user = await getCurrentUser();
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0,
      tools: this.tools,
      system: this.systemPrompt,
      messages: this.messages,
      stream: true,
    });

    let responseText = "";
    let isCapturing = false;
    let jsonBuffer = "";
    const newAllResponses: any = [];

    for await (const chunk of response) {
      const axiosInstanceHandler = new axiosInstance();

      if (
        chunk.type === "content_block_delta" &&
        chunk.delta?.type === "input_json_delta"
      ) {
        jsonBuffer += chunk.delta.partial_json;
        jsonBuffer = jsonBuffer.replace(/\\\\/g, "\\");
        jsonBuffer = jsonBuffer.replace(/\\n/g, "\n");
        jsonBuffer = jsonBuffer.replace(/\\\n/g, "\n");
        jsonBuffer = jsonBuffer.replace(/\\/g, " ");

        if (!isCapturing && jsonBuffer.includes('"response": "')) {
          isCapturing = true;
          jsonBuffer = jsonBuffer.split('"response": "')[1];
        }

        if (isCapturing) {
          if (jsonBuffer.endsWith('"}')) {
            jsonBuffer = jsonBuffer.replace('"}', "");
          }
          jsonBuffer = jsonBuffer.replace(/\n/g, " ");
          responseText += jsonBuffer;
          newAllResponses.push(jsonBuffer);
          const payload = {
            userId: user?.user?.id,
            data: jsonBuffer,
          };
          axiosInstanceHandler.setPayload(payload);
          await axiosInstanceHandler.makeCall(
            "http://localhost:3001/emit-stream-webhook",
            "POST"
          );
          jsonBuffer = "";
        }
      }
    }

    return { role: "system", content: responseText };
  }

  getLastResponse() {
    if (this.messageResponse && this.messageResponse.content.length > 0) {
      return this.messageResponse.content[
        this.messageResponse.content.length - 1
      ];
    }
  }

  getSpecificToolResponse(toolName: string) {
    if (this.messageResponse && this.messageResponse.content.length > 0) {
      for (let content of this.messageResponse.content) {
        if (content.type === "tool_use" && content.name === toolName) {
          return content.input;
        }
      }
    }
  }

  async processTool(toolName: string, toolInput: any) {
    switch (toolName) {
      case "get_user": {
        return await getUserByEmail(toolInput["email"]);
      }
      case "isEligibleForRefund": {
        return await isEligibleForRefund(toolInput["email"]);
      }
      case "processRefund": {
        return await processRefund(toolInput["email"]);
      }
      case "getInvoicesByUserEmail": {
        return await getInvoicesByUserEmail(toolInput["email"]);
      }
      case "sendMailForFeebackOrBug": {
        return await sendBugInfoAndFeedback(
          toolInput["email"],
          toolInput["feedback"]
        );
      }
    }
  }
}
