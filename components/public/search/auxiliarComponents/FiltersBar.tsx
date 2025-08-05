"use client";

import { Car, Truck, Users } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchForm from "@/lib/client/components/SearchForm";
import { motion } from "framer-motion";
import CustomDatePicker from "@/lib/client/components/CustomDatePicker";
import { ClientSearchFormData } from "@/lib/client/trip/types/search-form.type";
import { toast } from "sonner";

export default function FiltersBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const modeFromParams = searchParams.get("mode") === "van" ? "van" : "car";
    const pickupDateParam = searchParams.get("departure");
    const returnDateParam = searchParams.get("return");

    const [mode, setMode] = useState<"car" | "van">(modeFromParams);
    const [pickupDate, setPickupDate] = useState<Date | undefined>(pickupDateParam ? new Date(pickupDateParam) : undefined);
    const [returnDate, setReturnDate] = useState<Date | undefined>(returnDateParam ? new Date(returnDateParam) : undefined);
    const [capacity, setCapacity] = useState<string>(searchParams.get("capacity") || "");
    const [origin] = useState<string>(searchParams.get("origin") || "");
    const [serviceType, setServiceType] = useState<"WITH_DRIVER" | "WITHOUT_DRIVER">(
        (searchParams.get("serviceType") as "WITH_DRIVER" | "WITHOUT_DRIVER") || "WITH_DRIVER"
    );

    const handleModeClick = (selected: "car" | "van") => {
        setMode(selected);
        const sp = new URLSearchParams();

        sp.set("mode", selected);

        if (selected === "car") {
            if (searchParams.get("origin")) sp.set("origin", searchParams.get("origin")!);
            if (searchParams.get("destination")) sp.set("destination", searchParams.get("destination")!);
            if (searchParams.get("serviceType")) sp.set("serviceType", searchParams.get("serviceType")!);
            if (searchParams.get("departure")) sp.set("departure", searchParams.get("departure")!);
        } else {
            if (pickupDate) sp.set("departure", pickupDate.toISOString());
            if (returnDate) sp.set("return", returnDate.toISOString());
            if (capacity) sp.set("capacity", capacity);
            if (origin) sp.set("origin", origin);
            if (serviceType) sp.set("serviceType", serviceType);
        }

        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    // const updateSearchParams = (formData: ClientSearchFormData) => {
    //     const params = new URLSearchParams(searchParams.toString());

    //     Object.entries(formData).forEach(([key, value]) => {
    //         if (value) {
    //             if (value instanceof Date) {
    //                 const selectedDate = DateTime.fromJSDate(value).setZone(userTimeZone);
    //                 const now = DateTime.local().setZone(userTimeZone);

    //                 const dateTimeWithTime = selectedDate.set({
    //                     hour: now.hour,
    //                     minute: now.minute,
    //                     second: now.second,
    //                 });

    //                 const isoStringWithTZ = dateTimeWithTime.toISO();

    //                 if (isoStringWithTZ) {
    //                     params.set(key, isoStringWithTZ);
    //                 }
    //             } else {
    //                 params.set(key, value);
    //             }
    //         } else {
    //             params.delete(key);
    //         }
    //     });

    //     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // };

    const updateSearchParams = (formData: ClientSearchFormData) => {
        const sp = new URLSearchParams();

        Object.entries(formData).forEach(([key, value]) => {
            if (value) {
                if (value instanceof Date) {
                    const now = new Date();
                    const adjustedDate = new Date(value);
                    adjustedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
                    sp.set(key, adjustedDate.toISOString());
                } else {
                    sp.set(key, value.toString());
                }
            }
        });

        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const handleSearch = (data: ClientSearchFormData) => {
        if (!data.origin || !data.destination || !data.departure) {
            toast.warning("Por favor, completa todos los campos obligatorios para buscar.");
            return;
        }

        const sp = new URLSearchParams();
        sp.set("mode", "car");
        sp.set("origin", data.origin);
        sp.set("destination", data.destination);
        sp.set("serviceType", data.serviceType);
        sp.set("departure", data.departure.toISOString());

        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const handleSearchVan = () => {
        if (!pickupDate || !returnDate || !capacity || !serviceType) {
            toast.warning("Completa todos los filtros antes de buscar.");
            return;
        }

        updateSearchParams({
            mode: "van",
            departure: pickupDate,
            return: returnDate,
            capacity,
            origin: pickupDate.toISOString(), // ahora origin es fecha
            serviceType,
        } as unknown as ClientSearchFormData);
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

            {mode === "van" ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-custom-white-100 py-4 w-full px-2 sm:px-4"
                >
                    <div className="grid grid-cols-5 gap-4 w-full items-stretch">
                        <div className="w-full">
                            <CustomDatePicker onSelect={setPickupDate} value={pickupDate} placeholder="Recogida" />
                        </div>

                        <div className="w-full">
                            <CustomDatePicker onSelect={setReturnDate} value={returnDate} placeholder="Devolución" />
                        </div>

                        <div className="w-full">
                            <div className="h-full flex items-center border border-custom-gray-300 bg-custom-white-100 px-4 py-3 rounded-lg shadow-sm text-custom-gray-500 focus-within:ring-1 focus-within:ring-custom-golden-600 transition">
                                <Users className="h-5 w-5 text-custom-gray-600 mr-2" />
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

                        {/* <div className="w-full">
                            <select
                                id="origin"
                                className="h-full w-full border border-custom-gray-300 bg-custom-white-100 px-4 py-3 rounded-lg shadow-sm text-custom-gray-800 focus:ring-1 focus:ring-custom-golden-600 transition"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                            >
                                <option value="">Origen</option>
                                <option value="Valencia">Valencia</option>
                                <option value="Madrid">Madrid</option>
                                <option value="Barcelona">Barcelona</option>
                                <option value="Sevilla">Sevilla</option>
                            </select>
                        </div> */}

                        <div className="w-full">
                            <select
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value as "WITH_DRIVER" | "WITHOUT_DRIVER")}
                                className="h-full w-full border border-custom-gray-300 bg-custom-white-100 px-4 py-3 rounded-lg shadow-sm text-custom-gray-800 focus:ring-1 focus:ring-custom-golden-600 transition"
                            >
                                <option value="WITH_DRIVER">Con conductor</option>
                                <option value="WITHOUT_DRIVER">Sin conductor</option>
                            </select>
                        </div>

                        <div className="w-full flex">
                            <button
                                onClick={handleSearchVan}
                                className="w-full h-full bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 font-medium rounded-lg px-6 py-3 transition"
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
                            serviceType: (searchParams.get("serviceType") as "SIMPLE_TRIP") || "SIMPLE_TRIP",
                            departure: pickupDate || new Date(),
                            mode: "car",
                        }}
                        onSearch={handleSearch}
                    />
                </div>
            )}
        </div>
    );
}
