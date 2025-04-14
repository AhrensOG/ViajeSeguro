"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const PaymentTrustInfo = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="bg-custom-golden-100 rounded-lg p-4 border border-custom-golden-500 mt-8">
    <div className="flex items-center gap-3">
      <Shield className="h-6 w-6 text-custom-golden-700 hidden sm:block" />
      <div>
        <h3 className="font-medium text-custom-golden-700">
          Viaja con total seguridad
        </h3>
        <p className="text-custom-gray-800 text-sm">
          Todos los pagos están protegidos por nuestra política de protección al
          viajero.
        </p>
      </div>
    </div>
  </motion.div>
);

export default PaymentTrustInfo;
