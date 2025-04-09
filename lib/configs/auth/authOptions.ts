import { BACKEND_URL } from "@/lib/constants";
import { log } from "console";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

async function refreshAccessToken(token: JWT): Promise<JWT> {
    log("token: " + token.backendTokens);

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
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
                },
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            log("jwt token: " + token.backendTokens, user, account);

            if (account?.provider === "google") {
                token.expiresAt = account.expires_at;
                token.user = {
                    id: user.id,
                    email: user.email || "",
                    name: user.name?.split(" ")[0] || "",
                    googleId: account.providerAccountId || "",
                    lastName: user.name?.split(" ")[1] || "",
                    role: "",
                };
                token.backendTokens = {
                    accessToken: account.access_token || "",
                    refreshToken: account.refresh_token || "",
                    expiresIn: (account.expires_at ?? 0) * 1000, // Convertir a milisegundos
                };
                return token;
            }

            if (user) return { ...token, ...user };

            if (token.backendTokens && new Date().getTime() < token.backendTokens.expiresIn) return token;

            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user = {
                id: token.user.id,
                email: token.user.email,
                googleId: token.user.googleId,
                name: token.user.name,
                lastName: token.user.lastName,
                role: token.user.role,
            };
            session.backendTokens = token.backendTokens;
            return session;
        },
    },
};
