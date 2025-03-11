"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView && { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-24"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView && { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:w-1/2 relative w-full h-96"
          >
            <Image
              src="/main/roadvan.webp"
              alt="Personas viajando cómodamente"
              fill
              className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </motion.div>

          <div className="md:w-1/2 text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={isInView && { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Nunca fue tan fácil viajar entre ciudades
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={isInView && { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 mb-6 leading-relaxed"
            >
              Registra tus datos y accede a <strong>precios sin igual</strong>{" "}
              en tu asiento. Viaja cómodamente entre{" "}
              <strong>Valencia, Madrid y Barcelona</strong> con nuestro servicio
              de transporte <strong>privado y flexible</strong>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView && { opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-4"
            >
              <Link
                href="https://bit.ly/Viajamosespaña"
                className="bg-first-golden hover:bg-second-golden text-white font-medium rounded-full px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Reserva ahora
              </Link>

              <button className="border border-gray-900 text-gray-900 font-medium rounded-full px-6 py-3 transition-all duration-300 hover:bg-gray-900 hover:text-white">
                Contactar
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTA;
