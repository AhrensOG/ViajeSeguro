"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CTAMinimal = () => {
  const router = useRouter();

  return (
    <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para viajar?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Reserva tu plaza ahora y descubre la forma más fácil y económica de viajar entre ciudades
          </p>
          
          <button
            onClick={() => router.push("/home2")}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-500/25"
          >
            Buscar viaje
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTAMinimal;
