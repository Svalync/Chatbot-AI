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
  apiKey: configEnv.claude.apiKey,
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
    const responses = [
      {
        type: "message_start",
        message: {
          id: "msg_01DXH7HKYKNdJJRgAwGakG8E",
          type: "message",
          role: "assistant",
          model: "claude-3-5-sonnet-20240620",
          content: [],
          stop_reason: null,
          stop_sequence: null,
          usage: {
            input_tokens: 2640,
            cache_creation_input_tokens: 0,
            cache_read_input_tokens: 0,
            output_tokens: 5,
          },
        },
      },
      {
        type: "content_block_start",
        index: 0,
        content_block: {
          type: "text",
          text: "",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: "Certainly! I'll",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: " use the",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: " CHATBOT_RESPONSE",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: " tool to provide",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: " a friendly greeting",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: " and introduce",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: " Zifto",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: "'s services to",
        },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: " the user.",
        },
      },
      {
        type: "content_block_stop",
        index: 0,
      },
      {
        type: "content_block_start",
        index: 1,
        content_block: {
          type: "tool_use",
          id: "toolu_017NuufM4CgcAF38HcP63rYF",
          name: "CHATBOT_RESPONSE",
          input: {},
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: '{"respon',
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: 'se": "Hello',
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " an",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "d welcome t",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "o Zifto! ",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "👋\\n",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "\\nWe're deli",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ghte",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "d to  ",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "n assi",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "st you today",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: ". How can I",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " help",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " you with ou",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "r p",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "erson",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "alized gif",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ting",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " service",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "s? Whe",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ther you're",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " loo",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "king for ha",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ndm",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ade paintin",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "gs, met",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "al posters",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: ", or other u",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "niqu",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "e gifts",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " for specia",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "l oc",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "casions,",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " we",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "'re here ",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "to make",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " y",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "our giftin",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "g experie",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "nce me",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "morab",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "le.\\n\\nIs ",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "there anyth",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ing speci",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "fic y",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ou'd like t",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "o know abo",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ut our prod",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "uc",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "ts",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " or",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: " se",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: "rvice",
        },
      },
      {
        type: "content_block_delta",
        index: 1,
        delta: {
          type: "input_json_delta",
          partial_json: 's?"}',
        },
      },
      {
        type: "content_block_stop",
        index: 1,
      },
      {
        type: "message_delta",
        delta: {
          stop_reason: "tool_use",
          stop_sequence: null,
        },
        usage: {
          output_tokens: 171,
        },
      },
      {
        type: "message_stop",
      },
    ];
    // const response = await anthropic.messages.create({
    //   model: "claude-3-5-sonnet-20240620",
    //   max_tokens: 1000,
    //   temperature: 0,
    //   tools: this.tools,
    //   system: this.systemPrompt,
    //   messages: this.messages,
    //   stream: true,
    // });

    let responseText = "";
    let isCapturing = false;
    let jsonBuffer = "";
    const newAllResponses: any = [];

    for await (const chunk of responses) {
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
