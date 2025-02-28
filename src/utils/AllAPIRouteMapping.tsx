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
  chatbots: {
    get: {
      apiPath: "/api/chatbot",
      method: "GET",
    },
    create: {
      apiPath: "/api/chatbot/create",
      method: "POST",
    },
    getList: {
      apiPath: "/api/chatbot/list",
      method: "GET",
    },
    getStatus: {
      apiPath: "/api/chatbot/get-status",
      method: "GET",
    },
    update: {
      apiPath: "/api/chatbot/update",
      method: "PUT",
    },
    promptResponse: {
      apiPath: "/api/chatbot/chat-completion",
      method: "POST",
    },
  },
};

export default AllAPIRouteMapping;
