"use client";

import { Clock, Shield, TrendingUp } from "lucide-react";
import React from "react";
import { motion, Variants } from "framer-motion";

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ProblemWeSolveSection = () => {
  return (
    <section className="py-16 px-4 bg-custom-white-100">
      <div className="max-w-6xl mx-auto">
        {/* Título y descripción */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-custom-black-800 mb-4">
            Los problemas que resolvemos
          </h2>
          <p className="text-custom-gray-600 max-w-3xl mx-auto">
            Identificamos varios desafíos en el mercado actual de viajes
            compartidos que afectan tanto a pasajeros como a conductores.
            Nuestra plataforma está diseñada para abordar estos problemas
            directamente.
          </p>
        </motion.div>

        {/* Tarjetas */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Clock className="h-6 w-6 text-custom-golden-700" />,
              title: "Cancelaciones sin aviso",
              description:
                "Muchos usuarios han experimentado cancelaciones de última hora sin explicación ni alternativas, dejándolos varados y sin opciones.",
              solution:
                "Política de cancelación estricta con penalizaciones para conductores que cancelen sin motivo justificado, y reembolso garantizado para los pasajeros afectados.",
            },
            {
              icon: <TrendingUp className="h-6 w-6 text-custom-golden-700" />,
              title: "Comisiones excesivas",
              description:
                "Las plataformas existentes cobran comisiones de hasta el 25%, encareciendo los viajes para los pasajeros y reduciendo los ingresos de los conductores.",
              solution:
                "Modelo de comisiones transparente y justo, con tarifas significativamente más bajas que la competencia, beneficiando tanto a conductores como a pasajeros.",
            },
            {
              icon: <Shield className="h-6 w-6 text-custom-golden-700" />,
              title: "Falta de seguridad",
              description:
                "Muchos usuarios se sienten inseguros al viajar con desconocidos, y las plataformas actuales ofrecen pocas garantías de seguridad y verificación.",
              solution:
                "Verificación rigurosa de identidad, sistema de valoraciones detallado, seguimiento GPS opcional y seguro de viaje incluido en cada trayecto.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={itemVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-custom-white-50 border border-custom-gray-300 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="bg-custom-golden-100 p-3 rounded-full w-fit mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-custom-black-800 mb-3">
                {card.title}
              </h3>
              <p className="text-custom-gray-700 mb-4">{card.description}</p>
              <div className="border-t border-custom-gray-200 pt-4 mt-auto">
                <p className="text-custom-golden-700 font-medium">
                  Nuestra solución:
                </p>
                <p className="text-custom-gray-700">{card.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemWeSolveSection;
