/*eslint-disable @typescript-eslint/no-unused-vars*/
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
/*eslint-enable @typescript-eslint/no-unused-vars*/

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            googleId: string;
            name: string;
            lastName: string;
            role: string;
        };

        backendTokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            email: string;
            googleId: string;
            name: string;
            lastName: string;
            role: string;
        };

        backendTokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}