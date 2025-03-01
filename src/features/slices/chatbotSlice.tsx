import { v4 as uuidv4 } from "uuid";
import { chatbotImpl } from "@/features/logic/chatbotImpl";
import {
  chatbotContentType,
  chatbotMessageContentType,
  chatbotMessagesType,
  chatBotsType,
  SendChatBotSchemaType,
  useCaseEnum,
} from "@/schemas/chatbot.index";

import { RootState } from "@/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userState } from "./userSlice";
import { userCredentialState } from "./userCredentialSlice";
import { FileGlobal } from "@/app/components/FileUploaderInput";

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
  extraReducers: (builder) => {
    builder
      .addCase(generatePromptAnswerByChatbotIdAsync.pending, (state) => {
        // Optional: set loading state if needed
      })
      .addCase(
        generatePromptAnswerByChatbotIdAsync.fulfilled,
        (state, action: PayloadAction<chatbotMessageContentType>) => {
          // setMessages({ messages: action.payload });
        }
      )
      .addCase(
        generatePromptAnswerByChatbotIdAsync.rejected,
        (state, action) => {
          // Optional: handle rejected state if needed
        }
      )
      .addCase(initChatbotsFromBackendAsync.pending, (state) => {
        // Optional: set loading state if neededs
        state.loading = true;
      })
      .addCase(
        initChatbotsFromBackendAsync.fulfilled,
        (state, action: PayloadAction<chatBotsType[]>) => {
          // return { ...state, ...action.payload, loading: false };
          state.chatBots = action.payload;
          state.loading = false;
        }
      )
      .addCase(initChatbotsFromBackendAsync.rejected, (state, action) => {
        // Optional: handle rejected state if needed
      })
      .addCase(initSpecificChatbotFromBackendAsync.pending, (state) => {
        // Optional: set loading state if neededs
        state.loading = true;
      })
      .addCase(
        initSpecificChatbotFromBackendAsync.fulfilled,
        (state, action: PayloadAction<chatbotState>) => {
          // return { ...state, ...action.payload, loading: false };
          // state.specificChatbot = action.payload?.specificChatbot;

          state.id = action.payload.id;
          state.title = action.payload.title;
          state.useCase = action.payload.useCase;
          state.messages = action.payload.messages;
          state.pathways = action.payload.pathways;
          state.globalPrompt = action.payload.globalPrompt;
          state.collectionId = action.payload.collectionId;
          state.chatbotContent = action.payload.chatbotContent;

          state.user = action.payload?.user;
          console.log(state.user, "stateUser");
          // state.sessionId = getSessionId(
          //   state.user?.userCredentials[0] as userCredentialState
          // );
          state.loading = false;
        }
      )
      .addCase(
        initSpecificChatbotFromBackendAsync.rejected,
        (state, action) => {
          // Optional: handle rejected state if needed
        }
      )
      .addCase(initChatbotMessagesFromBackendAsync.pending, (state) => {
        // Optional: set loading state if neededs
      })
      .addCase(
        initChatbotMessagesFromBackendAsync.fulfilled,
        (state, action: PayloadAction<chatbotState>) => {
          // return { ...state, ...action.payload, loading: false };
          state.messages = action.payload.messages;
        }
      )
      .addCase(
        initChatbotMessagesFromBackendAsync.rejected,
        (state, action) => {
          // Optional: handle rejected state if needed
        }
      )
      .addCase(getMessagesByChatbotIdAsync.pending, (state) => {
        // Optional: set loading state if neededs
      })
      .addCase(
        getMessagesByChatbotIdAsync.fulfilled,
        (state, action: PayloadAction<chatbotState>) => {
          // return { ...state, ...action.payload, loading: false };

          state.messagesHistory = action.payload.messagesHistory;
        }
      )
      .addCase(getMessagesByChatbotIdAsync.rejected, (state, action) => {
        // Optional: handle rejected state if needed
      });
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

export const generatePromptAnswerByChatbotIdAsync = createAsyncThunk(
  "chatbot/generatePromptAnswerByChatbotId",
  async (payload: { chatbotId: string }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const chatbotImplHandler = new chatbotImpl();
      chatbotImplHandler.initFromState(state.chatbot);
      const data = await chatbotImplHandler.generatePromptAnswerByChatbotId(
        payload.chatbotId
      );
      thunkAPI.dispatch(setMessages({ messages: data }));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const initChatbotsFromBackendAsync = createAsyncThunk(
  "chatbot/initChatbotsFromBackend",
  async (_, thunkAPI) => {
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

export const initChatbotMessagesFromBackendAsync = createAsyncThunk(
  "chatbot/initChatbotMessagesFromBackend",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const chatbotImplHandler = new chatbotImpl();
    chatbotImplHandler.initFromState(state.chatbot);
    const response = await chatbotImplHandler.initChatbotMessagesFromBackend();
    return response;
  }
);
export const getMessagesByChatbotIdAsync = createAsyncThunk(
  "chatbot/getMessagesByChatbotId",
  async (id: string, thunkAPI) => {
    const chatbotImplHandler = new chatbotImpl();
    const response = await chatbotImplHandler.getMessagesByChatbotId(id);
    return response;
  }
);
export const initTranscriptListFromBackendAsync = createAsyncThunk(
  "chatbot/initTranscriptListFromBackend",
  async (id: string, thunkAPI) => {
    const chatbotImplHandler = new chatbotImpl();
    const response = await chatbotImplHandler.getTranscriptByUserId();
    return response;
  }
);

export const initSpecificChatbotFromBackendAsync = createAsyncThunk(
  "chatbot/initSpecificChatbotFromBackend",
  async (id: string, thunkAPI) => {
    const chatbotImplHandler = new chatbotImpl();
    const response = await chatbotImplHandler.getChatbotsById(id);
    return response;
  }
);

export const initSpecificChatbotContentFromBackendAsync = createAsyncThunk(
  "chatbot/initSpecificChatbotContentFromBackend",
  async (chatbotId: string, thunkAPI) => {
    const chatbotImplHandler = new chatbotImpl();
    const response = await chatbotImplHandler.getChatbotContentByChatbotId(
      chatbotId
    );

    return response;
  }
);

export const uploadFilesToVectorDatabaseAsync = createAsyncThunk(
  "chatbot/uploadFilesToVectorDatabase",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    if (state.chatbot.chatbotContent.length > 0) {
      const chatbotImplHandler = new chatbotImpl();
      chatbotImplHandler.initFromState(state.chatbot);
      const response = await chatbotImplHandler.uploadFilesToVectorDatabase();
      return response;
    }
  }
);

export const handleImageUploadAsync = createAsyncThunk(
  "workflowEditor/handleImageUpload",
  async (payload: { image: string; name: string }, thunkAPI) => {
    const chatbotImplHandler = new chatbotImpl();
    const imageURL = await chatbotImplHandler.handleImageUpload(
      payload.image,
      payload.name
    );
    return { imageURL };
  }
);

export const handleMultipleFileUploadAsync = createAsyncThunk(
  "chatbot/handleMultipleFileUpload",
  async (payload: { files: FileGlobal[] }, thunkAPI) => {
    const chatbotImplHandler = new chatbotImpl();
    const files = await chatbotImplHandler.handleMultipleFileUpload(
      payload.files
    );
    return { files };
  }
);

function getSessionId(userCredentials: userCredentialState) {
  if (typeof window !== "undefined") {
    const sessionObj = localStorage.getItem("SVALYNC_CHATBOT_SESSION_ID");

    if (sessionObj !== null) {
      const sessionJson = JSON.parse(sessionObj);
      if (sessionJson[userCredentials.id]) {
        const expiryDate = new Date(sessionJson[userCredentials.id].expiry);
        const isExpired = expiryDate < new Date();
        if (isExpired) {
          return createSessionId(userCredentials, sessionJson);
        } else {
          return sessionJson[userCredentials.id].value;
        }
      } else {
        return createSessionId(userCredentials, sessionJson);
      }
    } else {
      return createSessionId(userCredentials, {});
    }
  } else {
    return "";
  }
}

function createSessionId(
  userCredentials: userCredentialState,
  sessionObj: any
) {
  const now = new Date();
  sessionObj[userCredentials.id] = {
    value: uuidv4(),
    expiry: now.getTime() + 3600000, // 1 hour
  };
  localStorage.setItem(
    "SVALYNC_CHATBOT_SESSION_ID",
    JSON.stringify(sessionObj)
  );
  return sessionObj[userCredentials.id].value;
}

export function getInitialChatbotState() {
  return initialState;
}

export const {
  setChatbotId,
  setMessages,
  setMessageEntityId,
  createNewChat,
  setChatbotState,
  setChatbotContent,
} = chatbotSlice.actions;

export const selectChatbot = (state: RootState) => state.chatbot;
export const selectMessageEntityId = (state: RootState) =>
  state.chatbot.messageEntityId;
export const selectMessages = (state: RootState) => state.chatbot.messages;
export const selectChatbots = (state: RootState) => state.chatbot.chatBots;
export const selectUser = (state: RootState) => state.chatbot.user;

export default chatbotSlice.reducer;
