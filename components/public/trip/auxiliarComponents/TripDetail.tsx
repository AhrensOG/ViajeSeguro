"use client";

import { motion } from "framer-motion";
import { AlertCircle, MessageCircle, ShieldCheck } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import { Trip } from "@/lib/shared/types/trip-service-type.type";
import TripRouteCompact from "@/lib/client/components/TripRouteCompact";
import Link from "next/link";
import LuggageInfoCard from "./LuggageInfoCard";

type TripDetailProps = {
  trip: Trip;
};

const TripDetail = ({ trip }: TripDetailProps) => {
  const departure = DateTime.fromISO(trip.departure).setZone(
    trip.originalTimeZone
  );
  const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);
  const duration = arrival.diff(departure, ["hours", "minutes"]).toObject();
  const durationStr = `${duration.hours?.toFixed(
    0
  )}h${duration.minutes?.toFixed(0)}m`;
  const fullname = `${trip.user.name} ${trip.user.lastName}`;

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Info principal del viaje */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <TripRouteCompact
          departureTime={departure.toFormat("HH:mm")}
          duration={durationStr}
          arrivalTime={arrival.toFormat("HH:mm")}
          originCity={trip.origin}
          originLocation={trip.originLocation}
          destinationCity={trip.destination}
          destinationLocation={trip.destinationLocation}
          size="md"
        />
      </motion.div>

      {/* Política de equipaje y selección de maletas adicionales */}
      <LuggageInfoCard />

      {/* Info del conductor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {trip.user.avatarUrl && (
              <div className="relative w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={trip.user.avatarUrl}
                  fill
                  alt="Avatar"
                  className="object-cover object-center"
                />
              </div>
            )}
            <div>
              <h3 className="text-xl font-medium text-custom-black-800">
                {fullname ?? "Viaje Seguro"}
              </h3>
              <p className="text-sm text-custom-gray-600 mt-1">
                <span className="font-medium">Organizador:</span> {fullname}
              </p>
              <p className="text-sm text-custom-gray-600">
                <span className="font-medium">Conductor:</span> {trip.user.driverVerified ? fullname : "Aún no hay conductor asignado"}
              </p>
            </div>
          </div>
        </div>

        {trip.user.driverVerified && (
          <div className="mt-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-custom-golden-600" />
            <span className="text-custom-gray-600 text-sm">
              Perfil verificado
            </span>
          </div>
        )}

        <div className="mt-4 text-custom-gray-600">
          Viaje desde <span className="capitalize">{trip.origin}</span> hacia{" "}
          <span className="capitalize">{trip.destination}</span>
        </div>
        <div className="mt-1 text-custom-gray-600 text-sm">
          <span className="font-medium">Lugar de salida:</span> {trip.originLocation}
        </div>

        <div className="mt-6 flex items-center gap-2 text-custom-gray-600 border-t border-custom-gray-300 pt-4">
          <AlertCircle size={16} className="text-custom-golden-600" />
          <span className="text-sm">
            Tu reserva no se confirmará hasta que {fullname} acepte la solicitud
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 w-full flex items-center justify-center gap-2 text-custom-golden-600 border border-custom-golden-600 hover:bg-custom-golden-100 rounded-lg py-2 px-4">
          <MessageCircle size={18} />
          <Link href={"https://wa.me/34624051168"} target="_blank">
            Contactar con Viaje Seguro
          </Link>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TripDetail;
