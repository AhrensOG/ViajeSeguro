"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
    return (
        <section className="relative bg-[url('/main/iniciovs.jpeg')] bg-no-repeat bg-center bg-cover sm:bg-cover md:bg-cover w-full sm:min-h-[480px]">
            {/* Overlay para mejorar legibilidad */}
            <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
            <div className="relative w-full mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 text-center text-custom-white-100">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mx-auto font-extrabold mb-3 sm:mb-4 
                               text-xl sm:text-2xl md:text-5xl 
                               leading-snug sm:leading-snug md:leading-tight 
                               max-w-[20rem] sm:max-w-2xl md:max-w-4xl 
                               break-words"
                >
                    <span className="block text-4xl sm:text-5xl md:text-7xl text-custom-golden-600">Viaje Seguro</span>
                    <span className="block mt-2 text-3xl sm:text-4xl md:text-6xl font-semibold">
                         la plataforma más fácil para alquilar vehículos y compartir viajes por toda España, como pasajero o conductor
                    </span>
                </motion.h1>

                {/* <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="mx-auto font-semibold sm:font-bold 
                               text-sm sm:text-base md:text-xl 
                               leading-relaxed sm:leading-relaxed md:leading-normal 
                               max-w-[22rem] sm:max-w-2xl md:max-w-3xl 
                               mb-6 sm:mb-8 break-words"
                >
                    Viajes regulares entre Madrid-Barcelona-València.<br /><br />
                    Viaja cómodo y ahorra gastos con nuestra red de transporte privado.
                </motion.p> */}

                {/* Imagen de fondo adicional (mantener oculta para evitar empuje) */}
                <div className="relative max-w-7xl mx-auto hidden md:block">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <Image src="/main/iniciovs.jpeg" alt="Grupo de pasajeros disfrutando de un coche compartido ViajeSeguro" fill priority />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
