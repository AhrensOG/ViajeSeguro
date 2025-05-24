export interface SimplePayment {
    id: string;
    guestName: string;
    email: string;
    amount: number;
    method: string;
    status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    createdAt: string;
}

export interface PaymentResponse {
    id: string;
    amount: number;
    method: string;
    status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    createdAt: string;
    user?: {
        id: string;
        name?: string;
        lastName?: string;
        email?: string;
    };
    reservation?: {
        id: string;
        price: number;
        createdAt: string;
        status: "PENDING" | "CONFIRMED" | "CANCELLED";
    };
}

export interface UsersWithReservations {
    id: string;
    email: string;
    reservations: {
        id: string;
        price: number;
        createdAt: string;
    }[];
}

export interface CreatePaymentFormData {
    id?: string;
    userId: string;
    amount: number;
    method: "STRIPE" | "CASH" | "OTHER";
    status: "PENDING" | "COMPLETED" | "FAILED";
    reservationId: string;
}

export interface CreatePaymentRequest {
    userId: string;
    amount: number;
    method: "STRIPE" | "CASH" | "OTHER";
    status: "PENDING" | "COMPLETED" | "FAILED";
    reservationId: string;
    paymentId?: string;
}
