"use client";

import React from "react";
import { motion } from "framer-motion";

const faqItems = [
  [
    "¿Cuándo se aplican los descuentos?",
    "Los descuentos se aplican automáticamente en el momento de la reserva según el plan al que estés suscrito.",
  ],
  [
    "¿Cómo funciona el sistema de recomendaciones?",
    "Con el Plan Premium, cada mes puedes invitar hasta 3 amigos a viajar. Por cada amigo que complete un viaje, obtendrás un descuento adicional en tu próximo trayecto.",
  ],
  [
    "¿Puedo cambiar de plan en cualquier momento?",
    "Sí, puedes actualizar tu plan en cualquier momento. Si cambias a un plan superior, el cambio será inmediato. Si bajas de categoría, se aplica al final del período actual.",
  ],
  [
    "¿Qué son los beneficios aleatorios del Plan Premium?",
    "Son sorpresas como descuentos especiales, acceso anticipado a rutas o viajes gratuitos que recibirás durante el año.",
  ],
];

const FAQSection = () => {
  return (
    <motion.div
      className="bg-custom-white-100 border border-custom-gray-300 rounded-xl p-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}>
      <h2 className="text-2xl font-bold text-custom-black-800 mb-6">
        Preguntas frecuentes
      </h2>
      <div className="space-y-6">
        {faqItems.map(([question, answer], idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: idx * 0.1 + 0.2,
              duration: 0.4,
              ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.3 }}>
            <h3 className="text-lg font-medium text-custom-black-800 mb-2">
              {question}
            </h3>
            <p className="text-custom-gray-600">{answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FAQSection;
