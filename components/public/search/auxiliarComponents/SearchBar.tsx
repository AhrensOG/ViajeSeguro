"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MapPin } from "lucide-react";
import CustomSelect from "@/lib/components/CustomSelect";
import CustomDatePicker from "@/lib/components/CustomDatePicker";
import { CITIES, SERVICES } from "@/lib/constants";

const SearchBar = () => {
  const params = useSearchParams();
  const [origen, setOrigen] = useState(params.get("origen") || "");
  const [destino, setDestino] = useState(params.get("destino") || "");
  const [service, setService] = useState(params.get("service") || "");
  const [fecha, setFecha] = useState<Date | undefined>(
    params.get("fecha") ? new Date(params.get("fecha") as string) : undefined
  );

  return (
    <div className="bg-custom-white-100 shadow-sm py-4 sticky top-[60px] z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col lg:flex-row gap-2 w-full">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <CustomSelect
                options={CITIES}
                placeholder="Origen"
                onSelect={setOrigen}
                value={origen}
                icon={<MapPin className="h-5 w-5 text-custom-gray-600" />}
              />
              <CustomSelect
                options={CITIES}
                placeholder="Destino"
                onSelect={setDestino}
                value={destino}
                icon={<MapPin className="h-5 w-5 text-custom-gray-600" />}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <CustomDatePicker onSelect={setFecha} value={fecha} />
              <CustomSelect
                options={SERVICES}
                placeholder="Servicio"
                onSelect={setService}
                value={service}
                icon={<MapPin className="h-5 w-5 text-custom-gray-600" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
