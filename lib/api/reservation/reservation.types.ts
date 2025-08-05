export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type ReservationPaymentMethods = "STRIPE" | "CASH";

export type CreateReservationPayload = {
    tripId: string;
    price: number;
    seatCode?: string;
    discountId?: string;
    status: ReservationStatus;
    paymentMethod: ReservationPaymentMethods;
    referralId?: string;
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
    minPassengers: number;
    status: ReservationStatus;
    tripStatus: ReservationStatus;
};

export type PriceDetails = {
    basePrice: number;
    discounts: { key: string; description: string; amount: number }[];
    finalPrice: number;
};

export type Qr = {
    id: string;
    reservationId: string;
    imageUrl: string;
    usedAt: Date | null;
    isValid: boolean;
    createdAt: Date;
};

export type User = {
    id: string;
    email: string;
    emailVerified: boolean;
    googleId: null;
    name: string;
    lastName: string;
    avatarUrl: string;
};

export type ReservationResponse = {
    id: string;
    userId: string;
    tripId: string;
    seatCode?: string | null;
    price: number;
    paymentMethod: ReservationPaymentMethods;
    status: ReservationStatus;
    trip: TripSummary;
    priceDetails: PriceDetails;
    qr: Qr[] | [];
    user: User;
};
