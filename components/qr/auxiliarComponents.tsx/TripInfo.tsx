"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { DateTime } from "luxon";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";

type Props = {
  reservation: ReservationResponse;
};

const TripInfo = ({ reservation }: Props) => {
  const { trip } = reservation;

  const departure = DateTime.fromISO(trip.departure).setZone(
    trip.originalTimeZone
  );
  const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);

  return (
    <section className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-amber-700">
          <MapPin className="size-4" />
          <span className="font-semibold text-sm">Ruta del viaje</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-0.5 h-8 bg-amber-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 capitalize">{trip.origin}</p>
            <p className="text-xs text-gray-500">{trip.originLocation}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
              <ArrowRight className="size-3" />
              <span className="text-emerald-600 font-medium">{trip.destination}</span>
              <span className="text-gray-500">— {trip.destinationLocation}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <CalendarDays className="size-4 text-gray-400" />
            <span>{departure.setLocale("es").toFormat("cccc, d 'de' LLLL")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="size-4 text-gray-400" />
            <span>{departure.toFormat("HH:mm")} — {arrival.toFormat("HH:mm")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripInfo;
