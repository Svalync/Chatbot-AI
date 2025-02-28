
import { prisma } from "@/lib/prisma";
import { ChatbotContentStatusType } from "@/schemas/chatbot.index";

export default class ChatbotContentController {
  async create(
    userId: string,
    chatbotId: string,
    content: string,
    status: string
  ) {
    try {
      const result = await prisma.chatbotContent.create({
        data: {
          chatbotId,
          content,
          status,
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }
  async updateStatusById(id: string, status: string) {
    try {
      const result = await prisma.chatbotContent.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async updateStatusAndContentById(
    id: string,
    status: string,
    content: string
  ) {
    try {
      const result = await prisma.chatbotContent.update({
        where: {
          id,
        },
        data: {
          status,
          content,
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async upsertById(
    id: string,
    status: ChatbotContentStatusType,
    content: string,
    chatbotId: string
  ) {
    try {
      let chatbotContentJson = {
        status: "PENDING",
        content: "",
        chatbotId: "",
      };

      if (id) {
        chatbotContentJson["id"] = id;
      }

      if (status) {
        chatbotContentJson["status"] = status;
      }

      if (content) {
        chatbotContentJson["content"] = content;
      }

      if (chatbotId) {
        chatbotContentJson["chatbotId"] = chatbotId;
      }

      const result = await prisma.chatbotContent.upsert({
        where: {
          id,
        },
        update: chatbotContentJson,
        create: chatbotContentJson,
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async getChatbotContentByChatbotId(chatbotId: string) {
    try {
      const result = await prisma.chatbotContent.findMany({
        where: {
          chatbotId,
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }
}
