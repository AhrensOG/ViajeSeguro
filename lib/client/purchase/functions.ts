import { Trip } from "@/lib/shared/types/trip-service-type.type";
import { DateTime } from "luxon";

export const getSummaryFromTrip = (trip: Trip) => {
  const departure = DateTime.fromISO(trip.departure).setZone(
    trip.originalTimeZone
  );
  const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);
  const durationInMinutes = arrival.diff(departure, "minutes").minutes;
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = Math.round(durationInMinutes % 60);

  return {
    dateLabel: departure.setLocale("es").toFormat("ccc, dd 'de' LLLL"),
    departureTime: departure.toFormat("HH:mm"),
    arrivalTime: arrival.toFormat("HH:mm"),
    duration: `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`,
    originCity: trip.origin,
    originLocation: trip.originLocation,
    destinationCity: trip.destination,
    destinationLocation: trip.destinationLocation,
    price: trip.basePrice,
    size: "md" as const,
  };
};