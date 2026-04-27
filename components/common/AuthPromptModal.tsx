"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthPromptModalProps {
  delay?: number;
}

export default function AuthPromptModal({ delay = 5 }: AuthPromptModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (session) return;

    const timer = setTimeout(() => {
      setShow(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [session, delay]);

  if (session) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                ¡Bienvenido a ViajeSeguro!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Regístrate para obtener descuentos exclusivos y reservar tus viajes.
              </p>

              <button
                onClick={() => router.push("/auth/register")}
                className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}