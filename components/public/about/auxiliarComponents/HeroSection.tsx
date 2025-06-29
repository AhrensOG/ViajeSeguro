"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative bg-custom-black-800 text-custom-white-100 py-20 px-4 overflow-hidden">
      {/* Imagen de fondo */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.2, ease: "easeOut" }}>
        <Image
          src="/main/nosotros.png"
          alt="Equipo de Viaje Seguro"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Contenido */}
      <motion.div
        className="max-w-5xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        transition={{ staggerChildren: 0.2 }}
        variants={{
          hidden: {},
          visible: {},
        }}>
        <motion.span
          className="inline-block bg-custom-golden-600 text-custom-white-100 font-bold hover:bg-custom-golden-700 duration-300 border-0 p-3 py-1 rounded-full mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}>
          Nuestra Historia
        </motion.span>

        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}>
          Transformando la forma de{" "}
          <span className="text-custom-golden-500">viajar en España</span>
        </motion.h1>

        <motion.p
          className="text-xl text-custom-gray-300 max-w-3xl"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, delay: 0.1 }}>
          Nacimos con una misión clara: hacer que viajar sea más accesible,
          cómodo y seguro para todos. Conoce quiénes somos y por qué estamos
          revolucionando el transporte compartido.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
