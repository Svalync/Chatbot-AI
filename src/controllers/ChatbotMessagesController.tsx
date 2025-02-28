import { prisma } from "@/lib/prisma";
import { ChatbotMessages, Prisma } from "@prisma/client";

export default class ChatbotMessagesController {
  async upsertById(
    id: string,
    messages: string,
    chatbotId: string,
    sessionId: string,
    ipAddress: string,
    userAgent: string
  ) {
    try {
      const chatbotMessages: any = {};

      if (id) {
        chatbotMessages["id"] = id;
      }

      if (messages) {
        chatbotMessages["messages"] = messages;
      }

      if (chatbotId) {
        chatbotMessages["chatbotId"] = chatbotId;
      }

      if (sessionId) {
        chatbotMessages["sessionId"] = sessionId;
      }

      if (ipAddress) {
        chatbotMessages["ipAddress"] = ipAddress;
      }

      if (userAgent) {
        chatbotMessages["userAgent"] = userAgent;
      }

      const result = await prisma.chatbotMessages.upsert({
        where: { id: id },
        update: chatbotMessages,
        create: chatbotMessages,
      });

      return result;
    } catch (e) {
      throw e;
    }
  }

  async getMessagesBySessionId(sessionId: string) {
    try {
      const result = await prisma.chatbotMessages.findMany({
        where: {
          sessionId: sessionId,
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async getMessagesByChatbotId(
    chatbotId: string
  ): Promise<ChatbotMessages[] | undefined> {
    try {
      const result: ChatbotMessages[] = await prisma.chatbotMessages.findMany({
        where: {
          chatbotId,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      });
      if (result) {
        return result;
      }
    } catch (e) {
      throw e;
    }
  }
  async getTranscriptByUserId(
    userId: string
  ): Promise<ChatbotMessages[] | undefined> {
    try {
      const result: ChatbotMessages[] = await prisma.chatbotMessages.findMany({
        where: {
          // userId,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      });
      if (result) {
        return result;
      }
    } catch (e) {
      throw e;
    }
  }

  async updateById(
    id: string,
    messages: string,
    chatbotId: string,
    sessionId: string,
    content: string,
    ipAddress: string,
    userAgent: string
  ) {
    try {
      const chatbotMessages: any = {};

      if (id) {
        chatbotMessages["id"] = id;
      }

      if (messages) {
        chatbotMessages["messages"] = messages;
      }

      if (chatbotId) {
        chatbotMessages["chatbotId"] = chatbotId;
      }

      if (sessionId) {
        chatbotMessages["sessionId"] = sessionId;
      }

      if (content) {
        chatbotMessages["content"] = content;
      }

      if (ipAddress) {
        chatbotMessages["ipAddress"] = ipAddress;
      }

      if (userAgent) {
        chatbotMessages["userAgent"] = userAgent;
      }

      const finalJson = {
        where: {
          id: id,
        },
        data: chatbotMessages,
      };
      const result = await prisma.chatbotMessages.update(finalJson);

      return result;
    } catch (e) {
      return e;
    }
  }

  async getEditorStateById(id: string): Promise<ChatbotMessages | undefined> {
    try {
      const result = await prisma.chatbotMessages.findFirst({
        where: {
          id,
        },
      });
      if (result) {
        return result;
      }
    } catch (e) {
      throw e;
    }
  }

  async getAllMessages() {
    try {
      const result = await prisma.chatbotMessages.findMany();
      return result;
    } catch (e) {
      return e;
    }
  }
}
