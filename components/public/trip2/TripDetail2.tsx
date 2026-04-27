"use client";

import { motion } from "framer-motion";
import { DateTime } from "luxon";
import Image from "next/image";
import { Trip } from "@/lib/shared/types/trip-service-type.type";
import { ArrowRight, User, ShieldCheck, Clock } from "lucide-react";

type TripDetail2Props = {
  trip: Trip;
};

const TripDetail2 = ({ trip }: TripDetail2Props) => {
  const departure = DateTime.fromISO(trip.departure).setZone(trip.originalTimeZone);
  const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);
  const duration = arrival.diff(departure, ["hours", "minutes"]).toObject();
  const durationStr = `${duration.hours?.toFixed(0)}h ${duration.minutes?.toFixed(0)}m`;
  const fullname = `${trip.user.name} ${trip.user.lastName}`;

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Trip Route Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        {/* Time and Duration */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-amber-50 rounded-lg px-4 py-2">
            <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              {departure.toFormat("HH:mm")}
            </span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm text-gray-500">{durationStr}</span>
            <div className="flex-1 h-px bg-gray-200 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full" />
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg px-4 py-2">
            <span className="text-lg font-bold text-gray-700">
              {arrival.toFormat("HH:mm")}
            </span>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="font-semibold text-gray-900">{trip.origin}</span>
            </div>
            <p className="text-sm text-gray-500 pl-5">{trip.originLocation || "Punto de encuentro"}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="font-semibold text-gray-900">{trip.destination}</span>
              <div className="w-3 h-3 bg-amber-600 rounded-full" />
            </div>
            <p className="text-sm text-gray-500 pr-5">{trip.destinationLocation || "Punto de llegada"}</p>
          </div>
        </div>
      </motion.div>

      {/* Driver Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Información del conductor
        </h3>
        
        <div className="flex items-center gap-4">
          {trip.user.avatarUrl ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={trip.user.avatarUrl}
                fill
                alt="Avatar"
                className="object-cover object-center"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{fullname || "Viaje Seguro"}</p>
            <p className="text-sm text-gray-500">
              {trip.user.driverVerified ? (
                <span className="flex items-center gap-1 text-green-600">
                  <ShieldCheck className="w-4 h-4" />
                  Conductor verificado
                </span>
              ) : (
                "Conductor pendiente de verificar"
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Política del viaje
        </h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong className="text-gray-900">Equipaje:</strong> Una maleta de cabina y una de bodega incluidas.
          </p>
          <p>
            <strong className="text-gray-900">Mascotas:</strong> Consultar con el conductor antes de reservar.
          </p>
          <p>
            <strong className="text-gray-900">Cancelación:</strong> Cancelación gratuita hasta 24h antes del viaje.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TripDetail2;
