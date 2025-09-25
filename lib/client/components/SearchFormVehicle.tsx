"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import CustomDatePicker from "./CustomDatePicker";

export default function SearchFormVehicle() {
  const router = useRouter();

  // const [origin, setOrigin] = useState(""); // ⬅️ Select de origen
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    undefined
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [capacity, setCapacity] = useState("1");
  const [hasDriver, setHasDriver] = useState(false); // false = sin conductor

  const handleSubmit = () => {
    if (!departureDate || !returnDate) return;

    const departure = departureDate.toISOString();
    const returnIso = returnDate.toISOString();

    const vehicleOfferType = hasDriver ? "WITH_DRIVER" : "WITHOUT_DRIVER";

    const params = new URLSearchParams({
      departure,
      return: returnIso,
      capacity,
      mode: "van",
      serviceType: vehicleOfferType,
      origin: "Valencia", // si querés que sea dinámico, reactivá el select `origin`
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-5 bg-custom-white-100 p-2 md:p-8 rounded-lg w-full md:m-auto">
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
            className="w-full outline-none border border-gray-300 rounded-md p-3 ring-offset-amber-300 focus:ring-1 focus:ring-amber-500 focus:border-transparent">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n} {n === 1 ? "Persona" : "Personas"}
              </option>
            ))}
          </select>
        </div>
        {/* Origen */}
        {/* <div className="flex flex-col gap-2 p-2 w-full items-center">
                    <label htmlFor="origin" className="text-custom-black-800 py-2">
                        Origen
                    </label>
                    <div className="flex items-center gap-2 w-full border border-gray-300 rounded-md p-3 bg-white">
                        <MapPin className="text-custom-gray-500  h-5 w-5" />
                        <select
                            id="origin"
                            name="origin"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full outline-none bg-transparent text-custom-black-800"
                        >
                            <option value="" disabled>
                                Seleccionar origen
                            </option>
                            <option value="Valencia">Valencia</option>
                            <option value="Madrid">Madrid</option>
                            <option value="Barcelona">Barcelona</option>
                            <option value="Sevilla">Sevilla</option>
                        </select>
                    </div>
                </div> */}
      </div>

      {/* Tipo de servicio */}
      <div className="flex items-center flex-col justify-center gap-2 p-2 w-full">
        <h5 className="text-custom-gray-500 py-2 text-lg">Tipo de Servicio</h5>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 w-full">
          <button
            onClick={() => setHasDriver(false)}
            className={`flex flex-col py-3 px-6 rounded-md border cursor-pointer transition ${
              !hasDriver
                ? "bg-custom-golden-600 text-custom-white-100 border-custom-golden-700 hover:bg-custom-golden-700"
                : "bg-transparent text-custom-black-700 border border-custom-gray-300 hover:bg-custom-gray-100"
            }`}>
            Sin conductor
          </button>
          <button
            onClick={() => setHasDriver(true)}
            className={`flex flex-col py-3 px-6 rounded-md border cursor-pointer transition ${
              hasDriver
                ? "bg-custom-golden-600 text-custom-white-100 border-custom-golden-700 hover:bg-custom-golden-700"
                : "bg-transparent text-custom-black-700 border border-custom-gray-300 hover:bg-custom-gray-100"
            }`}>
            Con conductor
          </button>
        </div>
      </div>

      {/* Botón buscar */}
      <button
        onClick={handleSubmit}
        className="px-6 py-3 rounded-md border cursor-pointer duration-300 bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 w-full">
        Buscar Furgonetas
      </button>
    </motion.section>
  );
}
