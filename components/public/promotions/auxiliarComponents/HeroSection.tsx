"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative text-custom-white-100 py-20 px-4"
      style={{
        backgroundImage: "url('/main/heroPromotion.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Capa oscura para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      <motion.div
        className="max-w-5xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <motion.span
          className="bg-custom-white-100 text-custom-golden-700 border-0 p-1 px-4 rounded-full font-medium inline-block"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}>
          Descuentos Exclusivos
        </motion.span>

        <motion.h1
          className="text-4xl md:text-5xl font-bold my-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}>
          Viaja más por menos con nuestras promociones
        </motion.h1>

        <motion.p
          className="text-xl max-w-3xl mx-auto mb-8 opacity-90 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}>
          Descubre nuestros planes de ahorro diseñados para hacer tus viajes más
          económicos y disfrutar de beneficios exclusivos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}>
          <Link
            href={"#promotions"}
            className="bg-custom-white-100 text-custom-golden-700 hover:bg-custom-white-50 px-8 py-2 text-lg font-medium rounded-lg inline-block">
            ¡Empieza a ahorrar ahora!
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;