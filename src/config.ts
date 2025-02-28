const env = process.env.NEXT_PUBLIC_ENV || '';


const dev: any = {
    nextEnv: process.env.NEXT_PUBLIC_ENV || '',
    nextAuth: {
        secret: process.env.NEXTAUTH_SECRET || '',
        url: process.env.DEV_NEXTAUTH_URL || '',
    },
    app: {
        url: process.env.NEXT_PUBLIC_DEV_API_URL || '',
        socketHostUrl: process.env.NEXT_PUBLIC_SOCKET_HOST_URL || '',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        apiKey: process.env.GOOGLE_API_KEY || '',
    },
};


const prod: any = {
    nextEnv: process.env.NEXT_PUBLIC_ENV || '',
    nextAuth: {
        secret: process.env.NEXTAUTH_SECRET || '',
        url: process.env.DEV_NEXTAUTH_URL || '',
    },
    app: {
        url: process.env.NEXT_PUBLIC_DEV_API_URL || '',
        socketHostUrl: process.env.NEXT_PUBLIC_SOCKET_HOST_URL || '',
    },
    google: {
        clientId: process.env.DEV_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.DEV_GOOGLE_CLIENT_SECRET || '',
        apiKey: process.env.DEV_GOOGLE_API_KEY || '',
    },
};



const config: any = {
  dev,
  prod,
};

export default config[env];