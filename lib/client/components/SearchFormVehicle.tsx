"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import CustomDatePicker from "./CustomDatePicker";
import CityAutocomplete from "@/components/common/CityAutocomplete";

const vehicleCategories = [
  { id: "car", label: "Coche" },
  { id: "van", label: "Furgoneta" },
  { id: "truck", label: "Camión" },
  { id: "moto", label: "Moto" },
  { id: "boat", label: "Barco" },
  { id: "yacht", label: "Yate" },
  { id: "other", label: "Otros" },
];

export default function SearchFormVehicle() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [capacity, setCapacity] = useState("1");
  const [hasDriver, setHasDriver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("car"); // solo visual, sin tocar lógica

  const handleSubmit = () => {
    if (!departureDate || !returnDate || !location) return;

    const departure = departureDate.toISOString();
    const returnIso = returnDate.toISOString();

    const vehicleOfferType = hasDriver ? "WITH_DRIVER" : "WITHOUT_DRIVER";

    const params = new URLSearchParams({
      departure,
      return: returnIso,
      capacity,
      mode: "van",
      serviceType: vehicleOfferType,
      origin: location,
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-5 bg-custom-white-100 p-2 md:p-8 rounded-lg w-full md:m-auto"
    >
      {/* Selector de categoría */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-custom-black-800 text-sm font-medium" htmlFor="vehicleCategory">
          Categoría de vehículo
        </label>
        <select
          id="vehicleCategory"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full outline-none border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-amber-500 focus:border-transparent"
        >
          {vehicleCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fechas y capacidad */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 w-full text-custom-black-800">
        <div className="flex flex-col gap-2 p-2 w-full items-center">
          <label className="text-custom-black-800 py-2">Recogida</label>
          <CustomDatePicker value={departureDate} onSelect={setDepartureDate} />
        </div>

        <div className="flex flex-col gap-2 p-2 w-full items-center">
          <label className="text-custom-black-800 py-2">Devolución</label>
          <CustomDatePicker value={returnDate} onSelect={setReturnDate} />
        </div>

        <div className="flex flex-col gap-2 p-2 w-full items-center">
          <label className="text-custom-black-800 py-2" htmlFor="capacity">
            Capacidad
          </label>
          <select
            id="capacity"
            name="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full outline-none border border-gray-300 rounded-md p-3 ring-offset-amber-300 focus:ring-1 focus:ring-amber-500 focus:border-transparent"
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n} {n === 1 ? "Persona" : "Personas"}
              </option>
            ))}
          </select>
        </div>
        {/* Origen */}
        <div className="flex flex-col gap-2 p-2 w-full items-center">
          <label className="text-custom-black-800 py-2">
            Origen / Provincia
          </label>
          <CityAutocomplete
            value={location}
            onChange={(val, meta) => {
              if (meta?.payload?.name) {
                setLocation(meta.payload.name);
              } else {
                const city = (val || "").split(",")[0]?.trim();
                setLocation(city || val);
              }
            }}
            placeholder={"Elige tu ubicación"}
            allowFreeText
            className="w-full"
          />
        </div>
      </div>

      {/* Tipo de servicio */}
      <div className="flex items-center flex-col justify-center gap-2 p-2 w-full">
        <h5 className="text-custom-gray-500 py-2 text-lg">Tipo de Servicio</h5>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 w-full">
          <button
            onClick={() => setHasDriver(false)}
            className={`flex flex-col py-3 px-6 rounded-md border cursor-pointer transition ${!hasDriver
              ? "bg-custom-golden-600 text-custom-white-100 border-custom-golden-700 hover:bg-custom-golden-700"
              : "bg-transparent text-custom-black-700 border border-custom-gray-300 hover:bg-custom-gray-100"
              }`}
          >
            Sin conductor
          </button>
          <button
            onClick={() => setHasDriver(true)}
            className={`flex flex-col py-3 px-6 rounded-md border cursor-pointer transition ${hasDriver
              ? "bg-custom-golden-600 text-custom-white-100 border-custom-golden-700 hover:bg-custom-golden-700"
              : "bg-transparent text-custom-black-700 border border-custom-gray-300 hover:bg-custom-gray-100"
              }`}
          >
            Con conductor
          </button>
        </div>
      </div>

      {/* Botón buscar */}
      <button
        onClick={handleSubmit}
        disabled={!departureDate || !returnDate || !location}
        className={`px-6 py-3 rounded-md border text-custom-white-100 w-full transition duration-300 ${!departureDate || !returnDate || !location
          ? "bg-custom-gray-400 cursor-not-allowed border-custom-gray-400"
          : "bg-custom-golden-600 hover:bg-custom-golden-700 cursor-pointer border-custom-golden-600"
          }`}
      >
        Buscar Vehículos
      </button>
    </motion.section>
  );
}
