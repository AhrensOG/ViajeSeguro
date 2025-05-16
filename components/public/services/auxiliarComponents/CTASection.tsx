"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NotifyModal from "./NotifyModal";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const CTASection = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.section
      {...fadeIn}
      className="py-16 px-4 bg-gradient-to-r from-custom-golden-700 to-custom-golden-500">
      <div className="max-w-4xl mx-auto text-center text-custom-white-100">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          ¿Listo para comenzar tu próximo viaje?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Únete a miles de viajeros que ya disfrutan de nuestro servicio de
          venta de plazas y sé el primero en probar nuestros nuevos servicios
          cuando estén disponibles.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={"/search"}
            target="_blank"
            className="flex items-center gap-2 rounded-xl cursor-pointer bg-custom-white-100 text-custom-golden-700 hover:bg-custom-golden-100 hover:text-custom-black-800 transition-all duration-300 ease-in-out px-6 py-3 text-lg shadow-sm hover:shadow-md">
            Reservar un viaje ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl cursor-pointer border border-custom-white-100 text-custom-white-100 hover:bg-white/10 hover:border-custom-white-50 transition-all duration-300 ease-in-out px-6 py-3 text-lg shadow-sm hover:shadow-md">
            Suscribirse a novedades
            <Bell className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
      <NotifyModal show={showModal} onClose={() => setShowModal(false)} />
    </motion.section>
  );
};

export default CTASection;
