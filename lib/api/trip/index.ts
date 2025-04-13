import { BACKEND_URL } from "@/lib/constants";
import { fetcher, fetchWithOptionalAuth } from "@/lib/functions";
import { SearchTrip, Trip, TripCardType } from "@/lib/shared/types/trip-service-type.type";

export const getTripForDetail = async (id: string): Promise<Trip> => {
  return fetchWithOptionalAuth<Trip>(`${BACKEND_URL}/trip/for_detail/${id}`);
};

export const getTripForPurchase = async (id: string): Promise<TripCardType> => {
  return fetchWithOptionalAuth<TripCardType>(`${BACKEND_URL}/trip/for_purchase/${id}`);
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
