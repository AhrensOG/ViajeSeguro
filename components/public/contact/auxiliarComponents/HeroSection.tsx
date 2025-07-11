"use client";

import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const HeroSection = () => {
  return (
    <motion.section
      {...fadeIn}
      className="relative text-custom-white-100 py-16 px-4 min-h-[220px] md:min-h-[260px] flex items-center justify-center overflow-hidden">
      {/* Fondo imagen */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('main/contacto.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.85)',
        }}
        aria-hidden="true"
      />
      {/* Capa oscura para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      <div className="max-w-5xl mx-auto text-center relative z-20">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Contacta con{" "}
          <span className="text-custom-golden-500">Viaje Seguro</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-custom-gray-100 max-w-2xl mx-auto drop-shadow">
          Estamos aquí para ayudarte. Envíanos tus preguntas, comentarios o sugerencias.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default HeroSection;
