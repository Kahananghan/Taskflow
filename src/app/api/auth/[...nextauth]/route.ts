import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (user && user.password === credentials.password) {
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            name: user.name,
                        };
                    }
                } catch (error) {
                    console.error('Auth error:', error);
                }

                return null;
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            return true;
        },
        async redirect({ url, baseUrl }) {
            return '/dashboard';
        },
        async session({ session, token }) {
            return session;
        },
        async jwt({ token, user }) {
            return token;
        }
    },


    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }