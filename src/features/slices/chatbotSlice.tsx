import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  chatbotContentType,
  chatbotMessageContentType,
  chatbotMessagesType,
  chatBotsType,
  useCaseEnum,
} from "@/schemas/chatbot.index";

import { userState } from "./userSlice";
import { chatbotImpl } from "../logic/chatbotImpl";

export interface chatbotState {
  id: string;
  title: string;
  useCase: useCaseEnum;
  messages: chatbotMessagesType[]; // particular session Messages
  messagesHistory: chatbotMessagesType[];
  pathways: string;
  globalPrompt: string;
  collectionId: string;
  messageEntityId: string;
  chatbotContent: chatbotContentType[];
  chatBots: chatBotsType[];
  loading: boolean;
  sessionId: string;
  user: userState | undefined;
  createdAt?: string;
  updatedAt?: string;
}

const initialState: chatbotState = {
  id: "",
  title: "",
  useCase: useCaseEnum.Support,
  messages: [],
  messagesHistory: [],
  chatbotContent: [],
  pathways: "",
  globalPrompt: "",
  collectionId: "",
  messageEntityId: "",
  chatBots: [],
  loading: false,
  sessionId: "",
  user: undefined,
  createdAt: "",
  updatedAt: "",
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    setMessages(
      state,
      action: PayloadAction<{
        messages: chatbotMessageContentType;
      }>
    ) {
      if (state.messageEntityId === "") {
        state.messageEntityId = uuidv4();
        state.messages.push({ id: state.messageEntityId, messages: [] });
      }
      const existingMessage = state.messages.find(
        (message) => message.id === state.messageEntityId
      );
      if (existingMessage) {
        existingMessage.messages.push(action.payload.messages);
      }
    },

    setMessageEntityId(
      state,
      action: PayloadAction<{ messageEntityId: string }>
    ) {
      state.messageEntityId = action.payload.messageEntityId;
    },
    createNewChat(state) {
      state.messageEntityId = uuidv4();
      state.messages.push({ id: state.messageEntityId, messages: [] });
    },
    setChatbotState(
      state,
      action: PayloadAction<{ key: string; value: string }>
    ) {
      state[action.payload.key] = action.payload.value;
    },
    setChatbotId(state, action: PayloadAction<{ id: string }>) {
      state.id = action.payload.id;
    },
    setChatbotContent(
      state,
      action: PayloadAction<{ chatbotContent: chatbotContentType[] }>
    ) {
      state.chatbotContent = action.payload.chatbotContent;
    },
  },
});

export const createChatbotAsync = createAsyncThunk(
  "chatbot/createChatbot",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const chatbotImplHandler = new chatbotImpl();
      chatbotImplHandler.initFromState(state.chatbot);
      chatbotImplHandler.createChatbot();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const initChatbotListFromBackendAsync = createAsyncThunk(
  "chatbot/initChatbotListFromBackend",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const chatbotImplHandler = new chatbotImpl();
    const response = await chatbotImplHandler.getChatbotsByUserId();
    return response;
  }
);

export const initChatbotContentFromBackendAsync = createAsyncThunk(
  "chatbot/initChatbotContentFromBackend",
  async (_, thunkAPI) => {
    const chatbotImplHandler = new chatbotImpl();
    const response = await chatbotImplHandler.getChatbotContent();

    return response;
  }
);

export default chatbotSlice.reducer;
