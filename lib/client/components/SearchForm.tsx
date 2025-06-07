"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
// import { LOCATIONS, SERVICES } from "@/lib/constants";
import { LOCATIONS } from "@/lib/constants";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatePicker";
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
  },
  onSearch,
}: SearchFormProps) => {
  const [origin, setOrigin] = useState(initialData.origin || "");
  const [destination, setDestination] = useState(initialData.destination || "");
  const [departure, setDeparture] = useState<Date | undefined>(
    initialData.departure ? new Date(initialData.departure) : undefined
  );

  const isFormValid = origin && destination && departure;

  const handleSearch = () => {
    if (!isFormValid) return;

    const searchData: ClientSearchFormData = {
      origin,
      destination,
      serviceType: "SIMPLE_TRIP" as TripServiceType,
      departure,
    };

    onSearch(searchData);
  };

  return (
    <div className="bg-custom-white-100 shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col lg:flex-row gap-2 w-full">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <CustomSelect
                options={LOCATIONS}
                placeholder="Origen"
                onSelect={setOrigin}
                value={origin}
                icon={<MapPin className="h-5 w-5 text-custom-gray-600" />}
              />
              <CustomSelect
                options={LOCATIONS}
                placeholder="Destino"
                onSelect={setDestination}
                value={destination}
                icon={<MapPin className="h-5 w-5 text-custom-gray-600" />}
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
              }`}>
              Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
