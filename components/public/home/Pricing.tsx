"use client";

import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import React, { useRef } from "react";

interface Plan {
  title: string;
  price?: string;
  subtitle?: string;
  recommended?: string;
  premium?: boolean;
  benefits: string[];
  buttonText: string;
}

const pricingOptions: Plan[] = [
  {
    title: "Descuento por Recomendación",
    price: "FREE",
    recommended: "Popular",
    premium: false,
    benefits: [
      "10% de descuento en tu segundo viaje",
      "10% adicional por cada persona que recomiendes",
      "Hasta un máximo del 50% de descuento",
      "Descuentos adicionales se acumulan para el siguiente viaje",
    ],
    buttonText: "Elegir esta opción",
  },
  {
    title: "Abono Mensual",
    price: "4,90€",
    subtitle: "/mes",
    recommended: "Recomendado",
    premium: true,
    benefits: [
      "Tu asiento a solo 22€ cada vez que viajes",
      "Posibilidad de abaratar aún más con recomendaciones",
      "Prioridad en la reserva de plazas",
      "Cancelación gratuita hasta 24h antes",
    ],
    buttonText: "Suscribirme",
  },
];

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView && { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="precios"
      className="py-24 "
    >
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView && { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-extrabold text-center text-custom-black-900 mb-4"
        >
          Nuestras Promociones
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={isInView && { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-custom-gray-600 mb-12 max-w-2xl mx-auto"
        >
          No pagues por trayecto, paga por asiento. El asiento tiene un precio
          fijo independientemente del destino, y además puedes reducirlo con el
          sistema de recomendación.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingOptions.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView && { opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{
                scale: 1.025,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 },
              }}
              className="flex flex-col justify-between items-center bg-custom-white-100 rounded-lg border border-custom-gray-300 shadow-lg overflow-hidden transition-all duration-300"
            >
              <div
                className={`p-5 text-center w-full transition-all duration-300 ${
                  plan.premium
                    ? "bg-custom-golden-600 text-custom-white-100"
                    : "bg-custom-black-900 text-custom-white-100"
                }`}
              >
                <h3 className="text-xl font-bold">{plan.title}</h3>
                {plan.recommended && (
                  <span className="inline-block mt-1 bg-custom-white-100 text-first-g text-custom-golden-600 px-3 py-1 rounded-full text-sm font-bold">
                    {plan.recommended}
                  </span>
                )}
              </div>

              {plan.price && (
                <div className="text-center my-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-custom-gray-600"> {plan.subtitle}</span>
                </div>
              )}

              <div className="p-6">
                <ul className="space-y-3">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-first-gbg-custom-golden-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full mt-6 transition-all duration-300 ${
                    plan.premium
                      ? "bg-custom-golden-600 hover:bg-custom-golden-700"
                      : "bg-custom-black-900 hover:bg-custom-gray-800"
                  } text-custom-white-100 font-medium py-3 px-6 rounded-lg`}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Pricing;
