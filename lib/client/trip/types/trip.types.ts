import { TripServiceType } from "@/lib/shared/types/trip-service-type.type";

export interface TripCardType {
  id: string;
  basePrice: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  originLocation: string;
  destinationLocation: string;
}

export interface TripRouteCompactType {
  departureTime: string;
  duration: string;
  arrivalTime: string;
  originCity: string;
  originLocation?: string;
  destinationCity: string;
  destinationLocation?: string;
  size?: "sm" | "md" | "lg";
}

export interface SearchTripDto {
  origin: string;
  destination: string;
  departure: string;
  serviceType: TripServiceType
}