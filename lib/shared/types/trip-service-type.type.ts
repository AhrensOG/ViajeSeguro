export type TripServiceType =
  | 'SIMPLE_TRIP'
  | 'RENTAL_WITH_DRIVER'
  | 'RENTAL_WITHOUT_DRIVER';

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
  };
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
  };
}

export interface SearchTrip {
  origin: string;
  destination: string;
  departure: string;
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
  priceDetails?: PriceDetails | null
}