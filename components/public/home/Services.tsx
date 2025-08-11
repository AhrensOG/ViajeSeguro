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
      "Contrata el vehículo completo (8 plazas)",
      "Elige la calle y población de recogida y la calle y población de destino",
      "Elige el día y la hora del viaje",
      "Reserva con una antelación mínima de 72h",
      "Reserva con el 50% del valor del viaje y el resto antes de viajar.",
    ],
  },
  {
    title: "Viaje Semiexclusivo",
    features: [
      "Contrata la mitad del vehículo 4 plazas",
      "Compartes el viaje con 3 o 4 personas más",
      "Elige la calle y población de recogida y la calle y población de destino",
      "Elige el día y la hora del viaje",
      "Permites hacer una parada o dos para recoger el resto de pasajeros",
      "Reserva con una antelación mínima de 72h",
      "Reserva con el 50% del valor del viaje y el resto antes de viajar",
    ],
  },
  {
    title: "Viaje Compartido",
    features: [
      "Contrata la plaza o las plazas que necesitas (todos los pasajeros deberán registrarse para poder viajar)",
      "Compartes el viaje con hasta 8 personas más",
      "La calle y población de recogida y la calle y población de destino la indica la aplicación",
      "El día y la hora del viaje la indica la aplicación",
      "Permites hacer varias paradas para recoger el resto de pasajeros",
      "Reserva con el 100% del valor del viaje por la aplicación o por bizum",
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
          className="text-4xl font-extrabold text-center text-custom-black-800 mb-12">
          Nuestros Servicios
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-custom-white-100 rounded-lg shadow-lg overflow-hidden border border-custom-gray-100 flex flex-col justify-center items-center">
              <div className="bg-gradient-to-r from-custom-black-800 to-custom-black-900 p-5 text-center w-full">
                <h3 className="text-xl font-bold text-custom-white-100">
                  {service.title}
                </h3>
              </div>

              <div className="p-6 h-full flex flex-col justify-between items-center">
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check
                        className="h-5 w-5 text-custom-golden-600 mr-2 flex-shrink-0"
                        aria-hidden="true"
                        focusable="false"
                      />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
