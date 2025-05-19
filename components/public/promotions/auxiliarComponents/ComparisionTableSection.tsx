"use client";
import React from "react";
import { motion } from "framer-motion";

const ComparisionTableSection = () => {
  const headers = [
    "Características",
    "Cliente Preferencial",
    "Club Lealtad",
    "Club Fidelidad",
  ];

  const data = [
    ["Precio", "GRATIS", "4,90€/mes", "49,90€/año (4,16€/mes)"],
    [
      "Precio por viaje (antes 27,50€)",
      "24,75€",
      "22€",
      "22€ (hasta 15,40€ con amigos)",
    ],
    ["Ahorro por viaje", "2,75€", "5,50€", "Hasta 12,10€"],
    [
      "Tiempo para cancelaciones con reembolso",
      "-",
      "48 horas antes",
      "24 horas antes",
    ],
    ["Recomendaciones con descuento", "❌", "❌", "✅ (hasta 3 por mes)"],
    ["Selección de asientos", "❌", "❌", "✅"],
    ["Beneficios exclusivos adicionales", "❌", "❌", "✅"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.3 }}
      className="mb-16">
      <h2 className="text-2xl font-bold text-custom-black-800 text-center mb-8">
        Compara nuestros planes
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-custom-gray-100">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className={`border border-custom-gray-300 py-4 px-6 text-center text-custom-black-800 ${
                    i === 2 ? "bg-custom-golden-100" : ""
                  }`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-custom-gray-800">
            {data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`border border-custom-gray-300 py-3 px-6 text-center ${
                      j === 2 ? "bg-custom-golden-100" : ""
                    }`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ComparisionTableSection;
