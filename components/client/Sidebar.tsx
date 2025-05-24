"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User, CreditCard, CalendarDays, LogOut } from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const userRole = session?.user?.role;

    const links = [
        {
            name: "Perfil",
            href: "/dashboard/client/profile",
            icon: <User className="size-5" />,
            roles: ["CLIENT", "DRIVER"], // visible para ambos
        },
        {
            name: "Reservas",
            href: "/dashboard/client/reservations",
            icon: <CalendarDays className="size-5" />,
            roles: ["CLIENT"], // solo CLIENT
        },
        {
            name: "Pagos",
            href: "/dashboard/client/payments",
            icon: <CreditCard className="size-5" />,
            roles: ["CLIENT"], // visible para ambos
        },
        {
            name: "Viajes",
            href: "/dashboard/client/trips",
            icon: <CalendarDays className="size-5" />,
            roles: ["DRIVER"], // solo DRIVER
        },
    ];

    const filteredLinks = userRole ? links.filter((link) => link.roles.includes(userRole)) : [];

    return (
        <aside className="hidden h-full max-h-[750px] sticky top-24 max-w-80 w-full rounded-xl border border-custom-gray-300 bg-custom-white-100 text-custom-black-800 shadow-md md:flex flex-col my-4 py-4">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-custom-gray-200 grid place-items-center rounded-full w-[105px] h-[105px]">
                    <User className="w-10 h-10 text-custom-gray-600" />
                </div>
                <h2 className="mt-3 text-xl font-bold">{session?.user?.name ?? "Usuario"}</h2>
            </div>

            <nav className="flex flex-col">
                {filteredLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center text-base font-semibold gap-3 p-5 transition-all border-l-8 hover:border-custom-golden-600 hover:bg-custom-golden-100 hover:text-custom-golden-700 ${
                                isActive ? "border-custom-golden-600 text-custom-golden-700" : "border-transparent"
                            }`}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    );
                })}

                <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="flex items-center text-base font-semibold gap-3 p-5 transition-all border-l-8 border-transparent hover:border-custom-golden-600 hover:bg-custom-golden-100 hover:text-custom-golden-700"
                >
                    <LogOut className="size-5" />
                    Cerrar sesión
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
