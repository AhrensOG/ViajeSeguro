"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { Search, CalendarDays } from "lucide-react";
import CustomDatePicker from "@/lib/client/components/CustomDatePicker";
import TripCalendar from "./TripCalendar";

const ROUTES = [
  { label: "Barcelona → Valencia", short: "BCN → VLC", origin: "Barcelona", destination: "Valencia" },
  { label: "Valencia → Barcelona", short: "VLC → BCN", origin: "Valencia", destination: "Barcelona" },
];

const HeroMinimal = () => {
  const router = useRouter();
  const [routeIndex, setRouteIndex] = useState(0);
  const [departure, setDeparture] = useState<Date | undefined>(undefined);

  const currentRoute = ROUTES[routeIndex];
  const { origin, destination } = currentRoute;

  const handleSearch = () => {
    if (!departure) return;

    const userTimeZone = DateTime.local().zoneName;
    const dateWithTime = DateTime.fromJSDate(departure).setZone(userTimeZone).set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const iso = dateWithTime.toISO();
    if (!iso) return;

    const params = new URLSearchParams({
      origin,
      destination,
      departure: iso,
      serviceType: "SIMPLE_TRIP",
      mode: "car",
    });

    router.push(`/search2?${params.toString()}`);
  };

  return (
    <section className="relative bg-gray-100 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/main/iniciovs.jpeg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <span className="text-black">Viaje</span><span className="text-custom-golden-600">Seguro</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-lg md:text-xl text-white/90 font-light">
            <span>Barcelona ↔ Valencia</span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span>Madrid ↔ Valencia</span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span>Madrid ↔ Barcelona</span>
          </div>
          <p className="text-base md:text-lg text-white/70 mt-3">
            Desde 20€ • Viajes directos • Sin cancelación hasta 24h antes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <div className="flex rounded-xl border border-gray-200 overflow-hidden shrink-0">
                {ROUTES.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setRouteIndex(i)}
                    className={`px-4 py-3 text-sm font-medium transition ${
                      routeIndex === i
                        ? "bg-amber-500 text-white"
                        : "bg-white text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {r.short}
                  </button>
                ))}
              </div>

              <div className="flex-1 min-w-0">
                <CustomDatePicker
                  onSelect={setDeparture}
                  value={departure}
                  placeholder="Selecciona fecha"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!departure}
                className={`px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  departure
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Search className="w-5 h-5" />
                Buscar
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-600">Disponibilidad de viajes</span>
              </div>
              <TripCalendar origin={origin} destination={destination} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-white/80 text-sm">
            <span className="text-amber-400 font-bold">✓</span> Sin cancelación hasta 24h antes
            <span className="mx-3 text-white/40">|</span>
            <span className="text-amber-400 font-bold">✓</span> Pago fácil en efectivo
            <span className="mx-3 text-white/40">|</span>
            <span className="text-amber-400 font-bold">✓</span> Soporte 24/7
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroMinimal;
