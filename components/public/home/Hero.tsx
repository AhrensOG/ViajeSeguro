"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
    return (
        <section className="relative bg-[url('/main/iniciovs.jpeg')] bg-no-repeat bg-top sm:bg-top sm:bg-contain md:bg-cover py-16 w-full sm:h-[480px]">
            <div className="w-full mx-auto px-4 text-center text-custom-white-100">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-3xl md:text-5xl font-extrabold mb-4 max-w-4xl mx-auto"
                >
                    ViajeSeguro – Tu plataforma de coche compartido en España
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="text-xl mb-8 font-bold max-w-2xl mx-auto"
                >
                    Comparte tu viaje entre Madrid, Barcelona y Valencia. Ahorra gastos y viaja cómodo con nuestra red de transporte privado.
                </motion.p>

                <div className="relative max-w-7xl mx-auto">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <Image src="/main/iniciovs.jpeg" alt="Grupo de pasajeros disfrutando de un coche compartido ViajeSeguro" fill priority />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
