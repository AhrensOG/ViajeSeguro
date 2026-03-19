"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { Search } from "lucide-react";
import CityAutocomplete from "@/components/common/CityAutocomplete";
import CustomDatePicker from "@/lib/client/components/CustomDatePicker";
import CustomDatePickerVehicle from "@/lib/client/components/CustomDatePickerVehicle";

type Mode = "trip" | "vehicle";

const vehicleCategories = [
  { id: "car", label: "Coche" },
  { id: "van", label: "Furgoneta" },
  { id: "truck", label: "Camión" },
  { id: "moto", label: "Moto" },
];

const HeroMinimal = () => {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("trip");
  
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState<Date | undefined>(undefined);
  
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState("car");

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

    router.push(`/search?${params.toString()}`);
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

    router.push(`/search?${params.toString()}`);
  };

  const tripValid = origin && destination && departure;
  const vehicleValid = location && pickupDate && returnDate;
  const isValid = mode === "trip" ? tripValid : vehicleValid;

  const handleSearch = mode === "trip" ? handleTripSearch : handleVehicleSearch;

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/main/iniciovs.jpeg')] bg-cover bg-center" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-[#101010]">Viaje</span><span className="text-custom-golden-600">Seguro</span>
            <span className="block text-2xl md:text-3xl mt-2 text-slate-300 font-normal">
              Desde 20€ • Madrid • Barcelona • Valencia
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
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
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <CityAutocomplete
                      value={location}
                      onChange={(val, meta) => setLocation(pickOnlyCity(val, meta))}
                      placeholder="Provincia"
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
                  <div className="w-full md:w-40">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-full min-h-[46px] px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      {vehicleCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleVehicleSearch}
                  disabled={!vehicleValid}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    vehicleValid
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Search className="w-5 h-5" />
                  Buscar vehículos
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-slate-400 text-sm">
            <span className="text-amber-400 font-medium">✓</span> Sin cancelación hasta 24h antes
            <span className="mx-3">|</span>
            <span className="text-amber-400 font-medium">✓</span> Pago fácil en efectivo
            <span className="mx-3">|</span>
            <span className="text-amber-400 font-medium">✓</span> Support 24/7
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroMinimal;
