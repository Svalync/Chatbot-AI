import { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

export enum ClaudeToolsEnum {
  ChatbotResponse = "CHATBOT_RESPONSE",
}

const ToolConfigs: Record<ClaudeToolsEnum, Tool> = {
  [ClaudeToolsEnum.ChatbotResponse]: {
    name: ClaudeToolsEnum.ChatbotResponse,
    description: "Generates a chatbot response.",
    input_schema: {
      type: "object",
      properties: {
        response: {
          type: "string",
          description: "The message that will be shown to the user",
        },
      },
      required: ["response"],
    },
  },
};

export const getClaudeTool = (tool: ClaudeToolsEnum) => {
  return ToolConfigs[tool];
};
