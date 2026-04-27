"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { TripCardType } from "@/lib/shared/types/trip-service-type.type";
import { DateTime } from "luxon";

interface TripCard2Props {
  trip: TripCardType;
  timeZone: string;
}

const TripCard2 = ({ trip, timeZone }: TripCard2Props) => {
  const departureTime = DateTime.fromISO(trip.departure).setZone(timeZone).toFormat("HH:mm");
  const arrivalTime = DateTime.fromISO(trip.arrival).setZone(timeZone).toFormat("HH:mm");
  
  const departureDate = DateTime.fromISO(trip.departure).setZone(timeZone);
  const arrivalDate = DateTime.fromISO(trip.arrival).setZone(timeZone);
  
  const durationMs = arrivalDate.toMillis() - departureDate.toMillis();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const ivaRate = 21;
  const discountedPrice = trip.discountedPrice ?? trip.basePrice;
  const priceWithIva = discountedPrice * (1 + ivaRate / 100);
  const priceDisplay = priceWithIva.toFixed(2).replace(".", ",");

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/trip2?id=${trip.id}`} className="block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
          {/* Header */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    {departureTime}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">—</span>
                <span className="text-sm text-gray-600">{durationStr}</span>
                <span className="text-gray-400 text-sm">—</span>
                <span className="text-sm font-medium text-gray-700">{arrivalTime}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{priceDisplay.split(",")[0]}</span>
                <span className="text-sm text-gray-500">,{priceDisplay.split(",")[1]}</span>
                <span className="text-sm text-gray-500 ml-1">€</span>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-gray-900">{trip.origin}</span>
                </div>
                <p className="text-sm text-gray-500 pl-4">{trip.originLocation || "Punto de encuentro"}</p>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-gray-300 relative mx-2">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{trip.destination}</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                </div>
                <p className="text-sm text-gray-500 pr-4">{trip.destinationLocation || "Punto de llegada"}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-3" />

            {/* Footer */}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-amber-600">Ver detalles</span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TripCard2;
