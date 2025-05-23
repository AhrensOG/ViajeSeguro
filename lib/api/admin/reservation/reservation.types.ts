export interface SimpleReservation {
    id: string;
    guestName: string;
    email: string;
    price: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    paymentMethod: string;
    createdAt: string;
}

export interface ReservationResponse {
    id: string;
    price: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    paymentMethod: string;
    createdAt: string;
    seatCode?: string;
    discountId?: string;
    userId?: string;
    tripId?: string;
    user?: {
        id: string;
        name?: string;
        lastName?: string;
        email?: string;
    };
    notes?: string | null;
    trip?: {
        id: string;
        origin?: string;
        destination?: string;
        departure?: string;
        arrival?: string;
        originLocation?: string;
        destinationLocation?: string;
    };
}

export interface UserOption {
    id: string;
    email: string;
}

export interface CreateReservationFormData {
    tripId: string;
    price: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    paymentMethod: "STRIPE" | "CASH" | "OTHER";
    seatCode?: string;
    discountId?: string;
    id?: string;
    userId?: string;
}

export interface TripOption {
    id: string;
    label: string;
    date: string;
}
