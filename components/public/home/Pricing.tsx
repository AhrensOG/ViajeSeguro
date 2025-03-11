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
          className="text-4xl font-extrabold text-center text-first-black mb-4"
        >
          Nuestras Promociones
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={isInView && { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-second-gray mb-12 max-w-2xl mx-auto"
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
              className="flex flex-col justify-between items-center bg-first-white rounded-lg border border-fourth-gray shadow-lg overflow-hidden transition-all duration-300"
            >
              <div
                className={`p-5 text-center w-full transition-all duration-300 ${
                  plan.premium
                    ? "bg-first-golden text-first-white"
                    : "bg-first-black text-first-white"
                }`}
              >
                <h3 className="text-xl font-bold">{plan.title}</h3>
                {plan.recommended && (
                  <span className="inline-block mt-1 bg-first-white text-first-g text-first-golden px-3 py-1 rounded-full text-sm font-bold">
                    {plan.recommended}
                  </span>
                )}
              </div>

              {plan.price && (
                <div className="text-center my-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-second-gray"> {plan.subtitle}</span>
                </div>
              )}

              <div className="p-6">
                <ul className="space-y-3">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-first-gbg-first-golden mr-2 flex-shrink-0" />
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
                      ? "bg-first-golden hover:bg-second-golden"
                      : "bg-first-black hover:bg-first-gray"
                  } text-first-white font-medium py-3 px-6 rounded-lg`}
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
