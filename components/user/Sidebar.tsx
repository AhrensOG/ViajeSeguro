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
import { fetchUserData } from "@/lib/api/client-profile";
import AvatarUploader from "./profile/auxiliarComponents/AvatarUploader";

type Role = "CLIENT" | "DRIVER" | "PARTNER" | "ADMIN";

type LinkItem = {
  name: string;
  href: string;
  icon: ReactNode;
  roles: Role[];
};

const ALL_LINKS: LinkItem[] = [
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const userRole = (session?.user?.role as Role | undefined) ?? undefined;

  const filteredLinks = ALL_LINKS.filter((link) =>
    link.roles.includes(userRole as Role)
  );

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

  useEffect(() => {
    const loadAvatar = async () => {
      if (!session?.user?.id) return;
      try {
        const profile = await fetchUserData(session.user.id);
        setAvatarUrl(profile.avatarUrl || null);
      } catch {
        setAvatarUrl(null);
      }
    };
    loadAvatar();
  }, [session?.user?.id]);

  if (status === "loading") {
    return (
      <aside className="hidden h-full max-h-[750px] sticky top-24 max-w-80 w-full rounded-2xl border border-gray-200 bg-white shadow-sm md:flex flex-col my-4 py-4">
        <div className="flex flex-col items-center mb-8 animate-pulse">
          <div className="bg-amber-50 rounded-full w-[105px] h-[105px] flex items-center justify-center">
            <span className="text-3xl font-bold text-amber-500">U</span>
          </div>
          <div className="mt-3 h-6 w-40 bg-gray-100 rounded" />
        </div>
        <nav className="flex flex-col gap-2 px-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl" />
          ))}
        </nav>
      </aside>
    );
  }

  if (!userRole) return null;

  return (
    <aside className="hidden h-full max-h-[750px] sticky top-24 max-w-80 w-full rounded-2xl border border-gray-200 bg-white shadow-sm md:flex flex-col my-4 py-4">
      <AvatarUploader
        currentAvatarUrl={avatarUrl}
        userName={session?.user?.name || ""}
        userLastName={session?.user?.lastName || ""}
        userId={session?.user?.id}
        onAvatarUpdated={(url) => setAvatarUrl(url)}
      />

      <nav className="flex flex-col px-2">
        {filteredLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center text-sm font-medium gap-3 px-4 py-3.5 rounded-xl transition-all my-0.5 ${
                isActive
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
              }`}>
              {link.icon}
              <span className="flex items-center gap-2">
                {link.name}
                {link.href === "/dashboard/partner/rider-requests" && newRRCount > 0 && (
                  <span className="inline-flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full min-w-[20px] h-[20px] px-1">
                    {newRRCount}
                  </span>
                )}
              </span>
            </Link>
          );
        })}

        <div className="border-t border-gray-100 mt-2 pt-2 px-2">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex items-center text-sm font-medium gap-3 w-full px-4 py-3.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-200"
          >
            <LogOut className="size-5" />
            Cerrar sesión
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
