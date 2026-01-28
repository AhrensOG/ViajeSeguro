export type TripServiceType = "SIMPLE_TRIP";

export interface TripCardType {
  id: string;
  basePrice: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  originLocation: string;
  destinationLocation: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    avatarUrl?: string;
    role?: string;
  };
  discountPercentage?: number;
  discountedPrice?: number;
}

export interface SearchTripResult {
  exact: TripCardType[];
  previous: TripCardType[];
  next: TripCardType[];
  futureAll: TripCardType[];
}

export interface Trip {
  id: string;
  origin: string;
  originLocation: string;
  destination: string;
  destinationLocation: string;
  departure: string;
  arrival: string;
  originalTimeZone: string;
  basePrice: number;
  user: {
    id: string;
    name: string;
    lastName: string;
    avatarUrl?: string;
    driverVerified: boolean;
    role?: string;
  };
}

export interface SearchTrip {
  origin: string;
  destination: string;
  departure: string;
  serviceType: TripServiceType;
}

export interface DiscountItem {
  key: string;
  description: string;
  amount: number;
}

export interface PriceDetails {
  basePrice: number;
  finalPrice: number;
  discounts: DiscountItem[];
}
export interface TripWithPriceDetails extends Trip {
  priceDetails?: PriceDetails | null;
}

export interface TripDiscount {
  id: string;
}
