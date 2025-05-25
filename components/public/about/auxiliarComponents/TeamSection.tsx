"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

const teamMembers = [
  {
    name: "Javier",
    role: "Director de Tecnología",
    image: "/main/img_placeholder.webp",
  },
  {
    name: "Chela",
    role: "Directora de Administración y Control",
    image: "/main/img_placeholder.webp",
  },
  {
    name: "Frankie",
    role: "Directora de Marketing y Tecnología",
    image: "/main/img_placeholder.webp",
  },
  {
    name: "Gabriel",
    role: "Soporte Técnico",
    image: "/main/img_placeholder.webp",
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 px-4 bg-custom-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-custom-black-800 mb-4">
            Nuestro equipo
          </h2>
          <p className="text-custom-gray-600 max-w-3xl mx-auto">
            Detrás de Viaje Seguro hay un equipo diverso y apasionado de
            profesionales comprometidos con nuestra misión de transformar el
            transporte compartido.
          </p>
        </motion.div>

        {/* Miembros del equipo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-custom-white-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src={member.image}
                  alt={`Foto de ${member.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-custom-black-800">
                  {member.name}
                </h3>
                <p className="text-custom-golden-600 text-sm">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cierre */}
        <div className="text-center mt-8">
          <p className="text-custom-gray-600">
            ...y más de 50 profesionales trabajando para mejorar tu experiencia
            de viaje cada día.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
