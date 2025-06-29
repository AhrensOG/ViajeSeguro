"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const OurStorySection = () => {
  return (
    <section className="py-16 px-4 bg-custom-white-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Imagen con animación */}
          <motion.div
            className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}>
            <Image
              src="/main/nuestrahistoria.png"
              alt="Fundadores de viaje seguro"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Texto con animación */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}>
            <h2 className="text-3xl font-bold text-custom-black-800 mb-6">
              Nuestra historia
            </h2>
            <p className="text-custom-gray-700 mb-4">
              Todo comenzó en 2019, cuando Javier y Chela, dos amigos
              apasionados por los viajes, se encontraron con un problema
              recurrente: la falta de opciones de transporte confiables y
              económicas entre ciudades españolas.
            </p>
            <p className="text-custom-gray-700 mb-4">
              Tras experimentar cancelaciones de última hora, comisiones
              excesivas y falta de garantías en otras plataformas, decidieron
              crear una alternativa que realmente pusiera a los viajeros en
              primer lugar.
            </p>
            <p className="text-custom-gray-700 mb-6">
              <span className="font-medium">Viaje Seguro</span> nació con la
              visión de transformar el transporte compartido en España,
              ofreciendo una plataforma donde la confiabilidad, la transparencia
              y la seguridad no fueran características opcionales, sino la base
              de cada viaje.
            </p>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}>
              <div className="bg-custom-golden-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-custom-golden-700" />
              </div>
              <p className="text-custom-gray-800 font-medium">
                Desde entonces, hemos conectado a muchisimos viajeros en
                toda España.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
