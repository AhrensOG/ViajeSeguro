"use client";

import { motion } from "framer-motion";
import { CreditCard, Lock, Headphones, Banknote } from "lucide-react";

const PaymentMethods = () => {
  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-slate-500 text-sm mb-6">Métodos de pago seguros</p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-slate-600"
            >
              <Banknote className="w-6 h-6" />
              <span className="font-medium">Efectivo</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-slate-600"
            >
              <CreditCard className="w-6 h-6" />
              <span className="font-medium">Tarjeta</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-slate-600"
            >
              <Lock className="w-6 h-6" />
              <span className="font-medium">Pago seguro</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-slate-600"
            >
              <Headphones className="w-6 h-6" />
              <span className="font-medium">Support 24/7</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentMethods;
