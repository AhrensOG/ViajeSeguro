"use client";

import { Calendar, Shield, Users } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    icon: Users,
    text: "Con el Club Lealtad he ahorrado más de 50€ en un mes. Las cancelaciones flexibles me han salvado varias veces cuando he tenido cambios de planes de última hora.",
    name: "Laura G.",
    role: "Miembro Club Lealtad",
  },
  {
    icon: Calendar,
    text: "El Club Fidelidad es increíble. He recomendado a mis amigos y ahora mis viajes cuestan casi la mitad. Además, poder elegir asiento ha mejorado mucho mi experiencia.",
    name: "Carlos M.",
    role: "Miembro Club Fidelidad",
  },
  {
    icon: Shield,
    text: "Solo con registrarme ya empecé a ahorrar en cada viaje. La app es muy fácil de usar y los descuentos se aplican automáticamente. Estoy pensando en pasarme al Club Lealtad.",
    name: "Ana P.",
    role: "Cliente Preferencial",
  },
];

const TestimonialsSection = () => {
  return (
    <motion.section
      className="py-16 px-4 bg-custom-white-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-custom-black-800 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}>
          Lo que dicen nuestros usuarios
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              className="bg-custom-white-50 border border-custom-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}>
              <div className="flex justify-center mb-4">
                <div className="bg-custom-golden-100 p-3 rounded-full">
                  <item.icon className="h-6 w-6 text-custom-golden-600" />
                </div>
              </div>
              <p className="text-custom-gray-600 text-center italic mb-6">
                {item.text}
              </p>
              <div className="text-center">
                <p className="font-medium text-custom-black-800">{item.name}</p>
                <p className="text-sm text-custom-gray-500">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
