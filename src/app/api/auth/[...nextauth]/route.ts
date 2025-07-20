import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "email",
            credentials: {
                email: { label: "email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password;

                const user = { id: "1",email: "kahan@gmail.com", password: "123456" }

                if (user) {
                    return user
                } else {
                    return null
                }
            }
        }),

    ],
    
})

export { handler as GET, handler as POST }