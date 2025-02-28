import {
  chatbotContentType,
  chatbotMessageContentType,
  chatbotMessagesType,
  chatBotsType,
  useCaseEnum,
} from "@/schemas/chatbot.index";
import { chatbotState } from "../slices/chatbotSlice";
import { userState } from "../slices/userSlice";
import axiosInstance from "@/lib/axios";
import AllAPIRouteMapping from "@/utils/AllAPIRouteMapping";

export class chatbotImpl implements chatbotState {
  id: string = "";
  user: userState | undefined;
  messageEntityId: string = "";
  title: string = "";
  useCase: useCaseEnum = useCaseEnum.Support;
  messages: chatbotMessagesType[] = []; // particular session Messages
  messagesHistory: chatbotMessagesType[] = [];
  chatbotContent: chatbotContentType[] = [];
  pathways: string = "";
  globalPrompt: string = "";
  chatBots: chatBotsType[] = [];
  collectionId: string = "";
  loading: boolean = false;
  sessionId: string = "";

  init(state: chatbotState) {
    this.initFromState(state);
  }

  initFromState(data: chatbotState) {
    if (data.id) {
      this.id = data.id;
    }

    if (data.title) {
      this.title = data.title;
    }

    if (data.useCase) {
      this.useCase = data.useCase;
    }

    if (data.messages) {
      this.messages = data.messages;
    }

    if (data.messagesHistory) {
      this.messagesHistory = data.messagesHistory;
    }

    if (data.chatbotContent) {
      if (typeof data.chatbotContent === "string") {
        this.chatbotContent = JSON.parse(data.chatbotContent);
      } else {
        this.chatbotContent = data.chatbotContent;
      }
    }

    if (data.messageEntityId) {
      this.messageEntityId = data.messageEntityId;
    }

    if (data.pathways) {
      this.pathways = data.pathways;
    }

    if (data.chatBots) {
      this.chatBots = data.chatBots;
    }

    if (data.globalPrompt) {
      this.globalPrompt = data.globalPrompt;
    }

    if (data.loading !== undefined) {
      this.loading = data.loading;
    }
    if (data.sessionId) {
      this.sessionId = data.sessionId;
    }

    if (data.collectionId) {
      this.collectionId = data.collectionId;
    }
  }

  initFromAny(data: any) {
    this.initFromState(data);
  }

  initDataFromBackend(data: chatbotState) {
    this.initFromState(data);
  }

  setId(id: string) {
    this.id = id;
  }
  setGlobalPrompt(globalPrompt: string) {
    this.globalPrompt = globalPrompt;
  }

  setCollectionId(collectionId: string) {
    this.collectionId = collectionId;
  }

  setPathways(pathways: string) {
    this.pathways = pathways;
  }

  setMessages(messages: chatbotMessagesType[]) {
    this.messages = messages;
  }

  getId() {
    return this.id;
  }

  addMessages(id: string, messages: chatbotMessageContentType) {
    const existingMessage = this.messages.find((message) => message.id === id);
    if (existingMessage) {
      existingMessage.messages.push(messages);
    } else {
      this.messages.push({ id, messages: [messages] });
    }
  }
  async createChatbot() {
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload(this);
    const response: any = await axiosInstanceHandler.makeCall(
      AllAPIRouteMapping.chatbots.create.apiPath,
      AllAPIRouteMapping.chatbots.create.method
    );
    return response;
  }
  async generatePromptAnswerByChatbotId(chatbotId: string) {
    const messages: chatbotMessagesType | undefined = this.messages.find(
      (message) => message.id === this.messageEntityId
    );

    this.id = chatbotId;

    const payload = {
      messages: [messages],
      id: this.id,
      sessionId: this.sessionId,
    };
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload(payload);
    const response: any = await axiosInstanceHandler.makeCall(
      AllAPIRouteMapping.chatbots.promptResponse.apiPath,
      AllAPIRouteMapping.chatbots.promptResponse.method
    );
    if (response.success) {
      return response.data;
    }
  }
  async getChatbotsByUserId() {
    const axiosInstanceHandler = new axiosInstance();
    const response: any = await axiosInstanceHandler.makeCall(
      AllAPIRouteMapping.chatbots.getList.apiPath,
      AllAPIRouteMapping.chatbots.getList.method
    );
    if (response.success) {
      return response.data;
    }
  }

  async getChatbotContent() {
    const axiosInstanceHandler = new axiosInstance();
    const response: any = await axiosInstanceHandler.makeCall(
      AllAPIRouteMapping.chatbots.getStatus.apiPath,
      AllAPIRouteMapping.chatbots.getStatus.method
    );
    if (response.success) {
      return response.data;
    }
  }
}
