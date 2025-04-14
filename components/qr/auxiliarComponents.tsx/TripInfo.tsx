"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { DateTime } from "luxon";
import { CalendarDays, Clock } from "lucide-react";

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
    <section>
      <div className="flex items-center gap-2 text-custom-golden-700 mb-1">
        <CalendarDays className="size-5" />
        <span className="font-medium">
          {departure.setLocale("es").toFormat("cccc, d 'de' LLLL")}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-custom-black-800 capitalize">
        {trip.origin} → {trip.destination}
      </h2>
      <p className="text-sm text-custom-gray-600 capitalize">
        {trip.originLocation} — {trip.destinationLocation}
      </p>

      <div className="flex items-center gap-2 mt-1 text-sm text-custom-gray-700">
        <Clock className="size-4" />
        <span>
          {departure.toFormat("HH:mm")} — {arrival.toFormat("HH:mm")}
        </span>
      </div>
    </section>
  );
};

export default TripInfo;
