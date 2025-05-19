"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

const CTASection = () => {
  return (
    <motion.section
      className="py-16 px-4 bg-custom-gray-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold text-custom-black-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}>
          ¿Listo para ahorrar en tus viajes?
        </motion.h2>
        <motion.p
          className="text-lg text-custom-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}>
          Elige el plan que mejor se adapte a tus necesidades y empieza a
          disfrutar de descuentos y beneficios exclusivos.
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          viewport={{ once: true }}>
          <Link
            href={"#promotions"}
            className="w-full max-w-60 bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 px-6 py-2 text-lg rounded-md duration-300">
            Ver todos los planes
          </Link>
          <Link
            href={"/contact"}
            target="_blank"
            className="border border-custom-golden-600 text-custom-golden-700 hover:bg-custom-golden-100 px-8 py-2 text-lg rounded-md duration-300">
            Contáctanos para más información
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTASection;
