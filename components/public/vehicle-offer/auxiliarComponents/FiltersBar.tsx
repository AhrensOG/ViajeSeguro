"use client";

import { Calendar, Car, Truck, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchForm from "@/lib/client/components/SearchForm";
import { motion } from "framer-motion";
import CustomDatePicker from "@/lib/client/components/CustomDatePicker";
import { ClientSearchFormData } from "@/lib/client/trip/types/search-form.type";
import { toast } from "sonner"; // asegurate de tenerlo instalado

export default function FiltersBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [mode, setMode] = useState<"car" | "van">(searchParams.get("mode") === "van" ? "van" : "car");
    const [pickupDate, setPickupDate] = useState<Date | undefined>();
    const [returnDate, setReturnDate] = useState<Date | undefined>();
    const [capacity, setCapacity] = useState<string>("");

    useEffect(() => {
        const dep = searchParams.get("departure");
        const ret = searchParams.get("return");
        const cap = searchParams.get("capacity");
        if (dep) setPickupDate(new Date(dep));
        if (ret) setReturnDate(new Date(ret));
        if (cap) setCapacity(cap);
    }, [searchParams]);

    const departureDateStr = searchParams.get("departure") || "";
    const departureDate = departureDateStr ? new Date(departureDateStr) : undefined;

    const handleModeClick = (selected: "car" | "van") => {
        setMode(selected);

        if (selected === "car") {
            // Solo cambiamos el modo y limpiamos los filtros de van
            const sp = new URLSearchParams();
            sp.set("mode", "car");

            // Mantené lo que quieras como prefill si tiene sentido
            if (searchParams.get("origin")) sp.set("origin", searchParams.get("origin")!);
            if (searchParams.get("destination")) sp.set("destination", searchParams.get("destination")!);
            if (searchParams.get("serviceType")) sp.set("serviceType", searchParams.get("serviceType")!);
            if (searchParams.get("departure")) sp.set("departure", searchParams.get("departure")!);

            router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
        } else {
            // Limpiar todo menos los campos de van
            const sp = new URLSearchParams();
            sp.set("mode", "van");

            if (pickupDate) sp.set("departure", pickupDate.toISOString());
            if (returnDate) sp.set("return", returnDate.toISOString());
            if (capacity) sp.set("capacity", capacity);

            router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
        }
    };

    const handleSearch = (data: ClientSearchFormData) => {
        if (!data.origin || !data.destination || !(data.departure instanceof Date) || isNaN(data.departure.getTime())) {
            toast.warning("Por favor, completa todos los campos obligatorios para buscar.");
            return;
        }

        const sp = new URLSearchParams();

        // Solo agregamos los filtros relevantes para 'car'
        sp.set("mode", "car");
        sp.set("origin", data.origin);
        sp.set("destination", data.destination);
        sp.set("serviceType", data.serviceType);
        sp.set("departure", data.departure.toISOString());

        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const handleSearchVan = () => {
        if (!pickupDate || !returnDate || !capacity) {
            toast.warning("Completa todos los filtros antes de buscar.");
            return;
        }

        const sp = new URLSearchParams();

        // Solo agregamos los filtros relevantes para 'van'
        sp.set("mode", "van");
        sp.set("departure", pickupDate.toISOString());
        sp.set("return", returnDate.toISOString());
        sp.set("capacity", capacity);

        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-col lg:flex-row lg:flex-nowrap flex-wrap gap-4 p-4 w-full shadow-sm border border-custom-gray-100 px-4 sm:px-8 md:px-16 lg:px-4">
            {/* Modo de transporte */}
            <div className="flex justify-start items-center gap-4 bg-custom-gray-200 p-2 border border-custom-gray-200 rounded-md md:justify-center">
                <p
                    className={`text-custom-gray-800 flex items-center gap-2 cursor-pointer md:w-full md:justify-center ${
                        mode === "car" ? "bg-custom-white-100 p-2 px-3 rounded-md lg:p-3" : ""
                    }`}
                    onClick={() => handleModeClick("car")}
                >
                    <Car className="h-5 w-5" />
                    Transporte
                </p>
                <p
                    className={`text-custom-gray-800 flex items-center gap-2 cursor-pointer md:w-full md:justify-center ${
                        mode === "van" ? "bg-custom-white-100 p-2 px-3 rounded-md lg:p-3" : ""
                    }`}
                    onClick={() => handleModeClick("van")}
                >
                    <Truck className="h-5 w-5" />
                    Furgonetas
                </p>
            </div>

            {/* Filtros VAN */}
            {mode === "van" ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-custom-white-100 py-4 w-full px-2 sm:px-4"
                >
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        <div className="flex flex-col md:flex-row gap-2 w-full">
                            <div className="w-full">
                                <CustomDatePicker onSelect={setPickupDate} value={pickupDate} placeholder="Recogida" />
                            </div>
                            <div className="w-full">
                                <CustomDatePicker onSelect={setReturnDate} value={returnDate} placeholder="Devolución" />
                            </div>
                            <div className="w-full">
                                <div className="relative w-full">
                                    <div className="w-full flex items-center justify-between border border-custom-gray-300 bg-custom-white-100 px-4 py-3 rounded-lg shadow-sm text-custom-gray-500 focus-within:ring-1 focus-within:ring-custom-golden-600 transition">
                                        <div className="flex items-center gap-3 w-full">
                                            <Users className="h-5 w-5 text-custom-gray-600" />
                                            <input
                                                id="capacity"
                                                type="number"
                                                placeholder="Capacidad"
                                                className="w-full outline-none bg-transparent text-custom-gray-800 placeholder:text-custom-gray-500"
                                                value={capacity}
                                                onChange={(e) => setCapacity(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center w-full lg:w-auto">
                            <button
                                onClick={handleSearchVan}
                                className="w-full md:w-full sm:w-auto bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 font-medium rounded-lg px-6 py-3 transition"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="w-full">
                    <SearchForm
                        initialData={{
                            origin: searchParams.get("origin") || "",
                            destination: searchParams.get("destination") || "",
                            serviceType: (searchParams.get("serviceType") as any) || "SIMPLE_TRIP",
                            departure: departureDate ?? new Date(),
                            mode: "car",
                        }}
                        onSearch={handleSearch}
                    />
                </div>
            )}
        </div>
    );
}
