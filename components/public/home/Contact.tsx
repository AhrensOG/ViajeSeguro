"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="contacto"
      className="py-24 "
    >
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-extrabold text-center text-first-gray mb-12"
        >
          Contacta con nosotros
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl mx-auto bg-second-white p-8 rounded-lg shadow-lg border border-fourth-gray"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-first-gray mb-1"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  aria-label="Nombre"
                  required
                  className="w-full px-4 py-2 border border-fourth-gray rounded-md focus:ring-2 focus:ring-first-golden focus:border-first-golden transition-all outline-none bg-first-white text-first-gray"
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-first-gray mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  aria-label="Email"
                  required
                  className="w-full px-4 py-2 border border-fourth-gray rounded-md focus:ring-2 focus:ring-first-golden focus:border-first-golden transition-all outline-none bg-first-white text-first-gray"
                />
              </motion.div>
            </div>

            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-first-gray mb-1"
              >
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                aria-label="Teléfono"
                required
                className="w-full px-4 py-2 border border-fourth-gray rounded-md focus:ring-2 focus:ring-first-golden focus:border-first-golden transition-all outline-none bg-first-white text-first-gray"
              />
            </motion.div>

            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <label
                htmlFor="message"
                className="block text-sm font-medium text-first-gray mb-1"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                rows={4}
                aria-label="Mensaje"
                required
                className="w-full px-4 py-2 border border-fourth-gray rounded-md focus:ring-2 focus:ring-first-golden focus:border-first-golden transition-all outline-none bg-first-white text-first-gray"
              ></textarea>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              type="submit"
              className="w-full bg-first-golden hover:bg-second-golden text-white font-medium py-3 px-4 rounded-lg transition-all outline-none shadow-md hover:shadow-lg"
            >
              Enviar mensaje
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;
