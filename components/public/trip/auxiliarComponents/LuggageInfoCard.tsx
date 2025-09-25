"use client";

import { motion } from "framer-motion";
import { Info, BaggageClaim, Backpack, Minus, Plus } from "lucide-react";
import { useTripOptions } from "./TripOptionsContext";

export default function LuggageInfoCard({ pricePerBag = 5 }: { pricePerBag?: number }) {
  const { extraBags, setExtraBags } = useTripOptions();

  const dec = () => setExtraBags(Math.max(0, extraBags - 1));
  const inc = () => setExtraBags(extraBags + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Info className="size-5 text-custom-golden-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-custom-black-900">Política de equipaje</h3>
          <p className="text-sm text-custom-gray-700 mt-1">
            Este viaje incluye 1 equipaje de mano y 1 maleta. Si necesitas llevar más, cada maleta adicional tiene un costo de
            <span className="font-semibold"> {pricePerBag.toFixed(2).replace(".", ",")} €</span>.
          </p>

          <div className="mt-4 flex items-center justify-between p-3 border border-custom-gray-300 rounded-lg">
            <div className="flex items-center gap-3">
              <Backpack className="size-5 text-custom-golden-700" />
              <BaggageClaim className="size-5 text-custom-golden-700" />
              <div>
                <p className="text-sm font-semibold text-custom-black-800">Maletas adicionales</p>
                <p className="text-xs text-custom-gray-600">Selecciona cuántas maletas adicionales llevarás</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={dec}
                className="p-2 rounded-md border border-custom-gray-300 hover:bg-custom-gray-200"
                aria-label="Quitar maleta"
              >
                <Minus className="size-4" />
              </button>
              <input
                readOnly
                value={extraBags}
                className="w-12 text-center py-2 border border-custom-gray-300 rounded-md bg-white"
              />
              <button
                onClick={inc}
                className="p-2 rounded-md border border-custom-gray-300 hover:bg-custom-gray-200"
                aria-label="Agregar maleta"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {extraBags > 0 && (
            <p className="mt-2 text-right text-sm text-custom-gray-700">
              Equipaje adicional: <span className="font-semibold text-custom-black-800">+{(extraBags * pricePerBag).toFixed(2).replace(".", ",")} €</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
