export interface CreateReservationPayload {
  userId: string;
  tripId: string;
  seatCode?: string;
  discountId?: string;
  price: number;
}

export interface PreviewReservationPayload {
  userId: string;
  tripId: string;
  discountId?: string;
}

export interface ReservationPreview {
  basePrice: number;
  finalPrice: number;
  discounts?: { description: string; amount: number }[];
}
