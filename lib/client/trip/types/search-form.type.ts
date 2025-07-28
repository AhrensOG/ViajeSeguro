import { TripServiceType } from "@/lib/shared/types/trip-service-type.type";

export interface ClientSearchFormData {
    origin: string;
    destination: string;
    departure: Date;
    serviceType: TripServiceType;
    mode: "car" | "van";
}
