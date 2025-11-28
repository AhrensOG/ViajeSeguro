"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DateTime } from "luxon";

import SearchForm from "./SearchForm";
import { ClientSearchFormData } from "@/lib/client/trip/types/search-form.type";
import SearchFormVehicle from "./SearchFormVehicle";

export default function SearchSelectorWrapper() {
    const [activeMode, setActiveMode] = useState<"car" | "van">("car");
    const router = useRouter();

    const handleSearch = ({ origin, destination, serviceType, departure }: ClientSearchFormData) => {
        const userTimeZone = DateTime.local().zoneName;
        const selectedDate = DateTime.fromJSDate(departure).setZone(userTimeZone);
        // Set to local midday to avoid UTC day shift
        const dateTimeWithTime = selectedDate.set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
        });

        const isoStringWithTZ = dateTimeWithTime.toISO();

        if (!isoStringWithTZ) {
            console.warn("Fecha inválida para búsqueda:", departure);
            return;
        }

        const params = new URLSearchParams({
            origin,
            destination,
            departure: isoStringWithTZ,
            serviceType,
            mode: "car",
        });

        router.push(`/search?${params.toString()}`);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-5 bg-custom-white-100 p-4 md:p-8 rounded-lg shadow-md w-[75vw] border border-custom-gray-300 m-auto mt-10"
        >
            {/* Selector visual */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-custom-gray-200 p-2 border border-custom-gray-200 rounded-md w-full">
                <p
                    className={`text-custom-gray-800 flex w-full md:w-[45%] justify-center items-center gap-2 cursor-pointer ${
                        activeMode === "car" ? "bg-custom-white-100 p-2 px-3 rounded-md" : ""
                    }`}
                    onClick={() => setActiveMode("car")}
                >
                    <Car className="h-6 w-6" />
                    Viaje Compartido
                </p>
                <p
                    className={`text-custom-gray-800 flex w-full md:w-[45%] justify-center items-center gap-2 cursor-pointer ${
                        activeMode === "van" ? "bg-custom-white-100 p-2 px-3 rounded-md" : ""
                    }`}
                    onClick={() => setActiveMode("van")}
                >
                    <Truck className="h-6 w-6" />
                    Alquiler de Vehículos
                </p>
            </div>

            <AnimatePresence mode="wait">
                {activeMode === "car" ? (
                    <motion.div
                        key="car"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        <SearchForm onSearch={handleSearch} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="van"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        <SearchFormVehicle />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
