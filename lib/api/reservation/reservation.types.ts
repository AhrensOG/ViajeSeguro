import { TripServiceType } from "@/lib/shared/types/trip-service-type.type";

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED';

export type ReservationPaymentMethods = "STRIPE" | "CASH";

export type CreateReservationPayload = {
  tripId: string;
  userId: string;
  price: number;
  seatCode?: string;
  discountId?: string;
  status: ReservationStatus;
  paymentMethod: ReservationPaymentMethods;
};

export type ReservationConfirmationResponse = {
  success: true;
  message: string;
};

export type TripSummary = {
  id: string;
  origin: string;
  destination: string;
  originLocation: string;
  destinationLocation: string;
  departure: string;
  arrival: string;
  originalTimeZone: string;
  serviceType: TripServiceType;
  capacity: number;
  minPassengers: number;
  status: ReservationStatus;
  basePrice: number;
  tripStatus: ReservationStatus;
};

export type PriceDetails = {
  basePrice: number;
  discounts: { key: string, description: string; amount: number }[];
  finalPrice: number;
}

export type ReservationResponse = {
  id: string;
  userId: string;
  tripId: string;
  seatCode?: string | null;
  qrCode?: string | null;
  discountId?: string | null;
  notes?: string | null;
  price: number;
  paymentMethod: ReservationPaymentMethods;
  status: ReservationStatus;
  createdAt: string;
  trip: TripSummary;
  priceDetails: PriceDetails;
};
