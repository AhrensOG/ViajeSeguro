export type ReservationStatus =
  | 'PENDING'
  | 'APPROVED'
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