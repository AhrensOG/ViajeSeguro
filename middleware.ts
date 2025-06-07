export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si no está logueado, redirigir al login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const role = token.user?.role;
  const pathname = req.nextUrl.pathname;

  // Reglas por ruta
  if (pathname.startsWith("/dashboard/client")) {
    const allowedRoles = ["CLIENT", "ADMIN", "DRIVER"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (pathname.startsWith("/qr")) {
    const allowedRoles = ["ADMIN", "DRIVER"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/client/:path*", "/admin/:path*", "/qr/:path*"],
};
