"use client";

import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";
import React, { useRef } from "react";

interface Route {
  from: string;
  to: string;
  duration: string;
  price: string;
}

const routes: Route[] = [
  {
    from: "Valencia",
    to: "Madrid",
    duration: "Aprox. 3.5 horas",
    price: "Desde 22€",
  },
  {
    from: "Valencia",
    to: "Barcelona",
    duration: "Aprox. 3.5 horas",
    price: "Desde 22€",
  },
  {
    from: "Madrid",
    to: "Barcelona",
    duration: "Aprox. 6 horas",
    price: "Desde 22€",
  },
];

const Routes = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView && { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="rutas"
      className="py-24 "
    >
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView && { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-extrabold text-center text-custom-black-800 mb-12"
        >
          Nuestras Rutas
        </motion.h2>

        <div className="max-w-3xl mx-auto bg-custom-white-100 rounded-lg shadow-lg overflow-hidden border border-custom-gray-300">
          <div className="p-6">
            <div className="flex flex-col space-y-6">
              {routes.map((route, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView && { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex items-center justify-between pb-4 ${
                    index !== routes.length - 1
                      ? "border-b border-custom-gray-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12  rounded-full flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-custom-black-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {route.from} - {route.to}
                      </h4>
                      <p className="text-custom-gray-500">{route.duration}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-custom-golden-600">
                      {route.price}
                    </span>
                    <p className="text-sm text-custom-gray-500">por asiento</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Routes;
