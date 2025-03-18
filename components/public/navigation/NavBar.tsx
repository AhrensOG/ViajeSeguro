"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Ellipsis, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 bg-first-white z-50 w-full shadow-sm">
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
                        className="text-first-black font-medium hover:text-first-golden transition"
                    >
                        Servicios
                    </Link>
                    <Link
                        href="#rutas"
                        className="text-first-gray hover:text-first-black transition"
                    >
                        Rutas
                    </Link>
                    <Link
                        href="#precios"
                        className="text-first-gray hover:text-first-black transition"
                    >
                        Precios
                    </Link>
                    <Link
                        href="#contacto"
                        className="text-first-gray hover:text-first-black transition"
                    >
                        Contacto
                    </Link>
                    {/* Dropdown para opciones de usuario en versión escritorio */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsUserMenuOpen(true)}
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                        <button
                            className="flex items-center gap-1 bg-second-white text-first-black rounded-full p-2 hover:transition"
                        >
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
                                    className="absolute right-0 mt-2 w-40 bg-first-white shadow-lg rounded-md z-10"
                                >
                                    <Link
                                        href="/perfil"
                                        className="block px-4 py-2 text-sm text-first-black hover:bg-gray-100"
                                    >
                                        Perfil
                                    </Link>
                                    <Link
                                        href="/viajes"
                                        className="block px-4 py-2 text-sm text-first-black hover:bg-gray-100"
                                    >
                                        Viajes
                                    </Link>
                                    <Link
                                        href="/mis-compras"
                                        className="block px-4 py-2 text-sm text-first-black hover:bg-gray-100"
                                    >
                                        Mis compras
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </nav>

                <button
                    className="md:hidden text-first-black focus:outline-none"
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
                        className="md:hidden bg-first-white shadow-md absolute top-full left-0 w-full p-4"
                    >
                        <nav className="flex flex-col items-start space-y-4">
                            <Link
                                href="#servicios"
                                className="text-first-black font-medium hover:text-first-golden transition"
                            >
                                Servicios
                            </Link>
                            <Link
                                href="#rutas"
                                className="text-first-gray hover:text-first-black transition"
                            >
                                Rutas
                            </Link>
                            <Link
                                href="#precios"
                                className="text-first-gray hover:text-first-black transition"
                            >
                                Precios
                            </Link>
                            <Link
                                href="#contacto"
                                className="text-first-gray hover:text-first-black transition"
                            >
                                Contacto
                            </Link>
                        </nav>

                        <hr className="my-4 border-t border-gray-300" />

                        <nav className="flex flex-col items-start space-y-4">
                            <Link
                                href="/perfil"
                                className="text-first-black font-medium hover:text-first-golden transition"
                            >
                                Perfil
                            </Link>
                            <Link
                                href="/viajes"
                                className="text-first-gray hover:text-first-black transition"
                            >
                                Viajes
                            </Link>
                            <Link
                                href="/mis-compras"
                                className="text-first-gray hover:text-first-black transition"
                            >
                                Mis compras
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default NavBar;
