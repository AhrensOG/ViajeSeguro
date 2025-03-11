"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

interface Service {
  title: string;
  features: string[];
}

const services: Service[] = [
  {
    title: "Viaje Exclusivo",
    features: [
      "Contrata el vehículo completo (7 plazas)",
      "Elige el lugar de recogida y destino",
      "Elige el día y la hora del viaje",
      "Reserva con 72h de anticipación",
      "50% de pago 48h antes, resto el día del viaje",
    ],
  },
  {
    title: "Viaje Semiexclusivo",
    features: [
      "Contrata 4 plazas del vehículo",
      "Comparte el viaje con mínimo 3 personas",
      "Elige recogida y destino en Valencia, Madrid o Barcelona",
      "Elige el día y la hora del viaje",
      "50% de pago 48h antes, resto el día del viaje",
    ],
  },
  {
    title: "Viaje Compartido",
    features: [
      "Contrata la plaza o plazas que necesitas",
      "Comparte con otras personas (hasta 9 plazas)",
      "Punto de recogida en Valencia, Madrid o Barcelona",
      "La empresa notifica día y hora de salida",
      "Pago total 24h antes por BIZUM",
    ],
  },
];

const Services = () => {
  return (
    <section id="servicios" className="py-24 ">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-extrabold text-center text-first-gray mb-12"
        >
          Nuestros Servicios
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-first-white rounded-lg shadow-lg overflow-hidden border border-fifth-gray flex flex-col justify-center items-center"
            >
              <div className="bg-gradient-to-r from-first-gray to-first-black p-5 text-center w-full">
                <h3 className="text-xl font-bold text-first-white">
                  {service.title}
                </h3>
              </div>

              <div className="p-6 h-full flex flex-col justify-between items-center">
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-first-golden mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-6 bg-first-golden hover:bg-second-golden text-first-white font-medium py-3 px-6 rounded-lg transition"
                  aria-label={`Reservar ${service.title}`}
                >
                  Reservar
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
