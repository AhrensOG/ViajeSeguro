"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Car } from "lucide-react";
import CityAutocomplete from "@/components/common/CityAutocomplete";
import CustomDatePicker from "@/lib/client/components/CustomDatePicker";
import CustomDatePickerVehicle from "@/lib/client/components/CustomDatePickerVehicle";
import { DateTime } from "luxon";

type Mode = "trip" | "vehicle";

const HeroBusqueda = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>("trip");
  
  const [origin, setOrigin] = useState(searchParams.get("origin") || "");
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [departure, setDeparture] = useState<Date | undefined>(
    searchParams.get("departure") ? new Date(searchParams.get("departure")!) : undefined
  );
  
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  const pickOnlyCity = (val: string, meta?: { payload?: { name?: string } }) => {
    if (meta?.payload?.name) return meta.payload.name;
    const city = (val || "").split(",")[0]?.trim();
    return city || val;
  };

  const handleTripSearch = () => {
    if (!origin || !destination || !departure) return;

    const userTimeZone = DateTime.local().zoneName;
    const selectedDate = DateTime.fromJSDate(departure).setZone(userTimeZone);
    const dateTimeWithTime = selectedDate.set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const isoStringWithTZ = dateTimeWithTime.toISO();
    if (!isoStringWithTZ) return;

    const params = new URLSearchParams({
      origin,
      destination,
      departure: isoStringWithTZ,
      serviceType: "SIMPLE_TRIP",
      mode: "car",
    });

    router.push(`/search2?${params.toString()}`);
  };

  const handleVehicleSearch = () => {
    if (!location || !pickupDate || !returnDate) return;

    const userTimeZone = DateTime.local().zoneName;
    const pickup = DateTime.fromJSDate(pickupDate).setZone(userTimeZone).toISO();
    const returnD = DateTime.fromJSDate(returnDate).setZone(userTimeZone).toISO();

    if (!pickup || !returnD) return;

    const params = new URLSearchParams({
      departure: pickup,
      return: returnD,
      capacity: "1",
      mode: "van",
      serviceType: "WITHOUT_DRIVER",
      origin: location,
    });

    router.push(`/search2?${params.toString()}`);
  };

  const tripValid = origin && destination && departure;
  const vehicleValid = location && pickupDate && returnDate;
  const isValid = mode === "trip" ? tripValid : vehicleValid;

  const handleSearch = mode === "trip" ? handleTripSearch : handleVehicleSearch;

  return (
    <section className="relative bg-gradient-to-b from-gray-100 to-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-4 max-w-5xl mx-auto"
        >
          {/* Toggle tabs */}
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 p-1 rounded-lg flex">
              <button
                onClick={() => setMode("trip")}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  mode === "trip"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Viaje Compartido
              </button>
              <button
                onClick={() => setMode("vehicle")}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  mode === "vehicle"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Alquiler de Vehículos
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === "trip" ? (
              <motion.div
                key="trip"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-stretch gap-3"
              >
                <div className="flex-1">
                  <CityAutocomplete
                    value={origin}
                    onChange={(val, meta) => setOrigin(pickOnlyCity(val, meta))}
                    placeholder="Origen"
                    allowFreeText
                  />
                </div>
                <div className="flex-1">
                  <CityAutocomplete
                    value={destination}
                    onChange={(val, meta) => setDestination(pickOnlyCity(val, meta))}
                    placeholder="Destino"
                    allowFreeText
                  />
                </div>
                <div className="flex-1">
                  <CustomDatePicker
                    onSelect={setDeparture}
                    value={departure}
                    placeholder="Fecha"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!isValid}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    isValid
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Search className="w-5 h-5" />
                  Buscar
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="vehicle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-stretch gap-3"
              >
                <div className="flex-1">
                  <CityAutocomplete
                    value={location}
                    onChange={(val, meta) => setLocation(pickOnlyCity(val, meta))}
                    placeholder="Ciudad o provincia"
                    allowFreeText
                  />
                </div>
                <div className="flex-1">
                  <CustomDatePickerVehicle
                    onSelect={setPickupDate}
                    value={pickupDate}
                    placeholder="Fecha recogida"
                    fromDate={new Date()}
                  />
                </div>
                <div className="flex-1">
                  <CustomDatePickerVehicle
                    onSelect={setReturnDate}
                    value={returnDate}
                    placeholder="Fecha devolución"
                    fromDate={pickupDate || new Date()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!isValid}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    isValid
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Car className="w-5 h-5" />
                  Buscar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBusqueda;
