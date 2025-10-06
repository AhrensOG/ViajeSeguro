"use client";

import { useState, useEffect } from "react";
import CityAutocomplete from "@/components/common/CityAutocomplete";
import CustomDatePicker from "./CustomDatePicker";
import { motion } from "framer-motion";
import { TripServiceType } from "@/lib/shared/types/trip-service-type.type";
import { ClientSearchFormData } from "../trip/types/search-form.type";

interface SearchFormProps {
    initialData?: ClientSearchFormData;
    onSearch: (data: ClientSearchFormData) => void;
}

const SearchForm = ({
    initialData = {
        origin: "",
        destination: "",
        serviceType: "SIMPLE_TRIP",
        departure: new Date(),
        mode: "car",
    },
    onSearch,
}: SearchFormProps) => {
    const [origin, setOrigin] = useState(initialData.origin || "");
    const [destination, setDestination] = useState(initialData.destination || "");
    const [departure, setDeparture] = useState<Date | undefined>(initialData.departure ? new Date(initialData.departure) : undefined);
    const [loading] = useState(false);

    useEffect(() => {}, []);

    // CityAutocomplete muestra "Nombre, ES", pero almacenamos solo el nombre de ciudad
    const pickOnlyCity = (val: string, meta?: { payload?: { name?: string } }) => {
        if (meta?.payload?.name) return meta.payload.name;
        const city = (val || "").split(",")[0]?.trim();
        return city || val;
    };

    const isFormValid = origin && destination && departure;

    const handleSearch = () => {
        if (!isFormValid) return;

        const searchData: ClientSearchFormData = {
            origin,
            destination,
            serviceType: "SIMPLE_TRIP" as TripServiceType,
            departure,
            mode: "car",
        };

        onSearch(searchData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-custom-white-100 py-4 w-full"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col lg:flex-row gap-2 w-full">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <CityAutocomplete
                                value={origin}
                                onChange={(val, meta) => setOrigin(pickOnlyCity(val, meta))}
                                placeholder={"Origen"}
                                allowFreeText
                                disabled={loading}
                            />
                            <CityAutocomplete
                                value={destination}
                                onChange={(val, meta) => setDestination(pickOnlyCity(val, meta))}
                                placeholder={"Destino"}
                                allowFreeText
                                disabled={loading}
                            />
                            <CustomDatePicker onSelect={setDeparture} value={departure} />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleSearch}
                            disabled={!isFormValid}
                            className={`w-full md:w-auto bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 font-medium rounded-lg px-6 py-3 transition ${
                                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SearchForm;
