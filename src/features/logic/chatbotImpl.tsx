import { chatbotState } from '@/features/slices/chatbotSlice';
import { userState } from '@/features/slices/userSlice';
import axiosInstance from '@/lib/axios';
import { chatbotContentType, chatbotMessageContentType, chatbotMessagesType, chatBotsType, useCaseEnum } from '@/schemas/chatbot.index';
import AllAPIRouteMapping from '@/utils/AllAPIRouteMapping';
import userImpl from './userImpl';
import { FileGlobal } from '@/app/components/FileUploaderInput';

export class chatbotImpl implements chatbotState {
  id: string = '';
  user: userState | undefined;
  messageEntityId: string = '';
  title: string = '';
  useCase: useCaseEnum = useCaseEnum.Support;
  messages: chatbotMessagesType[] = []; // particular session Messages
  messagesHistory: chatbotMessagesType[] = [];
  chatbotContent: chatbotContentType[] = [];
  pathways: string = '';
  globalPrompt: string = '';
  chatBots: chatBotsType[] = [];
  collectionId: string = '';
  loading: boolean = false;
  sessionId: string = '';

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
      if (typeof data.chatbotContent === 'string') {
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

 

  setUser(user: userState) {
    if (user) {
      const userImplHandler = new userImpl();
      userImplHandler.initDataFromBackend(user);
      this.user = userImplHandler;
    }
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

  async createChatbot() {
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload(this);
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.chatbot.create.apiPath, AllAPIRouteMapping.chatbot.create.method);
    return response;
  }

  async generatePromptAnswerByChatbotId(chatbotId: string) {
    const messages: chatbotMessagesType | undefined = this.messages.find((message) => message.id === this.messageEntityId);

    this.id = chatbotId;

    const payload = {
      messages: [messages],
      id: this.id,
      sessionId: this.sessionId,
    };
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload(payload);
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.chatbot.promptResponse.apiPath, AllAPIRouteMapping.chatbot.promptResponse.method);
    if (response.success) {
      return response.data;
    }
  }

  async getChatbotsById(id: string) {
    const params = {
      id,
    };
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setParams(params);
    const response: any = await axiosInstanceHandler.makeCall(`${AllAPIRouteMapping.chatbot.specificChatbot.apiPath}`, AllAPIRouteMapping.chatbot.specificChatbot.method);
    if (response.success) {
      return response.data;
    }
  }
  async getChatbotsByUserId() {
    const axiosInstanceHandler = new axiosInstance();
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.chatbot.getChatbots.apiPath, AllAPIRouteMapping.chatbot.getChatbots.method);
    if (response.success) {
      return response.data;
    }
  }

  async initChatbotMessagesFromBackend() {
    const params = {
      sessionId: this.sessionId,
    };
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setParams(params);
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.chatbot.getMessages.apiPath, AllAPIRouteMapping.chatbot.getMessages.method);
    if (response.success) {
      return response.data;
    }
  }
  async getMessagesByChatbotId(chatbotId: string) {
    const params = {
      chatbotId: chatbotId,
    };
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setParams(params);
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.chatbot.getAllMessages.apiPath, AllAPIRouteMapping.chatbot.getAllMessages.method);

    if (response.success) {
      return response.data;
    }
  }
  async getTranscriptByUserId() {
    const axiosInstanceHandler = new axiosInstance();
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.chatbot.getTranscript.apiPath, AllAPIRouteMapping.chatbot.getTranscript.method);

    if (response.success) {
      return response.data;
    }
  }

  async getChatbotContent() {
    const axiosInstanceHandler = new axiosInstance();
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.chatbot.getStatus.apiPath, AllAPIRouteMapping.chatbot.getStatus.method);
    if (response.success) {
      return response.data;
    }
  }
  async getChatbotContentByChatbotId(chatbotId: string) {
    const axiosInstanceHandler = new axiosInstance();
    const response: any = await axiosInstanceHandler.makeCall(`${AllAPIRouteMapping.chatbot.specificStatus.apiPath}/?id=${chatbotId}`, AllAPIRouteMapping.chatbot.specificStatus.method);
    if (response.success) {
      return response.data;
    }
  }

 

  async uploadFilesToVectorDatabase() {
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload(this);
    const response: any = await axiosInstanceHandler.makeCall(`${AllAPIRouteMapping.chatbot.uploadContentToVectorDatabase.apiPath}`, AllAPIRouteMapping.chatbot.uploadContentToVectorDatabase.method);
    if (response.success) {
      return response.data;
    }
  }

 async handleImageUpload(image: string, name: string): Promise<any> {
    const paylod = {
      image,
      name,
    };

    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload(paylod);
    const response = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.files.upload.apiPath, AllAPIRouteMapping.files.upload.method);
    return response?.uploadedURL;
  }
   async handleMultipleFileUpload(files: FileGlobal[]): Promise<any> {
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload({ files });
    const response = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.files.upload.apiPath, AllAPIRouteMapping.files.upload.method);
    return response?.uploadedURL;
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

  pushMessageHistory(messageHistory: chatbotMessagesType) {
    this.messagesHistory.push(messageHistory);
  }

  getChatbotImplVariables() {
    return this;
  }

  toJson() {
    let json = {};

    if (this.messageEntityId) {
      json['messageEntityId'] = this.messageEntityId;
    }
    if (this.title) {
      json['title'] = this.title;
    }
    if (this.useCase) {
      json['useCase'] = this.useCase;
    }
    if (this.messages) {
      json['messages'] = this.messages;
    }
    if (this.chatBots) {
      json['chatBots'] = this.chatBots;
    }
    if (this.loading !== undefined) {
      json['loading'] = this.loading;
    }
    if (this.sessionId) {
      json['sessionId'] = this.sessionId;
    }

    return json;
  }
}
