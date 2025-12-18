import { BACKEND_URL } from "@/lib/constants";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleLoginData } from "@/lib/types/authTypes";
import { cookies } from "next/headers";

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

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          if (errorData && typeof errorData === 'object') {
            throw new Error(JSON.stringify(errorData));
          }
          throw new Error("Authentication failed");
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
      const cookie = (await cookies()).get("referralCode")?.value;
      const desiredRoleCookie = (await cookies()).get("desiredRole")?.value;

      if (account?.provider === "google") {
        let userData;
        const email = user.email || "";
        const password = account.providerAccountId;
        const res = await loginGoogle({ email, password });

        if (res.status === 401) {
          const role = desiredRoleCookie === "PARTNER" ? "PARTNER" : "CLIENT";
          const res = await fetch(BACKEND_URL + "/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name?.split(" ")[0] || "Google",
              lastName: user.name?.split(" ")[1] || "User",
              email: user.email,
              password: account.providerAccountId,
              googleId: user.id,
              role,
              avatarUrl: user.image,
              referralCodeFrom: cookie,
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
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          if (errorData && typeof errorData === 'object') {
            throw new Error(JSON.stringify(errorData));
          }
          throw new Error("Google Authentication failed");
        }

        userData = await res.json();
        return { ...token, ...userData };
      }

      if (user) return { ...token, ...user };
      // Si no existen tokens del backend en el JWT, devolver token tal cual
      type BackendTokens = { expiresIn?: number; refreshToken?: string;[k: string]: unknown };
      type TokenShape = JWT & { backendTokens?: BackendTokens };
      const bt = (token as TokenShape).backendTokens;
      if (!bt) return token;
      // Si no hay expiresIn válido, no intentes refrescar
      if (typeof bt.expiresIn !== "number") return token;
      // Si aún no expiró, mantener token
      if (Date.now() < bt.expiresIn) return token;
      // Refrescar solo si hay refreshToken disponible
      if (!bt.refreshToken) return token;
      try {
        return await refreshAccessToken(token);
      } catch {
        // Si falla el refresh, devolver el token actual sin romper la sesión
        return token;
      }
    },

    async session({ session, token }) {
      type BackendTokens = { expiresIn?: number; refreshToken?: string;[k: string]: unknown };
      type TokenUser = {
        id: string;
        email: string;
        emailVerified: boolean;
        avatarUrl?: string;
        googleId?: string;
        name?: string;
        lastName?: string;
        role?: string;
      };
      type TokenShape = JWT & { user?: TokenUser; backendTokens?: BackendTokens };
      const t = token as TokenShape;
      // Cuando no hay usuario autenticado, evitar acceder a propiedades inexistentes
      if (!t?.user) {
        return session;
      }
      // Asignar datos de usuario con type-safe (evitar any)
      (session as unknown as { user: Record<string, unknown> }).user = {
        id: t.user.id,
        email: t.user.email,
        emailVerified: t.user.emailVerified,
        avatarUrl: t.user.avatarUrl,
        googleId: t.user.googleId,
        name: t.user.name,
        lastName: t.user.lastName,
        role: t.user.role,
      };
      if (t.backendTokens) {
        (session as unknown as { backendTokens?: BackendTokens }).backendTokens = t.backendTokens;
      }
      return session;
    },
  },
};
