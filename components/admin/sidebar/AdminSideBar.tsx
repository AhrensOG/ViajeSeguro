"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, FileText, Users, CalendarDays, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Usuarios", icon: <Users size={20} /> },
  { name: "Reservas", icon: <FileText size={20} /> },
  { name: "Pagos", icon: <Coins size={20} /> },
  { name: "Viajes", icon: <CalendarDays size={20} /> },
];

const AdminSideBar = ({
  onSelect,
}: {
  onSelect: (itemName: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatePresence>
      <motion.nav
        className="h-screen pb-3 bg-custom-white-50 shadow-md flex flex-col overflow-hidden border-r border-custom-gray-200 rounded-r-xl relative min-w-14 max-w-[200px]"
        initial={{ width: 56 }}
        animate={{ width: isOpen ? 160 : 56 }}
        exit={{ width: 56 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        role="navigation"
        aria-label="Sidebar de administración">
        {/* Logo */}
        <div className="relative w-full pb-4 px-3 pt-3">
          <p
            className="pl-0.5 font-bold text-custom-black-900 text-2xl"
            onMouseEnter={(e) => e.stopPropagation()}>
            {/* <Image src="/main/logoNoBg.png" alt="viaje-seguro-logo" fill priority sizes="128px" style={{ objectFit: "contain" }} /> */}
            V<span className="text-custom-golden-600">S</span>
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col flex-1 space-y-1 px-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.name}
              className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-custom-golden-100 transition-all duration-200 group focus:outline-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(item.name)}
              type="button"
              aria-label={item.name}>
              <span className="text-custom-golden-600">{item.icon}</span>
              <motion.span
                className={`text-sm text-custom-black-800 whitespace-nowrap font-medium transition-all duration-200 group-hover:text-custom-golden-600 ${
                  !isOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
                aria-hidden={!isOpen}>
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
            aria-label="Cerrar sesión">
            <span className="text-custom-golden-600">
              <LogOut size={20} />
            </span>
            <motion.span
              className={`text-sm text-custom-black-800 whitespace-nowrap font-medium transition-all duration-200 group-hover:text-custom-golden-600 ${
                !isOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
              aria-hidden={!isOpen}>
              Cerrar Sesión
            </motion.span>
          </motion.button>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default AdminSideBar;
