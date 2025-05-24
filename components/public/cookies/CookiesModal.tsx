"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cookie,
  Shield,
  X,
  ChevronRight,
  CheckCircle,
  Globe,
} from "lucide-react";

const CookiesModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    thirdParty: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (accepted: boolean, preferences = cookiePreferences) => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        accepted,
        preferences,
        timestamp: new Date().toISOString(),
      })
    );
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      essential: true,
      thirdParty: true,
    };
    setCookiePreferences(newPreferences);
    saveConsent(true, newPreferences);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      essential: true,
      thirdParty: false,
    };
    setCookiePreferences(newPreferences);
    saveConsent(false, newPreferences);
  };

  const handleSavePreferences = () => saveConsent(true);

  const handleTogglePreference = (type: keyof typeof cookiePreferences) => {
    if (type === "essential") return;
    setCookiePreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:pb-8 bg-custom-black-800/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDetails(false);
          }}>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl bg-custom-white-100 rounded-xl shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-custom-golden-700 via-custom-golden-600 to-custom-golden-500"></div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-custom-golden-100 p-2 rounded-full">
                    <Cookie className="h-5 w-5 text-custom-golden-700" />
                  </div>
                  <h3 className="text-xl font-bold text-custom-black-800">
                    Preferencias de cookies
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-custom-gray-500 hover:text-custom-black-800 bg-custom-white-100 rounded-full p-1 transition-all hover:bg-custom-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-custom-gray-700 mb-3">
                  Utilizamos cookies para mejorar tu experiencia, personalizar
                  contenido y analizar el tráfico de nuestro sitio. Tu
                  privacidad es importante para nosotros.
                </p>

                {!showDetails && (
                  <div className="flex items-center gap-2 text-custom-golden-600 text-sm font-medium mt-2">
                    <Shield className="h-4 w-4" />
                    <span>Tus datos están seguros con nosotros</span>
                  </div>
                )}
              </div>

              {showDetails ? (
                <div className="mb-6 space-y-4">
                  {[
                    {
                      key: "essential",
                      label: "Cookies esenciales",
                      description:
                        "Estas cookies son necesarias para el funcionamiento básico del sitio y no pueden ser desactivadas.",
                      disabled: true,
                      icon: (
                        <CheckCircle className="h-5 w-5 text-custom-golden-600" />
                      ),
                    },
                    {
                      key: "thirdParty",
                      label: "Cookies de terceros",
                      description:
                        "Utilizadas por servicios como mapas de Google para mostrar contenido embebido.",
                      disabled: false,
                      icon: <Globe className="h-5 w-5 text-custom-gray-600" />,
                    },
                  ].map(({ key, label, description, disabled, icon }) => (
                    <div
                      key={key}
                      className="p-4 bg-custom-white-100 rounded-lg border border-custom-gray-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {icon}
                          <h4 className="font-medium text-custom-black-800">
                            {label}
                          </h4>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              cookiePreferences[
                                key as keyof typeof cookiePreferences
                              ]
                            }
                            onChange={() =>
                              handleTogglePreference(
                                key as keyof typeof cookiePreferences
                              )
                            }
                            disabled={disabled}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-10 h-6 ${
                              disabled
                                ? "bg-custom-golden-600 cursor-not-allowed"
                                : "bg-custom-gray-300"
                            } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-custom-golden-600`}></div>
                        </label>
                      </div>
                      <p className="text-sm text-custom-gray-600">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex items-center gap-1 text-custom-golden-600 hover:text-custom-golden-700 font-medium mb-6 transition-colors">
                  <span>Personalizar preferencias</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-end border-t border-custom-gray-200 pt-4">
                <Link
                  href="/cookies"
                  className="text-custom-gray-600 hover:text-custom-black-800 text-sm flex items-center justify-center">
                  <span>Política de cookies</span>
                </Link>

                <div className="flex-1"></div>

                {showDetails ? (
                  <>
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 border border-custom-gray-300 rounded-md hover:bg-custom-gray-100 transition-colors text-custom-gray-700 font-medium">
                      Rechazar todo
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-4 py-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white rounded-md transition-colors font-medium">
                      Guardar preferencias
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 border border-custom-gray-300 rounded-md hover:bg-custom-gray-100 transition-colors text-custom-gray-700 font-medium">
                      Rechazar todo
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white rounded-md transition-colors font-medium">
                      Aceptar todo
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-custom-golden-500/20 via-custom-golden-600/10 to-transparent"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookiesModal;
