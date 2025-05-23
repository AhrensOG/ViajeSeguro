"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-custom-black-800 text-custom-white-100">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}>
        <motion.h2 variants={item} className="text-3xl font-bold mb-4">
          Únete a nuestra comunidad
        </motion.h2>

        <motion.p variants={item} className="text-xl opacity-90 mb-8">
          Sé parte de la revolución del transporte compartido. Viaja de forma
          segura, económica y confiable con Viaje Seguro.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap justify-center gap-4">
          {/* Botón Registrarme */}
          <Link
            href={"/auth/register"}
            className="bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-md transition duration-300">
            Registrarme ahora
          </Link>

          {/* Botón Conocer más */}
          <Link
            href={"/faq"}
            className="border border-custom-white-100 text-custom-white-100 hover:bg-custom-white-100 hover:text-custom-black-800 px-8 py-4 text-lg font-semibold rounded-xl transition duration-300 backdrop-blur-sm">
            Conocer más
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
