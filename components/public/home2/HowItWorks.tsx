"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, CarFront } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "1",
    title: "Busca",
    description: "Elige origen, destino y fecha",
  },
  {
    icon: CalendarCheck,
    number: "2",
    title: "Reserva",
    description: "Elige plaza y paga fácil",
  },
  {
    icon: CarFront,
    number: "3",
    title: "Viaja",
    description: "Enjoy tu viaje",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Cómo funciona</h2>
          <p className="text-slate-500">En 3 simples pasos</p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center flex-1"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <step.icon className="w-10 h-10 text-slate-900" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{step.title}</h3>
              <p className="text-slate-500 text-sm">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-200" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
