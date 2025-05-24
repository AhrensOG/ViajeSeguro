"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Ellipsis, User, X } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const NavBar = ({ shadow = true }: { shadow?: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role;

  const renderRoleLinks = (isMobile = false) => {
    if (!session?.user) return null;

    const className = isMobile
      ? "text-custom-gray-800 hover:text-custom-black-900 transition"
      : "block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100";

    if (role === "ADMIN") {
      return (
        <Link href="/admin" className={className}>
          Dashboard
        </Link>
      );
    }

    if (role === "CLIENT") {
      return (
        <>
          <Link href="/dashboard/client/profile" className={className}>
            Perfil
          </Link>
          <Link href="/dashboard/client/reservations" className={className}>
            Reservas
          </Link>
          <Link href="#" className={className}>
            Mis compras
          </Link>
        </>
      );
    }

    if (role === "DRIVER") {
      return (
        <>
          <Link href="/dashboard/client/profile" className={className}>
            Perfil
          </Link>
          <Link href="/dashboard/client/trips" className={className}>
            Viajes
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <header
      className={`h-[60px] sticky top-0 bg-custom-white-100 z-50 w-full ${
        shadow ? "shadow-sm" : ""
      }`}>
      <div className="w-full h-full px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-2xl flex items-center text-custom-white-100">
          <span className="text-custom-gray-800">Viaje</span>
          <span className="text-custom-golden-600">Seguro</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/promotions"
            className="text-custom-black-900 hover:text-custom-golden-600 transition font-medium">
            Promociones
          </Link>
          <Link
            href="/services"
            className="text-custom-gray-800 hover:text-custom-black-900 transition">
            Servicios
          </Link>
          <Link
            href="/contact"
            className="text-custom-gray-800 hover:text-custom-black-900 transition">
            Contacto
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}>
            <button className="flex items-center gap-1 bg-custom-white-50 text-custom-black-900 rounded-full p-2 hover:transition">
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
                  transition={{ duration: 0.3 }}
                  className="p-1 absolute right-0 w-44 bg-custom-white-100 shadow-lg rounded-md z-10">
                  {session?.user ? (
                    <>
                      {renderRoleLinks()}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-start block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100">
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100">
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100">
                        Registrate
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <button
          className="md:hidden text-custom-black-900 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <Ellipsis className="h-7 w-7" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-custom-white-100 shadow-md absolute top-full left-0 w-full p-4">
            <nav className="flex flex-col items-start space-y-4">
              <Link
                href="/promotions"
                className="text-custom-black-900 hover:text-custom-golden-600 transition font-medium">
                Promociones
              </Link>
              <Link
                href="/services"
                className="text-custom-gray-800 hover:text-custom-black-900 transition">
                Servicios
              </Link>
              <Link
                href="/contact"
                className="text-custom-gray-800 hover:text-custom-black-900 transition">
                Contacto
              </Link>
            </nav>

            <hr className="my-4 border-t border-gray-300" />

            {session?.user ? (
              <nav className="flex flex-col items-start space-y-4">
                {renderRoleLinks(true)}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-custom-gray-800 hover:text-custom-black-900 transition">
                  Cerrar sesión
                </button>
              </nav>
            ) : (
              <nav className="flex flex-col items-start space-y-4">
                <Link
                  href="/auth/login"
                  className="text-custom-gray-800 hover:text-custom-black-900 transition">
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="text-custom-gray-800 hover:text-custom-black-900 transition">
                  Registrate
                </Link>
              </nav>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
