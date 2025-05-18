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
      className="bg-custom-black-800 text-custom-white-100 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4">
          Contacta con{" "}
          <span className="text-custom-golden-500">Viaje Seguro</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-custom-gray-300 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Envíanos tus preguntas, comentarios o
          sugerencias.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default HeroSection;
