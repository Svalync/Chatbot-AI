import { chatbotMessageContentType } from "@/schemas/chatbot.index";

export default class HelperFunctions {
  static async convertMessagesToClaudeFormat(
    messages: chatbotMessageContentType[]
  ) {
    let claudeFormatMessages: any[] = [];
    for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {
      const formattedMessage = {
        role: messages[messageIndex].role === "system" ? "assistant" : "user",
        content: [
          {
            type: "text",
            text: messages[messageIndex].content,
          },
        ],
      };
      claudeFormatMessages.push(formattedMessage);
    }
    return claudeFormatMessages;
  }
}
