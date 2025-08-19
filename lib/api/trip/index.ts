import { BACKEND_URL } from "@/lib/constants";
import { fetcher, fetchWithOptionalAuth } from "@/lib/functions";
import { SearchTrip, SearchTripResult, Trip, TripCardType, TripDiscount } from "@/lib/shared/types/trip-service-type.type";

export const getTripForDetail = async (id: string): Promise<Trip> => {
  return fetchWithOptionalAuth<Trip>(`${BACKEND_URL}/trip/for_detail/${id}`);
};

export const getTripForPurchase = async (id: string): Promise<TripCardType> => {
  return fetchWithOptionalAuth<TripCardType>(`${BACKEND_URL}/trip/for_purchase/${id}`);
};

export const searchTrips = async (query: SearchTrip): Promise<SearchTripResult> => {
  const params = new URLSearchParams({
    origin: query.origin,
    destination: query.destination,
    departure: query.departure,
    serviceType: query.serviceType,
  });

  return fetcher<SearchTripResult>(`${BACKEND_URL}/trip/search?${params.toString()}`);
};

export const getDiscountByUserId = async () => {
  return fetchWithOptionalAuth<TripDiscount>(`${BACKEND_URL}/user/discount`);
};
