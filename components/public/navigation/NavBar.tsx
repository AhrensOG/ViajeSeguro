"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Ellipsis, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { data: session } = useSession();
    return (
        <header className="sticky top-0 bg-custom-white-100 z-50 w-full shadow-sm">
            <div className="w-full px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/main/logoNoBg.png"
                        width={100}
                        height={34}
                        alt="Logo"
                    />
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link
                        href="#servicios"
                        className="text-custom-black-900 font-medium hover:text-custom-golden-600 transition"
                    >
                        Servicios
                    </Link>
                    <Link
                        href="#rutas"
                        className="text-custom-gray-800 hover:text-custom-black-900 transition"
                    >
                        Rutas
                    </Link>
                    <Link
                        href="#precios"
                        className="text-custom-gray-800 hover:text-custom-black-900 transition"
                    >
                        Precios
                    </Link>
                    <Link
                        href="#contacto"
                        className="text-custom-gray-800 hover:text-custom-black-900 transition"
                    >
                        Contacto
                    </Link>
                    {/* Dropdown para opciones de usuario en versión escritorio */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsUserMenuOpen(true)}
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                        <button className="flex items-center gap-1 bg-custom-white-50 text-custom-black-900 rounded-full p-2 hover:transition">
                            <User className="h-5 w-5" />
                            <ChevronDown
                                className={`h-4 w-4 ${
                                    isUserMenuOpen ? "rotate-180" : ""
                                } transition duration-300`}
                            />
                        </button>
                        <AnimatePresence>
                            {isUserMenuOpen && session && session?.user ? (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-1 absolute right-0 w-44 text- bg-custom-white-100 shadow-lg rounded-md z-10"
                                >
                                    <Link
                                        href="/perfil"
                                        className="block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100"
                                    >
                                        Perfil
                                    </Link>
                                    <Link
                                        href="/viajes"
                                        className="block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100"
                                    >
                                        Viajes
                                    </Link>
                                    <Link
                                        href="/mis-compras"
                                        className="block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100"
                                    >
                                        Mis compras
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-start block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100"
                                    >
                                        Cerrar sesión
                                    </button>
                                </motion.div>
                            ) : (
                                isUserMenuOpen &&
                                !session && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-1 absolute right-0 w-44 text-center bg-custom-white-100 shadow-lg rounded-md z-10"
                                    >
                                        <Link
                                            href="/auth/login"
                                            className="block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100"
                                        >
                                            Iniciar sesión
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className="block px-4 py-2 text-sm text-custom-black-900 hover:bg-custom-gray-100"
                                        >
                                            Registrate
                                        </Link>
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </div>
                </nav>

                <button
                    className="md:hidden text-custom-black-900 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
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
                        className="md:hidden bg-custom-white-100 shadow-md absolute top-full left-0 w-full p-4"
                    >
                        <nav className="flex flex-col items-start space-y-4">
                            <Link
                                href="#servicios"
                                className="text-custom-black-900 font-medium hover:text-custom-golden-600 transition"
                            >
                                Servicios
                            </Link>
                            <Link
                                href="#rutas"
                                className="text-custom-gray-800 hover:text-custom-black-900 transition"
                            >
                                Rutas
                            </Link>
                            <Link
                                href="#precios"
                                className="text-custom-gray-800 hover:text-custom-black-900 transition"
                            >
                                Precios
                            </Link>
                            <Link
                                href="#contacto"
                                className="text-custom-gray-800 hover:text-custom-black-900 transition"
                            >
                                Contacto
                            </Link>
                        </nav>

                        <hr className="my-4 border-t border-gray-300" />
                        {session && session?.user ? (
                            <nav className="flex flex-col items-start space-y-4">
                                <Link
                                    href="/perfil"
                                    className="text-custom-gray-800 hover:text-custom-black-900 transition"
                                >
                                    Perfil
                                </Link>
                                <Link
                                    href="/viajes"
                                    className="text-custom-gray-800 hover:text-custom-black-900 transition"
                                >
                                    Viajes
                                </Link>
                                <Link
                                    href="/mis-compras"
                                    className="text-custom-gray-800 hover:text-custom-black-900 transition"
                                >
                                    Mis compras
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="text-custom-gray-800 hover:text-custom-black-900 transition"
                                >
                                    Cerrar sesión
                                </button>
                            </nav>
                        ) : (
                            !session && (
                                <nav className="flex flex-col items-start space-y-4">
                                    <Link
                                        href="/auth/login"
                                        className="text-custom-gray-800 hover:text-custom-black-900 transition"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="text-custom-gray-800 hover:text-custom-black-900 transition"
                                    >
                                        Registrate
                                    </Link>
                                </nav>
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default NavBar;
