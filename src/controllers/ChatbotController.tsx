import { prisma } from "@/lib/prisma";
import {
  ChatbotContent,
  Chatbots,
  User,
  UserCredentials,
} from "@prisma/client";

export type ChatbotResultByIdAndUserIdType = Chatbots & {
  chatbotContent: ChatbotContent[]; // Assuming chatbotContent is an array
  user: User & {
    userCredentails: UserCredentials | null; // Nullable if no credentials exist
  };
};

export default class ChatbotController {
  async create(
    title: string,
    knowledgeBase: string,
    useCase: string,
    userId: string,
    collectionId: string,
    pathways: string,
    globalPrompt: string
  ) {
    try {
      const result = await prisma.chatbots.create({
        data: {
          title,
          useCase,
          userId,
          collectionId,
          pathways,
          globalPrompt,
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async getChatbotById(id: string): Promise<Chatbots | undefined> {
    try {
      const result = await prisma.chatbots.findUnique({
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

  async getChatbotAllDetailsById(id: string) {
    try {
      const result: any = await prisma.chatbots.findUnique({
        where: {
          id,
        },
        include: {
          chatbotContent: true,
          user: {
            include: {
              userCredentials: true,
            },
          },
        },
      });

      if (result) {
        // Transform the UserCredentials key
        result.user.userCredentials = result.user.UserCredentials;
        delete result.user.UserCredentials; // Optionally remove the original key
        return result;
      }
    } catch (e) {
      throw e;
    }
  }

  async getAllChatbotDetailsById(id: string) {
    try {
      const result: any = await prisma.chatbots.findUnique({
        where: {
          id,
        },
        include: {
          chatbotContent: {
            where: {
              chatbotId: id,
            },
          },
          user: {
            include: {
              userCredentials: true,
            },
          },
        },
      });

      if (result && result.user) {
        // Transform the UserCredentials key
        result.user.userCredentials = result.user.UserCredentials;
        delete result.user.UserCredentials; // Optionally remove the original key
      }
      return result;
    } catch (e) {
      return e;
    }
  }

  async getChatBotsByUserId(userId: string) {
    try {
      const result = await prisma.chatbots.findMany({
        where: {
          userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async upsert(
    id: string,
    title: string,
    globalPrompt: string,
    userId: string,
    collectionId: string,
    useCase: string,
    pathways: string
  ) {
    try {
      const chatbotJson: any = {};

      if (id) {
        chatbotJson["id"] = id;
      }
      if (title) {
        chatbotJson["title"] = title;
      }
      if (globalPrompt) {
        chatbotJson["globalPrompt"] = globalPrompt;
      }
      if (userId) {
        chatbotJson["userId"] = userId;
      }
      if (collectionId) {
        chatbotJson["collectionId"] = collectionId;
      }
      if (useCase) {
        chatbotJson["useCase"] = useCase;
      }
      if (pathways) {
        chatbotJson["pathways"] = pathways;
      }
      const finalJson = {
        where: {
          id: id,
        },
        update: chatbotJson,
        create: chatbotJson,
      };

      const result = await prisma.chatbots.upsert(finalJson);
    console.log(result)
      return result;
    } catch (e) {
      throw e;
    }
  }
}
