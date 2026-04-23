// middleware.ts
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Role = "ADMIN" | "CLIENT" | "DRIVER" | "PARTNER" | "OWNER";

const redirect = (req: NextRequest, to: string) =>
  NextResponse.redirect(new URL(to, req.url));

// Rutas públicas que NO requieren autenticación
const PUBLIC_ROUTES = [
  "/",
  "/auth/",
  "/home2",
  "/about",
  "/contact",
  "/cookies",
  "/faq",
  "/services",
  "/terminos-y-condiciones",
  "/politicas-de-privacidad",
  "/promotions",
  "/rider-request",
  "/vehicle-booking",
  "/payment/cancel",
  "/payment/success",
];

// Rutas que requieren rol específico
const ACCESS_RULES: Array<{ prefix: string; roles: Role[] }> = [
  {
    prefix: "/dashboard/user",
    roles: ["CLIENT", "PARTNER", "DRIVER", "ADMIN"],
  },
  {
    prefix: "/dashboard/driver",
    roles: ["DRIVER", "ADMIN"],
  },
  {
    prefix: "/dashboard/partner",
    roles: ["PARTNER", "ADMIN"],
  },
  {
    prefix: "/qr",
    roles: ["ADMIN", "DRIVER"],
  },
  {
    prefix: "/admin",
    roles: ["ADMIN"],
  },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Verificar si es ruta pública
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Obtener token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si no hay token, redirigir a login
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Obtener rol
  const role = (token as any)?.user?.role as Role | undefined;
  if (!role) return redirect(req, "/unauthorized");

  // Verificar reglas de acceso por rol
  const rule = ACCESS_RULES.find((r) => pathname.startsWith(r.prefix));
  if (rule && !rule.roles.includes(role)) {
    return redirect(req, "/unauthorized");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};