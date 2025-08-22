// components/QrModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  qrUrl: string;
  reservationId: string;
};

const QrModal = ({ isOpen, onClose, qrUrl, reservationId }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="cursor-pointer fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="cursor-auto relative bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={onClose}>
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center text-custom-black-900">
              Código QR de tu viaje
            </h2>

            <p className="text-sm text-center text-custom-gray-600">
              Muestra este código al conductor al momento del embarque.
            </p>

            <div className="w-full flex justify-center mb-3">
              <Image
                src={qrUrl}
                alt="Código QR"
                width={220}
                height={220}
                className="rounded-md"
              />
            </div>

            <p className="text-xs text-center text-custom-gray-400 mt-1">
              Si el QR falla, proporciona este ID al conductor:{" "}
              <span className="font-semibold text-custom-black-700">
                {reservationId}
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QrModal;
