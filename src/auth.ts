import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import configEnv from "../configEnv"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        // signIn: '/',
        error: '/auth/error',
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: configEnv.google.clientId,
            clientSecret: configEnv.google.clientSecret,
        }),
    ],
    callbacks: {
        async session({ session }) {
            return session;
        },
        async jwt({ token, account, trigger, session }) {
            if (trigger == 'update') {
                return { ...token, ...session.user };
            }
            return token;
        },
    },
    session: { strategy: 'jwt' },
})