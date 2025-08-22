// middleware.ts
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Role = "ADMIN" | "CLIENT" | "DRIVER" | "PARTNER" | "OWNER";

const redirect = (req: NextRequest, to: string) =>
  NextResponse.redirect(new URL(to, req.url));

const ACCESS_RULES: Array<{ prefix: string; roles: Role[] }> = [
  // USER & PARTNER
  {
    prefix: "/dashboard/user",
    roles: ["CLIENT", "PARTNER", "DRIVER", "ADMIN"],
  },
  // DRIVER
  {
    prefix: "/dashboard/driver",
    roles: ["DRIVER", "ADMIN"],
  },
  // PARTNER
  {
    prefix: "/dashboard/partner",
    roles: ["PARTNER", "ADMIN"],
  },
  // QR
  {
    prefix: "/qr",
    roles: ["ADMIN", "DRIVER"],
  },
  // ADMIN
  {
    prefix: "/admin",
    roles: ["ADMIN"],
  },
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) return redirect(req, "/auth/login");

  const role = (token as any)?.user?.role as Role | undefined;
  if (!role) return redirect(req, "/unauthorized");

  const { pathname } = req.nextUrl;

  const rule = ACCESS_RULES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) {
    return NextResponse.next();
  }

  if (!rule.roles.includes(role)) {
    return redirect(req, "/unauthorized");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/user/:path*",
    "/dashboard/driver/:path*",
    "/dashboard/partner/:path*",
    "/admin/:path*",
    "/qr/:path*",
  ],
};
