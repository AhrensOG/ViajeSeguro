import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type AuthRequiredModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const AuthRequiredModal = ({
  show,
  onClose,
  onConfirm,
}: AuthRequiredModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Inicia sesión para continuar
            </h2>
            <p className="text-gray-600 mb-6">
              Crea tu cuenta o inicia sesión para acceder a{" "}
              <span className="font-medium text-custom-golden-700">
                descuentos exclusivos
              </span>{" "}
              y reservar tu plaza.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-custom-golden-600 text-white hover:bg-custom-golden-700 transition">
                Iniciar sesión
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthRequiredModal;
