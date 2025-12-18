"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const CashConfirmationModal = ({ show, onClose, onConfirm }: Props) => {
  const [checked, setChecked] = useState(false);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          onClick={() => onClose()}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Confirmar pago en efectivo
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Al elegir este método de pago, tu plaza será reservada
              temporalmente.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* Warning Icon */}
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 font-medium">
                    Importante: El conductor no dispone de cambio.
                  </p>
                  <p className="text-sm text-yellow-700">
                    Por favor, asegúrate de llevar el  <span className="font-bold">importe exacto</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                id="accept"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-1 mr-2"
              />
              <label
                htmlFor="accept"
                className="text-sm text-gray-700 leading-tight">
                He leído y acepto las condiciones del pago en efectivo.
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                Cancelar
              </button>
              <button
                disabled={!checked}
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg transition text-white ${checked
                    ? "bg-custom-golden-600 hover:bg-custom-golden-700"
                    : "bg-gray-300 cursor-not-allowed"
                  }`}>
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CashConfirmationModal;
