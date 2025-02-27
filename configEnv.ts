type NextAuthConfig = {
    secret: string;
    url: string;
};

type StripeConfig = {
    apiKey?: string;
};

type GoogleConfig = {
    clientId?: string;
    clientSecret?: string;
};

type EnvironmentConfig = {
    nextEnv: string;
    nextAuth: NextAuthConfig;
    stripe: StripeConfig;
    google: GoogleConfig;
};

const env = process.env.NEXT_PUBLIC_ENV || '';

const dev: EnvironmentConfig = {
    nextEnv: process.env.NEXT_PUBLIC_ENV || '',
    nextAuth: {
        secret: process.env.NEXTAUTH_SECRET || '',
        url: process.env.DEV_NEXTAUTH_URL || '',
    },
    stripe: {
        apiKey: process.env.NEXT_PUBLIC_STRIPE_API_KEY,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
};

const prod: EnvironmentConfig = {
    nextEnv: process.env.NEXT_PUBLIC_ENV || '',
    nextAuth: {
        secret: process.env.NEXTAUTH_SECRET || '',
        url: process.env.DEV_NEXTAUTH_URL || '',
    },
    stripe: {
        apiKey: process.env.NEXT_PUBLIC_STRIPE_API_KEY,
    },
    google: {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    },
};

const config: Record<string, EnvironmentConfig> = {
    dev,
    prod,
};

export default config[env];