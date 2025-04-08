"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SearchForm from "../../../lib/client/components/SearchForm";
import { useRouter } from "next/navigation";
import { SearchFormData } from "@/lib/client/trip/types/search-form.type";
import { DateTime } from "luxon";

const Hero = () => {
  const router = useRouter();

  const handleSearch = ({
    origin,
    destination,
    serviceType,
    departure,
  }: SearchFormData) => {
    const userTimeZone = DateTime.local().zoneName;

    const selectedDate = DateTime.fromJSDate(departure).setZone(userTimeZone);
    const now = DateTime.local().setZone(userTimeZone);

    // Combinamos fecha seleccionada con hora actual
    const dateTimeWithTime = selectedDate.set({
      hour: now.hour,
      minute: now.minute,
      second: now.second,
    });

    const isoStringWithTZ = dateTimeWithTime.toISO();

    if (!isoStringWithTZ) {
      console.warn("Fecha inválida para búsqueda:", departure);
      return;
    }

    const params = new URLSearchParams({
      origin,
      destination,
      departure: isoStringWithTZ,
      serviceType,
    });

    router.push(`/search?${params.toString()}`);
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

          <SearchForm onSearch={handleSearch} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
