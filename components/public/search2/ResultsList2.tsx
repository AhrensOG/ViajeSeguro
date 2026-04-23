"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Calendar, Loader2 } from "lucide-react";
import { searchTrips } from "@/lib/api/trip";
import { SearchTrip, SearchTripResult } from "@/lib/shared/types/trip-service-type.type";
import { DateTime } from "luxon";
import TripCard2 from "./TripCard2";

const EMPTY_RESULT: SearchTripResult = {
  exact: [],
  previous: [],
  next: [],
  futureAll: [],
};

const ResultsList2 = () => {
  const searchParams = useSearchParams();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [trips, setTrips] = useState<SearchTripResult>(EMPTY_RESULT);
  const [isLoading, setIsLoading] = useState(true);

  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";
  const departureParam = searchParams.get("departure");

  const formatDate = (dateStr: string) => {
    try {
      const date = DateTime.fromISO(dateStr).setZone(userTimeZone);
      return date.setLocale("es").toFormat("cccc, d 'de' LLLL");
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      const serviceType = (searchParams.get("serviceType") as SearchTrip["serviceType"]) || "SIMPLE_TRIP";
      const departure = departureParam || "";

      if (!origin || !destination || !departure) {
        setTrips(EMPTY_RESULT);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const query: SearchTrip = { origin, destination, serviceType, departure };

      try {
        const data = await searchTrips(query);
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setTrips(EMPTY_RESULT);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [origin, destination, departureParam, searchParams]);

  const allTrips = [...trips.exact, ...trips.previous, ...trips.next];
  const hasTrips = allTrips.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con resumen de búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            Viajes de <strong className="text-gray-900">{origin}</strong> a{" "}
            <strong className="text-gray-900">{destination}</strong>
          </span>
        </div>
        {departureParam && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(departureParam)}</span>
          </div>
        )}
      </motion.div>

      {/* Estados */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
          <p className="text-gray-500">Buscando viajes disponibles...</p>
        </div>
      )}

      {!isLoading && !hasTrips && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay viajes disponibles
          </h3>
          <p className="text-gray-500">
            No encontramos viajes para esta ruta y fecha. Intenta con otra fecha o modifica tu búsqueda.
          </p>
        </motion.div>
      )}

      {/* Lista de viajes */}
      {!isLoading && hasTrips && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {allTrips.length} {allTrips.length === 1 ? "viaje encontrado" : "viajes encontrados"}
            </h2>
          </div>

          {trips.exact.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Para el {departureParam ? DateTime.fromISO(departureParam).setZone(userTimeZone).setLocale("es").toFormat("d 'de' LLLL") : "día seleccionado"}
              </h3>
              {trips.exact.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TripCard2 trip={trip} timeZone={userTimeZone} />
                </motion.div>
              ))}
            </div>
          )}

          {trips.previous.length > 0 && (
            <div className="space-y-4 mt-8">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Días anteriores
              </h3>
              {trips.previous.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TripCard2 trip={trip} timeZone={userTimeZone} />
                </motion.div>
              ))}
            </div>
          )}

          {trips.next.length > 0 && (
            <div className="space-y-4 mt-8">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Días siguientes
              </h3>
              {trips.next.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TripCard2 trip={trip} timeZone={userTimeZone} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsList2;
