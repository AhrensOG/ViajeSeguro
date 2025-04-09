import { BACKEND_URL } from "@/lib/constants";
import { fetcher } from "@/lib/functions";
import { SearchTrip, Trip, TripCardType } from "@/lib/shared/types/trip-service-type.type";

export const getTripById = async (id: string): Promise<Trip> => {
  return fetcher<Trip>(`${BACKEND_URL}/trip/${id}`);
};

export const searchTrips = async (query: SearchTrip): Promise<TripCardType[]> => {
  const params = new URLSearchParams({
    origin: query.origin,
    destination: query.destination,
    departure: query.departure,
    serviceType: query.serviceType,
  });

  return fetcher<TripCardType[]>(`${BACKEND_URL}/trip/search?${params.toString()}`);
};
