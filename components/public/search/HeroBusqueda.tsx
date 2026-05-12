"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import CustomDatePicker from "@/lib/client/components/CustomDatePicker";
import { DateTime } from "luxon";

const ROUTES = [
  { label: "Barcelona → Valencia", short: "BCN → VLC", origin: "Barcelona", destination: "Valencia" },
  { label: "Valencia → Barcelona", short: "VLC → BCN", origin: "Valencia", destination: "Barcelona" },
];

const HeroBusqueda = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialOrigin = searchParams.get("origin") || "";
  const initialDest = searchParams.get("destination") || "";
  const initialRouteIndex = ROUTES.findIndex(
    (r) => r.origin === initialOrigin && r.destination === initialDest
  );

  const [routeIndex, setRouteIndex] = useState(initialRouteIndex >= 0 ? initialRouteIndex : 0);
  const [departure, setDeparture] = useState<Date | undefined>(
    searchParams.get("departure") ? new Date(searchParams.get("departure")!) : undefined
  );

  const { origin, destination } = ROUTES[routeIndex];
  const isValid = !!departure;

  const handleSearch = () => {
    if (!departure) return;

    const userTimeZone = DateTime.local().zoneName;
    const selectedDate = DateTime.fromJSDate(departure).setZone(userTimeZone);
    const dateTimeWithTime = selectedDate.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
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

  return (
    <section className="bg-gradient-to-b from-gray-100 to-gray-50 py-8 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-4 max-w-3xl mx-auto"
        >
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
              disabled={!isValid}
              className={`px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                isValid
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBusqueda;
