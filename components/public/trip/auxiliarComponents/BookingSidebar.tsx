"use client";

import { motion } from "framer-motion";
import { Calendar1Icon, ChevronRight } from "lucide-react";
import TripRouteCompact from "../../../../lib/client/components/TripRouteCompact";
import { DateTime } from "luxon";
import { Trip } from "@/lib/shared/types/trip-service-type.type";
import Link from "next/link";

type BookingSidebarProps = {
  trip: Trip;
};

const BookingSidebar = ({ trip }: BookingSidebarProps) => {
  const departure = DateTime.fromISO(trip.departure).setZone(
    trip.originalTimeZone
  );
  const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);
  const duration = arrival.diff(departure, ["hours", "minutes"]).toObject();
  const durationStr = `${duration.hours?.toFixed(
    0
  )}h${duration.minutes?.toFixed(0)}m`;

  const formattedDate = departure.setLocale("es").toFormat("cccc, d 'de' LLLL");
  const fullname = `${trip.user.name} ${trip.user.lastName}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="space-y-4">
      <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <h2 className="text-xl font-bold text-custom-black-900 mb-4">
          {formattedDate}
        </h2>

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

        <div className="flex items-center gap-3 mt-4 mb-6">
          <span className="font-medium">{fullname ?? "Conductor"}</span>
        </div>

        <div className="flex items-center justify-between border-t border-b border-custom-gray-300 py-4 my-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Importe</span>
            <ChevronRight size={16} className="text-custom-gray-500" />
          </div>
          <div className="text-2xl font-bold text-custom-black-800">
            {trip.basePrice.toFixed(2).replace(".", ",")} €
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
          <Link
            href={`/purchase?id=${trip.id}`}
            className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 py-4 mt-4 rounded-lg flex items-center justify-center">
            <Calendar1Icon size={16} className="mr-2" />
            Enviar solicitud
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookingSidebar;
