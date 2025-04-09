import { Trip } from "@/lib/shared/types/trip-service-type.type";

export interface ClientTripRouteCompactType {
  departureTime: string;
  duration: string;
  arrivalTime: string;
  originCity: string;
  originLocation?: string;
  destinationCity: string;
  destinationLocation?: string;
  size?: "sm" | "md" | "lg";
}