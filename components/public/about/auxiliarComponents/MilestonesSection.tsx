"use client";

import { motion } from "framer-motion";
import React from "react";

const milestones = [
  {
    year: "2019",
    text: "Fundación de Viaje Seguro por Javier y Chela con la visión de transformar el transporte compartido.",
    position: "left",
  },
  {
    year: "2020",
    text: "Lanzamiento de la primera versión de nuestra plataforma, conectando inicialmente 5 ciudades principales.",
    position: "right",
  },
  {
    year: "2021",
    text: "Alcanzamos los 100.000 usuarios registrados y expandimos nuestra cobertura a 20 ciudades en España.",
    position: "left",
  },
  {
    year: "2022",
    text: "Implementamos nuestro innovador sistema de verificación y seguridad, estableciendo un nuevo estándar en el sector.",
    position: "right",
  },
  {
    year: "2023",
    text: "Reconocidos como la plataforma de viajes compartidos más confiable de España y superamos el medio millón de usuarios.",
    position: "left",
  },
];

const MilestonesSection = () => {
  return (
    <section className="py-20 px-4 bg-custom-white-100">
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-custom-black-800 mb-4">
            Nuestro camino
          </h2>
          <p className="text-custom-gray-600">
            Desde nuestra fundación, hemos alcanzado importantes hitos que
            marcan nuestro crecimiento y compromiso con la comunidad.
          </p>
        </div>

        {/* Línea de tiempo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-custom-golden-500 z-0"></div>

        {/* Hitos */}
        {milestones.map((milestone, i) => {
          const isLeft = milestone.position === "left";
          const containerClasses = isLeft
            ? "md:w-5/12 md:pr-8 md:text-right"
            : "md:w-5/12 md:ml-auto md:pl-8";

          return (
            <motion.div
              key={milestone.year}
              className={`relative mb-24 z-10`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}>
              {/* Punto */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-2">
                <div className="h-4 w-4 rounded-full bg-custom-golden-600 z-10"></div>
              </div>

              {/* Contenido */}
              <div className={containerClasses}>
                <div className="bg-custom-white-50 p-5 rounded-lg shadow-sm border border-custom-gray-300">
                  <h3 className="font-bold text-custom-black-800 mb-1">
                    {milestone.year}
                  </h3>
                  <p className="text-custom-gray-700">{milestone.text}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MilestonesSection;
