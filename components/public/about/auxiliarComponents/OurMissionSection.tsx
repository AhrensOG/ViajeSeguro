"use client";

import { Award } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const OurMissionSection = () => {
  return (
    <section className="py-16 px-4 bg-custom-white-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}>
            <h2 className="text-3xl font-bold text-custom-black-800 mb-6">
              Nuestra misión
            </h2>
            <p className="text-custom-gray-700 mb-4">
              En Viaje Seguro, nuestra misión es transformar la forma en que las
              personas viajan en España, proporcionando una plataforma de
              transporte compartido que prioriza la seguridad, la confiabilidad
              y la accesibilidad.
            </p>
            <p className="text-custom-gray-700 mb-4">
              Nos esforzamos por crear conexiones significativas entre
              conductores y pasajeros, fomentando una comunidad basada en el
              respeto mutuo y la confianza. Queremos que cada viaje sea más que
              un simple trayecto: una experiencia positiva que contribuya a un
              sistema de transporte más sostenible y humano.
            </p>
            <p className="text-custom-gray-700 mb-6">
              Estamos comprometidos con la innovación continua, escuchando
              activamente a nuestra comunidad para mejorar constantemente
              nuestros servicios y adaptarnos a sus necesidades cambiantes.
            </p>

            <div className="flex items-center gap-3">
              <div className="bg-custom-golden-100 p-2 rounded-full">
                <Award className="h-5 w-5 text-custom-golden-700" />
              </div>
              <p className="text-custom-gray-800 font-medium">
                Reconocidos como la plataforma de viajes compartidos más
                confiable de España en 2023.
              </p>
            </div>
          </motion.div>

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/main/mision.png"
              alt="Equipo de Viaje Seguro trabajando"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurMissionSection;
