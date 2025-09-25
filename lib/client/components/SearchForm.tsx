"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { getActiveCitiesPublic } from "@/lib/api/admin/cities";
import { CityResponse } from "@/lib/api/admin/cities/cities.type";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatePicker";
import { motion } from "framer-motion";
import { TripServiceType } from "@/lib/shared/types/trip-service-type.type";
import { ClientSearchFormData } from "../trip/types/search-form.type";
import { toast } from "sonner";

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
    const [cities, setCities] = useState<CityResponse[]>([]);
    const [origin, setOrigin] = useState(initialData.origin || "");
    const [destination, setDestination] = useState(initialData.destination || "");
    const [departure, setDeparture] = useState<Date | undefined>(initialData.departure ? new Date(initialData.departure) : undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const activeCities = await getActiveCitiesPublic();
                setCities(activeCities);
            } catch {
                toast.error("Error al cargar las ciudades");
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    // Transform cities to the format expected by CustomSelect
    const cityOptions = cities.map(city => ({
        value: `${city.name}, ${city.state}, ${city.country}`,
        label: `${city.name}, ${city.state}, ${city.country}`
    }));

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
                            <CustomSelect
                                options={cityOptions}
                                placeholder={loading ? "Cargando ciudades..." : "Origen"}
                                onSelect={setOrigin}
                                value={origin}
                                icon={<MapPin className="h-5 w-5 text-custom-gray-600" />}
                                disabled={loading}
                            />
                            <CustomSelect
                                options={cityOptions}
                                placeholder={loading ? "Cargando ciudades..." : "Destino"}
                                onSelect={setDestination}
                                value={destination}
                                icon={<MapPin className="h-5 w-5 text-custom-gray-600" />}
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
