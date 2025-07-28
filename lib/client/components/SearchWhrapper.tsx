"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DateTime } from "luxon";

import SearchForm from "./SearchForm";
import SearchFormV1 from "./SearchFormV1";
import { ClientSearchFormData } from "@/lib/client/trip/types/search-form.type";

export default function SearchSelectorWrapper() {
    const [activeMode, setActiveMode] = useState<"car" | "van">("car");
    const router = useRouter();

    const handleSearch = ({ origin, destination, serviceType, departure }: ClientSearchFormData) => {
        const userTimeZone = DateTime.local().zoneName;
        const selectedDate = DateTime.fromJSDate(departure).setZone(userTimeZone);
        const now = DateTime.local().setZone(userTimeZone);

        const dateTimeWithTime = selectedDate.set({
            hour: now.hour,
            minute: now.minute,
            second: now.second,
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
            mode: "car", // Si estás usando esta distinción
        });

        router.push(`/search?${params.toString()}`);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-5 bg-custom-white-100 p-8 rounded-lg shadow-md w-[75vw] border border-custom-gray-300 m-auto mt-10"
        >
            {/* Selector visual */}
            <div className="flex justify-between items-center gap-4 bg-custom-gray-200 p-2 border border-custom-gray-200 rounded-md w-full">
                <p
                    className={`text-custom-gray-800 flex w-[45%] justify-center items-center gap-2 cursor-pointer ${
                        activeMode === "car" ? "bg-custom-white-100 p-2 px-3 rounded-md" : ""
                    }`}
                    onClick={() => setActiveMode("car")}
                >
                    <Car className="h-6 w-6" />
                    Transporte
                </p>
                <p
                    className={`text-custom-gray-800 flex w-[45%] justify-center items-center gap-2 cursor-pointer ${
                        activeMode === "van" ? "bg-custom-white-100 p-2 px-3 rounded-md" : ""
                    }`}
                    onClick={() => setActiveMode("van")}
                >
                    <Truck className="h-6 w-6" />
                    Furgonetas
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
                        <SearchFormV1 />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
