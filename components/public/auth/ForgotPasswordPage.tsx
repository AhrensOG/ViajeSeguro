"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";
import { ArrowLeft } from "lucide-react";
import ForgotPasswordForm from "./auxiliarComponents/forgot-password/ForgotPasswordForm";

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex">
            <main className="grow">
                {/* Auth Card */}
                <div className="h-full overflow-hidden flex flex-col md:flex-row">
                    {/* Image Column - Only visible on desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="hidden md:block md:w-[60%] relative"
                    >
                        <Image
                            src="/main/login.jpg"
                            alt="Viaje seguro y confortable"
                            fill
                        />
                    </motion.div>

                    {/* Form Column */}
                    <div className="md:w-[40%] grid place-items-center w-full h-full">
                        <div className="w-full p-2">
                            {/* Back to home link */}
                            <Link
                                href="/"
                                className="inline-flex items-center text-sm text-custom-gray-600 hover:text-black"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Volver a la página principal
                            </Link>

                            {/* Form Animation */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="p-6"
                            >
                                <ForgotPasswordForm />
                            </motion.div>

                            {/* Additional Info */}
                            <div className="p-6 pt-0 text-center">
                                <p className="text-sm text-custom-gray-600">
                                    Al registrarte, aceptas nuestra{" "}
                                    <a
                                        href="#"
                                        className="font-medium text-custom-golden-600 hover:text-custom-golden-700 duration-300"
                                    >
                                        Política de Privacidad
                                    </a>{" "}
                                    y{" "}
                                    <a
                                        href="#"
                                        className="font-medium text-custom-golden-600 hover:text-custom-golden-700 duration-300"
                                    >
                                        Términos de Servicio
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPasswordPage;
