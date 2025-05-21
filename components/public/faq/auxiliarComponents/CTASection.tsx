import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CTASection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="bg-custom-gray-100 py-12 px-4 ">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-custom-black-800 mb-4">
          ¿Tienes más preguntas?
        </h2>
        <p className="text-custom-gray-600 mb-8">
          Si no has encontrado la respuesta que buscas, nuestro equipo de
          atención al cliente estará encantado de ayudarte.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact">
            <button className="p-2 rounded-md border cursor-pointer duration-300 bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100">
              Contactar con soporte
            </button>
          </Link>
          <Link href="/">
            <button className="p-2 rounded-md border cursor-pointer duration-300 border-custom-golden-600 text-custom-golden-700 hover:bg-custom-golden-100">
              Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;
