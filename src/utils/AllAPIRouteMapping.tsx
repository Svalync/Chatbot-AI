import { get } from "http";

const AllAPIRouteMapping = {
  users: {
    add: {
      apiPath: "/api/auth/user",
      method: "POST",
    },
    getUser: {
      apiPath: "/api/user",
      method: "GET",
    },
  },
  userCredential: {
    create: {
      apiPath: '/api/usercredential',
      method: 'POST',
    },
    getData: {
      apiPath: '/api/usercredential/get',
      method: 'GET',
    },
    createAPIKey: {
      apiPath: '/api/usercredential/apiKey',
      method: 'POST',
    },
  },
  files: {
    upload: {
      apiPath: '/api/files/upload',
      method: 'POST',
    },
  },
  chatbot: {
    create: {
      apiPath: '/api/chatbot/create',
      method: 'POST',
    },
    promptResponse: {
      apiPath: '/api/chatbot/chat-completion',
      method: 'POST',
    },
    getStatus: {
      apiPath: '/api/chatbot/get-status',
      method: 'GET',
    },
    specificStatus: {
      apiPath: '/api/chatbot/specific-status',
      method: 'GET',
    },
    getChatbots: {
      apiPath: '/api/chatbot/get-chatbots',
      method: 'GET',
    },
    specificChatbot: {
      apiPath: '/api/chatbot/specific-chatbot',
      method: 'GET',
    },
    getMessages: {
      apiPath: '/api/chatbot/get-messages/',
      method: 'GET',
    },
    getAllMessages: {
      apiPath: '/api/chatbot/get-allmessages',
      method: 'GET',
    },
    getTranscript: {
      apiPath: '/api/chatbot/get-transcript',
      method: 'GET',
    },
    uploadContentToVectorDatabase: {
      apiPath: '/api/chatbot/content',
      method: 'POST',
    },
  },
};

export default AllAPIRouteMapping;
