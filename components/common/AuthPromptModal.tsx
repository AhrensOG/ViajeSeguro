"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface AuthPromptModalProps {
  delay?: number; // seconds before showing
}

export default function AuthPromptModal({ delay = 5 }: AuthPromptModalProps) {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (session || dismissed) return;

    const timer = setTimeout(() => {
      setShow(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [session, dismissed, delay]);

  if (session || dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDismissed(true)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-amber-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                ¡Únete a ViajeSeguro!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Inicia sesión o regístrate para reservar viajes, obtener descuentos exclusivos y más beneficios.
              </p>

              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition"
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión
                </Link>
                
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 hover:border-amber-500 text-gray-700 font-semibold rounded-xl transition"
                >
                  <User className="w-5 h-5" />
                  Regístrate gratis
                </Link>
              </div>

              <button
                onClick={() => setDismissed(true)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}