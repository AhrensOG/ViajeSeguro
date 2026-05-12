"use client";

import { motion } from "framer-motion";
import { Wallet, Car, Shield } from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "Barato",
    description: "Desde 20€ por plaza",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Car,
    title: "Cómodo",
    description: "Trayectos privados",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Shield,
    title: "Seguro",
    description: "Cancelación gratis 24h",
    color: "bg-amber-100 text-amber-600",
  },
];

const BenefitsMinimal = () => {
  return (
    <section className="py-14 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-full ${benefit.color} flex items-center justify-center mb-4 shadow-sm`}>
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{benefit.title}</h3>
              <p className="text-slate-500 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsMinimal;
