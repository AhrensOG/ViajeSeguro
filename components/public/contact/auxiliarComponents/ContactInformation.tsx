"use client";

import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ContactInformation = () => {
  const infoItems = [
    {
      icon: <MapPin className="h-5 w-5 text-custom-golden-700" />,
      title: "Dirección",
      content: "Calle Principal 123\n28001 Madrid, España",
    },
    {
      icon: <Mail className="h-5 w-5 text-custom-golden-700" />,
      title: "Email",
      content: (
        <a
          href="mailto:info@viajeseguro.com"
          className="hover:text-custom-golden-600">
          info@viajeseguro.com
        </a>
      ),
    },
    {
      icon: <Phone className="h-5 w-5 text-custom-golden-700" />,
      title: "Teléfono",
      content: (
        <a href="tel:+34912345678" className="hover:text-custom-golden-600">
          +34 91 234 56 78
        </a>
      ),
    },
    {
      icon: <Clock className="h-5 w-5 text-custom-golden-700" />,
      title: "Horario de atención",
      content: "Lunes a Viernes: 9:00 - 18:00\nSábados: 10:00 - 14:00",
    },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}>
      {/* Información */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-custom-black-800 mb-6">
          Información de contacto
        </h2>
        <div className="space-y-6">
          {infoItems.map(({ icon, title, content }, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex items-start gap-4">
              <div className="bg-custom-golden-100 p-2 rounded-full mt-1">
                {icon}
              </div>
              <div>
                <h3 className="font-medium text-custom-black-800">{title}</h3>
                <p className="text-custom-gray-600 whitespace-pre-line">
                  {content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mapa */}
      <motion.div
        variants={item}
        className="bg-custom-gray-100 rounded-xl overflow-hidden h-64 flex items-center justify-center text-custom-gray-600">
        Mapa de ubicación
      </motion.div>

      {/* FAQ */}
      <motion.div
        variants={item}
        className="bg-custom-golden-100 rounded-xl p-6 border border-custom-golden-500">
        <h3 className="font-bold text-custom-black-800 mb-2">
          ¿Tienes preguntas frecuentes?
        </h3>
        <p className="text-custom-gray-700 mb-4">
          Consulta nuestra sección de preguntas frecuentes donde podrás
          encontrar respuestas a las dudas más comunes.
        </p>
        <Link href="/faq">
          <button className="cursor-pointer border border-custom-golden-600 text-custom-golden-700 hover:bg-custom-golden-200 rounded-md px-4 py-2 flex items-center gap-2">
            Ver preguntas frecuentes
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ContactInformation;
