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
    user?: {
        name?: string;
        lastName?: string;
        email?: string;
    };
}
