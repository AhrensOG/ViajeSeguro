// /components/services/VehicleBookingService.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Star, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const VehicleBookingService = () => {
  return (
    <motion.section
      {...fadeIn}
      id="services"
      className="py-16 px-4 bg-custom-white-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-custom-golden-100 text-custom-golden-700 border border-custom-golden-500 p-3 py-1 rounded-full">
            Disponible ahora
          </div>
          <Zap className="text-custom-golden-600 h-5 w-5" />
        </div>

        <h2 className="text-3xl font-bold text-custom-black-800 mb-6">
          Alquiler de vehículos
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Imagen a la izquierda */}
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/main/plaza.jpeg?height=500&width=500"
              alt="Pasajeros compartiendo viaje"
              fill
              className="object-cover"
            />
          </div>

          {/* Texto a la derecha */}
          <div className="order-2 md:order-2">
            <p className="text-custom-gray-800 text-lg mb-6">
              Alquila el vehículo que necesites, por día o por el tiempo que
              requieras, con precios claros y sin complicaciones:
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="bg-custom-golden-100 p-2 rounded-full mt-1">
                  <MapPin className="h-5 w-5 text-custom-golden-700" />
                </div>
                <div>
                  <h3 className="font-medium text-custom-black-800">
                    Retiro en puntos clave
                  </h3>
                  <p className="text-custom-gray-600">
                    Elige entre múltiples ubicaciones para recoger y devolver tu
                    vehículo.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-custom-golden-100 p-2 rounded-full mt-1">
                  <Users className="h-5 w-5 text-custom-golden-700" />
                </div>
                <div>
                  <h3 className="font-medium text-custom-black-800">
                    Variedad de modelos
                  </h3>
                  <p className="text-custom-gray-600">
                    Desde coches compactos hasta furgonetas para grandes grupos.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-custom-golden-100 p-2 rounded-full mt-1">
                  <Star className="h-5 w-5 text-custom-golden-700" />
                </div>
                <div>
                  <h3 className="font-medium text-custom-black-800">
                    Transparencia total
                  </h3>
                  <p className="text-custom-gray-600">
                    Sin costes ocultos y con contrato claro desde el primer
                    momento.
                  </p>
                </div>
              </li>
            </ul>

            <Link
              href="/search"
              target="_blank"
              className="flex items-center justify-center max-w-96 font-bold gap-2 p-2 rounded-full duration-300 bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 px-6">
              Buscar vehiculos disponibles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default VehicleBookingService;
