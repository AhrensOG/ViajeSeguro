"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const FoundersSection = () => {
  return (
    <section className="py-16 px-4 bg-custom-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <motion.h2
          className="text-3xl font-bold text-custom-black-800 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}>
          Nuestros fundadores
        </motion.h2>

        {/* Fundadores */}
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              name: "Javier Albarracin Gené",
              title: "Co-fundador y CEO",
              quote:
                "Creemos que que viajar no es un lujo, sino un derecho accesible para todos, y sobre todo, ha de ser una experiencia agradable, segura y satisfactoria tanto para los usuarios como para conductores, es un ganar ganar para todos.",
              description:
                "Con más de 25 años de experiencia en logística y transportes, Javier identificó la oportunidad de mejorar la experiencia de los viajes compartidos en España. Su visión de crear una plataforma centrada en la seguridad de viajar sin cancelaciones y la confiabilidad ha sido determinante y el motor de VIAJE SEGURO desde sus inicios.",
              image: "/main/img_placeholder.webp",
            },
            {
              name: "Chela Vargas E",
              title: "Co-fundadora y COO",
              quote:
                "Cada decisión que tomamos está guiada por una pregunta lógica… ¿Cómo podemos hacer para este viaje sea mejor, más seguro y accesible para nuestros usuarios?",
              description:
                "Chela es una empresaria con un enfoque de experiencia basada en mejorar la atención, ya que atraves de su actitud sus dones de intermediaria y cambio en la transformación de mejorar VIAJE SEGURO da una atención de calidad, seguridad a todas las personas que nos eligen en este proyecto de servicios y humanidad.",
              image: "/main/img_placeholder.webp",
            },
          ].map((founder, index) => (
            <motion.div
              key={founder.name}
              className="bg-custom-white-100 rounded-xl overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}>
              <div className="relative h-64">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-custom-black-800 mb-2">
                  {founder.name}
                </h3>
                <p className="text-custom-golden-600 font-medium mb-4">
                  {founder.title}
                </p>
                <p className="text-custom-gray-700 mb-4">
                  {founder.description}
                </p>
                <p className="text-custom-gray-700">
                  &quot;{founder.quote}&quot;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
