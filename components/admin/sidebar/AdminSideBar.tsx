"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, FileText, Users, CalendarDays, LogOut, Home, Car, Truck, MapPin } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const menuItems = [
    { name: "Inicio", icon: <Home size={20} />, isHome: true },
    { name: "Usuarios", icon: <Users size={20} /> },
    { name: "Ciudades", icon: <MapPin size={20} /> },
    { name: "Reservas", icon: <FileText size={20} /> },
    { name: "Pagos", icon: <Coins size={20} /> },
    { name: "Viajes", icon: <CalendarDays size={20} /> },
    { name: "Vehiculos", icon: <Car size={20} /> },
    { name: "Ofertas Furgonetas", icon: <Truck size={20} /> },
    { name: "Reservas Furgonetas", icon: <CalendarDays size={20} /> },
];

const AdminSideBar = ({ onSelect }: { onSelect: (itemName: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <AnimatePresence>
            <motion.nav
                className="h-screen pb-3 bg-custom-white-50 shadow-md flex flex-col overflow-y-auto border-r border-custom-gray-200 rounded-r-xl relative min-w-14 max-w-[285px]"
                initial={{ width: 56 }}
                animate={{ width: isOpen ? 285 : 56 }}
                exit={{ width: 56 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                role="navigation"
                aria-label="Sidebar de administración"
            >
                {/* Logo */}
                <div className="relative w-full pb-4 px-3 pt-3">
                    <button
                        className="pl-0.5 font-bold text-custom-black-900 text-2xl focus:outline-none"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => router.push("/")}
                        onMouseEnter={(e) => e.stopPropagation()}
                    >
                        V<span className="text-custom-golden-600">S</span>
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col flex-1 space-y-1 px-2">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.name}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-custom-golden-100 transition-all duration-200 group focus:outline-none ${
                                item.isHome ? "mb-2 mt-1" : ""
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                                if (item.isHome) {
                                    router.push("/");
                                } else {
                                    const slug = item.name.toLowerCase().replace(/\s+/g, "-");
                                    onSelect(slug);
                                }
                            }}
                            type="button"
                            aria-label={item.name}
                        >
                            <span className="text-custom-golden-600">{item.icon}</span>
                            <motion.span
                                className={`text-sm text-custom-black-800 whitespace-nowrap font-medium transition-all duration-200 group-hover:text-custom-golden-600 ${
                                    !isOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
                                }`}
                                aria-hidden={!isOpen}
                            >
                                {item.name}
                            </motion.span>
                        </motion.button>
                    ))}

                    {/* Logout */}
                    <motion.button
                        className="flex items-center gap-3 px-3 py-2 mt-auto rounded-md cursor-pointer hover:bg-custom-golden-100 transition-all duration-200 group focus:outline-none"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.05 + 0.1 }}
                        onClick={() => signOut({ callbackUrl: "/" })}
                        type="button"
                        aria-label="Cerrar sesión"
                    >
                        <span className="text-custom-golden-600">
                            <LogOut size={20} />
                        </span>
                        <motion.span
                            className={`text-sm text-custom-black-800 whitespace-nowrap font-medium transition-all duration-200 group-hover:text-custom-golden-600 ${
                                !isOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
                            }`}
                            aria-hidden={!isOpen}
                        >
                            Cerrar Sesión
                        </motion.span>
                    </motion.button>
                </div>
            </motion.nav>
        </AnimatePresence>
    );
};

export default AdminSideBar;
