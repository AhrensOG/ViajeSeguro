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
              temporalmente. Es obligatorio pagar el importe exacto al conductor
              el día del viaje. En caso contrario, la reserva será cancelada
              automáticamente.
            </p>

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
                className={`px-4 py-2 rounded-lg transition text-white ${
                  checked
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
