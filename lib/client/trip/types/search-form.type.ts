import { TripServiceType } from "@/lib/shared/types/trip-service-type.type";

export interface SearchFormData {
  origin: string;
  destination: string;
  departure: Date;
  serviceType: TripServiceType;
}
