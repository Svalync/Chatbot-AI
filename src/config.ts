const env = process.env.NEXT_PUBLIC_ENV || "";

const dev: any = {
  nextEnv: process.env.NEXT_PUBLIC_ENV || "",
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET || "",
    url: process.env.DEV_NEXTAUTH_URL || "",
  },
  app: {
    url: process.env.NEXT_PUBLIC_DEV_API_URL || "",
    socketHostUrl: process.env.NEXT_PUBLIC_SOCKET_HOST_URL || "",
  },
  claude: {
    apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY || "",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    apiKey: process.env.GOOGLE_API_KEY || "",
  },
  imageKit: {
    baseURL: process.env.NEXT_PUBLIC_IMAGEKIT_BASEURL || "",
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  },
  resend: {
    apiKey: process.env.DEV_RESEND_API_KEY || "",
  },
  vectorDB: {
    astraDB: {
      applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN || "",
      namespace: process.env.ASTRA_DB_NAMESPACE || "",
      apiEndpoint: process.env.ASTRA_DB_API_ENDPOINT || "",
    },
  },
  langchain: {
    tracing: process.env.LANGCHAIN_TRACING_V2 || "",
    endpoint: process.env.LANGCHAIN_ENDPOINT || "",
    apiKey: process.env.LANGCHAIN_API_KEY || "",
    project: process.env.LANGCHAIN_PROJECT || "",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
  },
  cronitor: {
    apiKey: process.env.CRONITOR_API_KEY || "",
  },
  voyageai: {
    apiKey: process.env.VOYAGE_AI_API_KEY || "",
  },
};

const prod: any = {
  nextEnv: process.env.NEXT_PUBLIC_ENV || "",
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET || "",
    url: process.env.DEV_NEXTAUTH_URL || "",
  },
  app: {
    url: process.env.NEXT_PUBLIC_DEV_API_URL || "",
    socketHostUrl: process.env.NEXT_PUBLIC_SOCKET_HOST_URL || "",
  },
  google: {
    clientId: process.env.DEV_GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.DEV_GOOGLE_CLIENT_SECRET || "",
    apiKey: process.env.DEV_GOOGLE_API_KEY || "",
  },
};

const config: any = {
  dev,
  prod,
};

export default config[env];
