import { BACKEND_URL } from "@/lib/constants";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleLoginData } from "@/lib/types/authTypes";

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
async function loginGoogle(data: GoogleLoginData): Promise<Response> {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response;
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
            if (account?.provider === "google") {
                let userData;
                const email = user.email || "";
                const password = account.providerAccountId;
                const res = await loginGoogle({ email, password });

                if (res.status === 401) {
                    const res = await fetch(BACKEND_URL + "/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: user.name?.split(" ")[0],
                            lastName: user.name?.split(" ")[1],
                            email: user.email,
                            password: account.providerAccountId,
                            googleId: user.id,
                            role: "CLIENT",
                        }),
                    });
                    if (res.status === 401) {
                        return null;
                    }
                    if (res.status === 201) {
                        const res = await loginGoogle({ email, password });
                        userData = await res.json();
                        return { ...token, ...userData };
                    }
                }
                userData = await res.json();

                return { ...token, ...userData };
            }

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
                role: token.user.role,
            };
            session.backendTokens = token.backendTokens;
            return session;
        },
    },
};
