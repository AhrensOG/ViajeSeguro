"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import CustomDatePicker from "./CustomDatePicker";

export default function SearchFormV1() {
    const router = useRouter();

    const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
    const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
    const [capacity, setCapacity] = useState("1");
    const [hasDriver, setHasDriver] = useState(false); // false = sin conductor (default)

    const handleSubmit = () => {
        if (!departureDate || !returnDate) return;

        const departure = departureDate.toISOString();
        const returnIso = returnDate.toISOString();

        const params = new URLSearchParams({
            departure,
            return: returnIso,
            capacity,
            hasDriver: hasDriver ? "true" : "false",
            mode: "van",
            serviceType: "VAN_RENTAL", // Asegúrate de que tu backend espera este valor
        });

        router.push(`/search?${params.toString()}`);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-5 bg-custom-white-100 p-8 rounded-lg w-full m-auto"
        >
            <div className="grid grid-cols-3 gap-6 w-full text-custom-black-800">
                {/* Fecha de recogida */}
                <div className="flex flex-col gap-2 p-2 w-full items-center">
                    <label className="text-custom-black-800 py-2">Recogida</label>
                    <CustomDatePicker value={departureDate} onSelect={setDepartureDate} />
                </div>

                {/* Fecha de devolución */}
                <div className="flex flex-col gap-2 p-2 w-full items-center">
                    <label className="text-custom-black-800 py-2">Devolución</label>
                    <CustomDatePicker value={returnDate} onSelect={setReturnDate} />
                </div>

                {/* Capacidad */}
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
                        <option value="1">1 Persona</option>
                        <option value="2">2 Personas</option>
                        <option value="3">3 Personas</option>
                        <option value="4">4 Personas</option>
                        <option value="5">5 Personas</option>
                    </select>
                </div>
            </div>

            {/* Botones tipo de servicio */}
            <div className="flex items-center flex-col justify-center gap-2 p-2 w-full">
                <h5 className="text-custom-gray-500 py-2 text-lg">Tipo de Servicio</h5>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <button
                        onClick={() => setHasDriver(false)}
                        className={`flex flex-col p-5 rounded-md border cursor-pointer transition ${
                            !hasDriver
                                ? "bg-custom-golden-600 text-custom-white-100 border-custom-golden-700 hover:bg-custom-golden-700"
                                : "bg-transparent text-custom-black-700 border border-custom-gray-300 hover:bg-custom-gray-100"
                        }`}
                    >
                        Sin conductor
                    </button>
                    <button
                        onClick={() => setHasDriver(true)}
                        className={`flex flex-col p-5 rounded-md border cursor-pointer transition ${
                            hasDriver
                                ? "bg-custom-golden-600 text-custom-white-100 border-custom-golden-700 hover:bg-custom-golden-700"
                                : "bg-transparent text-custom-black-700 border border-custom-gray-300 hover:bg-custom-gray-100"
                        }`}
                    >
                        Con conductor
                    </button>
                </div>
            </div>

            {/* Dirección fija */}
            <div className="flex flex-col gap-2 p-2 w-full bg-[#fff5ed] border border-custom-golden-500 rounded-md">
                <div className="flex items-center justify-center w-full gap-2">
                    <MapPin className="text-custom-golden-700 h-6 w-6 mb-2" />
                    <p className="text-custom-golden-700 h-full">Recogida en nuestro local de Valencia</p>
                </div>
                <p className="text-custom-golden-500 text-center">Dirección: Calle ejemplo, 123, Valencia</p>
            </div>

            {/* Botón buscar */}
            <button
                onClick={handleSubmit}
                className="p-4 rounded-md border cursor-pointer duration-300 bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 w-full"
            >
                Buscar Furgonetas en Valencia
            </button>
        </motion.section>
    );
}
