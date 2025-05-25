"use client";

import { Shield, Target, ThumbsUp, Users } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const values = [
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Seguridad",
    description:
      "La seguridad de nuestros usuarios es nuestra prioridad absoluta. Implementamos múltiples capas de protección para garantizar viajes tranquilos.",
  },
  {
    icon: <ThumbsUp className="h-10 w-10" />,
    title: "Confiabilidad",
    description:
      "Nos comprometemos a ofrecer un servicio en el que puedas confiar, con políticas claras y cumplimiento de compromisos.",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Comunidad",
    description:
      "Fomentamos una comunidad respetuosa donde conductores y pasajeros se benefician mutuamente y comparten experiencias positivas.",
  },
  {
    icon: <Target className="h-10 w-10" />,
    title: "Accesibilidad",
    description:
      "Trabajamos para hacer que viajar sea accesible para todos, con precios justos y opciones para diferentes necesidades.",
  },
];

const OurValuesSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-custom-golden-700 to-custom-golden-500 text-custom-white-100">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold mb-4">Nuestros valores</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Estos principios guían cada decisión que tomamos y cada
            característica que desarrollamos en nuestra plataforma.
          </p>
        </motion.div>

        {/* Valores */}
        <div className="grid md:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}>
              <div className="flex justify-center mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-center mb-3">
                {value.title}
              </h3>
              <p className="text-center opacity-90">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValuesSection;
