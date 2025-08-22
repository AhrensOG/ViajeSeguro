"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Ellipsis, User, X } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type Role = "ADMIN" | "CLIENT" | "DRIVER" | "PARTNER";

type LinkItem = {
  name: string;
  href: string;
};

const CLIENT_PREFIX = "/dashboard/user"; // si unificas a /dashboard/client, cambias aquí
const DRIVER_PREFIX = "/dashboard/driver";
const PARTNER_PREFIX = "/dashboard/partner";
const ADMIN_HOME = "/admin";

// Enlaces públicos (barra principal)
const PUBLIC_LINKS: LinkItem[] = [
  { name: "Promociones", href: "/promotions" },
  { name: "Inicio", href: "/" },
  { name: "Nosotros", href: "/about" },
  { name: "Servicios", href: "/services" },
  { name: "Contacto", href: "/contact" },
];

// Grupos por funcionalidad (forma única de los menús)
const GROUPS = {
  CLIENT_BASE: [
    { name: "Perfil", href: `${CLIENT_PREFIX}/profile` },
    { name: "Reservas", href: `${CLIENT_PREFIX}/reservations` },
    { name: "Mis pagos", href: `${CLIENT_PREFIX}/payments` },
  ],
  PARTNER_EXTRA: [
    { name: "Mis vehículos", href: `${PARTNER_PREFIX}/vehicles` },
    { name: "Ofertas de alquiler", href: `${PARTNER_PREFIX}/offers` },
    { name: "Viajes compartidos", href: `${PARTNER_PREFIX}/trips` },
  ],
  DRIVER_BASE: [
    { name: "Perfil", href: `${DRIVER_PREFIX}/profile` },
    { name: "Viajes", href: `${DRIVER_PREFIX}/trips` },
  ],
  ADMIN_BASE: [{ name: "Dashboard", href: ADMIN_HOME }],
} satisfies Record<string, LinkItem[]>;

type GroupKey = keyof typeof GROUPS;

const ROLE_COMPOSITION: Record<Role, GroupKey[]> = {
  ADMIN: ["ADMIN_BASE"],
  CLIENT: ["CLIENT_BASE"],
  DRIVER: ["DRIVER_BASE"],
  PARTNER: ["CLIENT_BASE", "PARTNER_EXTRA"],
};

function composeLinksForRole(role?: Role): LinkItem[] {
  if (!role) return [];
  // Si algún día hay solapes, esto evita duplicados por href
  const merged = ROLE_COMPOSITION[role].flatMap((g) => GROUPS[g]);
  const map = new Map<string, LinkItem>();
  merged.forEach((l) => map.set(l.href, l));
  return Array.from(map.values());
}

const NavBar = ({ shadow = true }: { shadow?: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const role = session?.user?.role as Role | undefined;
  const roleLinks = useMemo(() => composeLinksForRole(role), [role]);

  // Renderer genérico para enlaces
  const renderLinks = (
    items: LinkItem[],
    opts?: { variant?: "desktop" | "mobile" }
  ) => {
    const variant = opts?.variant ?? "desktop";
    const className =
      variant === "mobile"
        ? "text-custom-gray-800 hover:text-custom-black-900 transition"
        : "text-custom-gray-800 hover:text-custom-black-900 transition";

    return items.map((item) => (
      <Link key={item.href} href={item.href} className={className}>
        {item.name}
      </Link>
    ));
  };

  const renderUserArea = (variant: "desktop" | "mobile") => {
    const linkClass =
      variant === "mobile"
        ? "text-custom-gray-800 hover:text-custom-black-900 transition"
        : "block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100 w-full text-left";

    if (!session?.user) {
      return (
        <>
          <Link href="/auth/login" className={linkClass}>
            Iniciar sesión
          </Link>
          <Link href="/auth/register" className={linkClass}>
            Registrate
          </Link>
        </>
      );
    }

    return (
      <>
        {roleLinks.map((l) => (
          <Link key={l.href} href={l.href} className={linkClass}>
            {l.name}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={linkClass}>
          Cerrar sesión
        </button>
      </>
    );
  };

  return (
    <header
      className={`h-[60px] sticky top-0 bg-custom-white-100 z-50 w-full ${
        shadow ? "shadow-sm" : ""
      }`}>
      <div className="w-full h-full px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-2xl flex items-center text-custom-white-100"
          aria-label="Ir a inicio">
          <span className="text-custom-gray-800">Viaje</span>
          <span className="text-custom-golden-600">Seguro</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {renderLinks(PUBLIC_LINKS, { variant: "desktop" })}

          {/* User dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}>
            <button
              className="flex items-center gap-1 bg-custom-white-50 text-custom-black-900 rounded-full p-2 hover:transition"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen((s) => !s)}>
              <User className="h-5 w-5" />
              <ChevronDown
                className={`h-4 w-4 ${
                  isUserMenuOpen ? "rotate-180" : ""
                } transition duration-300`}
              />
            </button>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-1 absolute right-0 w-52 bg-custom-white-100 shadow-lg rounded-md z-10"
                  role="menu">
                  {renderUserArea("desktop")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-custom-black-900 focus:outline-none"
          onClick={() => setIsMobileMenuOpen((s) => !s)}
          aria-label="Abrir menú"
          aria-expanded={isMobileMenuOpen}>
          {isMobileMenuOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <Ellipsis className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-custom-white-100 shadow-md absolute top-full left-0 w-full p-4">
            <nav className="flex flex-col items-start space-y-4">
              {renderLinks(PUBLIC_LINKS, { variant: "mobile" })}
            </nav>

            <hr className="my-4 border-t border-gray-300" />

            <nav className="flex flex-col items-start space-y-4">
              {renderUserArea("mobile")}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
