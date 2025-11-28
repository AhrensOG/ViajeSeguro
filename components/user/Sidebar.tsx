"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  CreditCard,
  CalendarDays,
  LogOut,
  Car,
  Tags,
  Route,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { listRiderRequests } from "@/lib/api/rider-requests";

type Role = "CLIENT" | "DRIVER" | "PARTNER" | "ADMIN";

type LinkItem = {
  name: string;
  href: string;
  icon: ReactNode;
  roles: Role[];
};

const ALL_LINKS: LinkItem[] = [
  // CLIENT & PARTNER
  {
    name: "Perfil",
    href: "/dashboard/user/profile",
    icon: <User className="size-5" />,
    roles: ["CLIENT", "PARTNER"],
  },
  {
    name: "Reservas",
    href: "/dashboard/user/reservations",
    icon: <CalendarDays className="size-5" />,
    roles: ["CLIENT", "PARTNER"],
  },
  {
    name: "Pagos",
    href: "/dashboard/user/payments",
    icon: <CreditCard className="size-5" />,
    roles: ["CLIENT", "PARTNER"],
  },

  // DRIVER
  {
    name: "Perfil",
    href: "/dashboard/driver/profile",
    icon: <User className="size-5" />,
    roles: ["DRIVER"],
  },
  {
    name: "Viajes",
    href: "/dashboard/driver/trips",
    icon: <CalendarDays className="size-5" />,
    roles: ["DRIVER"],
  },

  // PARTNER
  {
    name: "Mis vehículos",
    href: "/dashboard/partner/vehicles",
    icon: <Car className="size-5" />,
    roles: ["PARTNER"],
  },
  {
    name: "Ofertas de alquiler",
    href: "/dashboard/partner/offers",
    icon: <Tags className="size-5" />,
    roles: ["PARTNER"],
  },
  {
    name: "Viajes",
    href: "/dashboard/partner/trips",
    icon: <Route className="size-5" />,
    roles: ["PARTNER"],
  },
  {
    name: "Arma tu viaje",
    href: "/dashboard/partner/rider-requests",
    icon: <Route className="size-5" />,
    roles: ["PARTNER"],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [newRRCount, setNewRRCount] = useState<number>(0);

  const userRole = (session?.user?.role as Role | undefined) ?? undefined;

  const filteredLinks = ALL_LINKS.filter((link) =>
    link.roles.includes(userRole as Role)
  );

  // IMPORTANT: Hooks must be called unconditionally on every render.
  // Load badge count here before any early returns.
  useEffect(() => {
    const loadCount = async () => {
      try {
        const toISO = (d: Date) => d.toISOString();
        const now = new Date();
        const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const items = await listRiderRequests({ status: "OPEN", dateFrom: toISO(from) });
        setNewRRCount(Array.isArray(items) ? items.length : 0);
      } catch {
        setNewRRCount(0);
      }
    };
    if (userRole === "PARTNER") loadCount();
  }, [userRole]);

  if (status === "loading") {
    return (
      <aside className="hidden h-full max-h-[750px] sticky top-24 max-w-80 w-full rounded-xl border border-custom-gray-300 bg-custom-white-100 text-custom-black-800 shadow-md md:flex flex-col my-4 py-4">
        <div className="flex flex-col items-center mb-8 animate-pulse">
          <div className="bg-custom-gray-200 rounded-full w-[105px] h-[105px]" />
          <div className="mt-3 h-6 w-40 bg-custom-gray-200 rounded" />
        </div>
        <nav className="flex flex-col gap-2 px-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-custom-gray-200 rounded" />
          ))}
        </nav>
      </aside>
    );
  }

  if (!userRole) return null;

  return (
    <aside className="hidden h-full max-h-[750px] sticky top-24 max-w-80 w-full rounded-xl border border-custom-gray-300 bg-custom-white-100 text-custom-black-800 shadow-md md:flex flex-col my-4 py-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-custom-gray-200 grid place-items-center rounded-full w-[105px] h-[105px]">
          <User className="w-10 h-10 text-custom-gray-600" />
        </div>
        <h2 className="mt-3 text-xl font-bold">
          {session?.user?.name ?? "Usuario"}
        </h2>
      </div>

      <nav className="flex flex-col">
        {filteredLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center text-base font-semibold gap-3 p-5 transition-all border-l-8 hover:border-custom-golden-600 hover:bg-custom-golden-100 hover:text-custom-golden-700 ${
                isActive
                  ? "border-custom-golden-600 text-custom-golden-700"
                  : "border-transparent"
              }`}>
              {link.icon}
              <span className="flex items-center gap-2">
                {link.name}
                {link.href === "/dashboard/partner/rider-requests" && newRRCount > 0 && (
                  <span className="inline-flex items-center justify-center text-xs font-bold text-white bg-red-600 rounded-full min-w-[20px] h-[20px] px-1">
                    {newRRCount}
                  </span>
                )}
              </span>
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center text-base font-semibold gap-3 p-5 transition-all border-l-8 border-transparent hover:border-custom-golden-600 hover:bg-custom-golden-100 hover:text-custom-golden-700">
          <LogOut className="size-5" />
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
