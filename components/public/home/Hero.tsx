"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import CustomSelect from "@/lib/components/CustomSelect";
import CustomDatePicker from "@/lib/components/CustomDatePicker";
import { formatDateToDDMMYYYY } from "@/lib/functions";
import Link from "next/link";
import { CITIES, SERVICES } from "@/lib/constants";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const Hero = () => {
  const [origen, setOrigen] = useState<string>("");
  const [destino, setDestino] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [fecha, setFecha] = useState<Date | null>(null);

  const isFormValid = origen && destino && service && fecha;

  const buildSearchUrl = () => {
    const params = new URLSearchParams({
      origen,
      destino,
      service,
      fecha: fecha?.toISOString().split("T")[0] || "", // YYYY-MM-DD
    });
    return `/search?${params.toString()}`;
  };

  return (
    <section className="relative bg-[url('/main/main.webp')] bg-cover bg-bottom bg-no-repeat sm:bg-repeat sm:bg-auto py-16">
      <div className="w-full mx-auto px-4 text-center text-custom-white-100">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-extrabold mb-4">
          Transporte Privado Confiable
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-xl mb-8 font-bold max-w-2xl mx-auto">
          Ofrecemos un servicio de transporte entre Valencia, Barcelona y
          Madrid, cómodo y flexible para ti.
        </motion.p>

        <div className="relative max-w-7xl mx-auto">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              src="/main/main.webp"
              alt="Ilustración de coches en carretera"
              fill
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="bg-custom-white-100 rounded-lg shadow-lg p-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <motion.div {...fadeInUp(0.4)}>
                <CustomSelect
                  options={CITIES}
                  placeholder="Origen"
                  onSelect={setOrigen}
                  icon={<MapPin className="h-5 w-5 text-custom-gray-500" />}
                />
              </motion.div>

              <motion.div {...fadeInUp(0.5)}>
                <CustomSelect
                  options={CITIES}
                  placeholder="Destino"
                  onSelect={setDestino}
                  icon={<MapPin className="h-5 w-5 text-custom-gray-500" />}
                />
              </motion.div>

              <motion.div {...fadeInUp(0.6)}>
                <CustomDatePicker onSelect={setFecha} />
              </motion.div>

              <motion.div {...fadeInUp(0.7)}>
                <CustomSelect
                  options={SERVICES}
                  placeholder="Servicio"
                  onSelect={setService}
                  icon={<MapPin className="h-5 w-5 text-custom-gray-500" />}
                />
              </motion.div>

              <motion.div
                {...fadeInUp(0.8)}
                className="flex justify-center w-full">
                {isFormValid ? (
                  <Link
                    href={buildSearchUrl()}
                    target="_blank"
                    passHref
                    className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 font-medium rounded-lg px-6 py-3 transition">
                      Buscar
                    </motion.button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-custom-gray-300 text-custom-white-100 font-medium rounded-lg px-6 py-3 transition cursor-not-allowed">
                    Buscar
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            {...fadeInUp(0.9)}
            className="mt-6 text-sm font-bold text-custom-white-100">
            Origen: {CITIES.find((c) => c.value === origen)?.label || "Ninguno"}{" "}
            | Destino:{" "}
            {CITIES.find((c) => c.value === destino)?.label || "Ninguno"} |{" "}
            Fecha: {fecha ? formatDateToDDMMYYYY(fecha) : "Ninguna"} | Servicio:{" "}
            {SERVICES.find((s) => s.value === service)?.label || "Ninguno"}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
