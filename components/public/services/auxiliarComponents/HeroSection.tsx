"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const HeroSection = () => {
  return (
    <motion.section
      {...fadeIn}
      className="relative bg-custom-black-800 text-custom-white-100 py-20 px-4">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/main/img_placeholder.webp"
          alt="Viajeros felices"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <span className="bg-custom-golden-600 text-custom-white-100 font-bold hover:bg-custom-golden-700 duration-300 border-0 p-3 py-1 rounded-full">
          Nuestros Servicios
        </span>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold my-4">
          Viaja a tu manera con{" "}
          <span className="text-custom-golden-500">Viaje Seguro</span>
        </motion.h1>
        <p className="text-xl text-custom-gray-300 max-w-2xl mb-8">
          Descubre nuestros servicios diseñados para hacer tus viajes más
          cómodos, económicos y adaptados a tus necesidades.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={"/search"}
            target="_blank"
            className="flex items-center gap-2 font-bold bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 px-6 py-4 text-lg rounded-xl">
            Reserva ahora
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href={"#services"}
            className="flex items-center gap-2 font-bold border border-custom-white-100 text-custom-white-100 hover:bg-white/10 px-6 py-4 text-lg rounded-xl">
            Explorar servicios
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
