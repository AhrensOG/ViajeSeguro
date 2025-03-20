import { BACKEND_URL } from "@/lib/constants";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token: JWT): Promise<JWT> {
    const res = await fetch(BACKEND_URL + "/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Refresh ${token.backendTokens.refreshToken}`,
        },
    });

    const response = await res.json();
    return {
        ...token,
        backendTokens: response,
    };
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;
                const { email, password } = credentials;
                const res = await fetch(BACKEND_URL + "/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (res.status === 401) {
                    return null;
                }

                const user = await res.json();
                return user;
            },
        })
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) return { ...token, ...user };

            if (new Date().getTime() < token.backendTokens.expiresIn) return token;

            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user = {
                id: token.user.id,
                email: token.user.email,
                googleId: token.user.googleId,
                name: token.user.name,
                lastName: token.user.lastName,
                role: token.user.role
            };
            session.backendTokens = token.backendTokens;
            return session;
        },
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };