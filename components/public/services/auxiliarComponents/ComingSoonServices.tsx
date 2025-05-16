"use client";

import { motion } from "framer-motion";
import { Bell, Calendar, Car } from "lucide-react";
import ServiceCard from "./ServiceCard";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const ComingSoonServices = () => {
  return (
    <motion.section {...fadeIn} className="py-16 px-4 bg-custom-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-3 py-1 rounded-full font-semibold bg-custom-golden-100 text-custom-golden-700 border border-custom-golden-500">
            Próximamente
          </div>
          <Bell className="text-custom-golden-600 h-5 w-5" />
        </div>

        <h2 className="text-3xl font-bold text-custom-black-800 mb-2">
          Nuevos servicios en camino
        </h2>
        <p className="text-custom-gray-600 text-lg mb-12">
          Estamos trabajando para ofrecerte más opciones que revolucionarán tu
          forma de viajar.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <ServiceCard
            title="Alquiler de vehículos"
            description="Alquila el vehículo perfecto para cada ocasión. Desde coches económicos hasta vehículos de lujo, con o sin chófer, por días o semanas. Tú decides cómo quieres moverte."
            image="/main/img_placeholder.webp"
            points={[
              "Amplia flota de vehículos",
              "Opción con o sin conductor",
              "Tarifas flexibles por día",
            ]}
            icon={<Car className="h-8 w-8 text-custom-golden-600" />}
          />

          <ServiceCard
            title="Arma tu propio viaje"
            description="Planifica con anticipación y encuentra las mejores ofertas. Nuestro calendario inteligente te mostrará todos los viajes disponibles con los precios más bajos para cada día."
            image="/main/img_placeholder.webp"
            points={[
              "Vista de calendario con precios",
              "Comparador de tarifas",
              "Alertas de precios bajos",
            ]}
            icon={<Calendar className="h-6 w-6 text-custom-golden-600" />}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default ComingSoonServices;
