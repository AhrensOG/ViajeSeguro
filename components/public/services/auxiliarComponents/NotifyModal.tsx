"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, X, Zap, Calendar, Car } from "lucide-react";
import type React from "react";
import { useState } from "react";

const NotifyModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Aquí iría la lógica para enviar el email a tu backend
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setEmail("");
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-custom-white-100 shadow-2xl">
            {/* Decorative top bar */}
            <div className="h-2 bg-gradient-to-r from-custom-golden-700 via-custom-golden-600 to-custom-golden-500"></div>

            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-custom-gray-500 hover:text-custom-black-800 bg-custom-white-100 rounded-full p-1 z-10 transition-all hover:bg-custom-gray-100"
              onClick={onClose}>
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <div className="p-8">
                {/* Header with icon */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="mb-4 bg-custom-golden-100 p-3 rounded-full">
                    <Bell className="h-8 w-8 text-custom-golden-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-custom-black-800 mb-2 text-center">
                    ¡No te pierdas nuestras novedades!
                  </h3>
                  <p className="text-custom-gray-600 text-center">
                    Sé el primero en conocer cuando lancemos nuevos servicios
                  </p>
                </div>

                {/* Service icons */}
                <div className="flex justify-center gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-custom-golden-100 p-2 rounded-full mb-2">
                      <Car className="h-5 w-5 text-custom-golden-600" />
                    </div>
                    <span className="text-xs text-custom-gray-600">
                      Alquiler
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-custom-golden-100 p-2 rounded-full mb-2">
                      <Calendar className="h-5 w-5 text-custom-golden-600" />
                    </div>
                    <span className="text-xs text-custom-gray-600">
                      Calendario
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-custom-golden-100 p-2 rounded-full mb-2">
                      <Zap className="h-5 w-5 text-custom-golden-600" />
                    </div>
                    <span className="text-xs text-custom-gray-600">
                      ¡Y más!
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-custom-gray-700 mb-1">
                      Tu correo electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-2 rounded-md outline-none border border-custom-gray-300 focus:border-custom-golden-500 focus:ring focus:ring-custom-golden-100 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-semibold text-custom-white-100 bg-custom-golden-600 hover:bg-custom-golden-700 transition-all shadow-md hover:shadow-lg">
                    Notificarme
                  </button>
                </form>

                <p className="mt-4 text-xs text-custom-gray-500 text-center">
                  No te enviaremos spam. Solo te notificaremos cuando lancemos
                  nuevos servicios.
                </p>
              </div>
            ) : (
              <div className="p-8">
                {/* Success state */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center">
                  <div className="mb-6 bg-custom-golden-100 p-4 rounded-full">
                    <CheckCircle className="h-12 w-12 text-custom-golden-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-custom-black-800 mb-3">
                    ¡Gracias por suscribirte!
                  </h3>
                  <p className="text-custom-gray-600 text-center mb-6">
                    Te avisaremos en cuanto estos nuevos servicios estén
                    disponibles. Sé el primero en disfrutar experiencias únicas
                    en cada viaje.
                  </p>
                  <button
                    className="px-6 py-3 rounded-lg font-semibold text-custom-white-100 bg-custom-golden-600 hover:bg-custom-golden-700 transition-all shadow-md hover:shadow-lg"
                    onClick={resetForm}>
                    ¡Estoy esperando!
                  </button>
                </motion.div>
              </div>
            )}

            {/* Decorative bottom pattern */}
            <div className="h-12 bg-custom-golden-100 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-custom-golden-600 via-transparent to-transparent"></div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-12 w-12 rounded-full bg-custom-golden-600"
                    style={{
                      left: `${i * 25}%`,
                      top: "50%",
                      transform: "translateY(-50%)",
                      opacity: 0.2 + i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotifyModal;
