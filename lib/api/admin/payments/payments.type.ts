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
        name?: string;
        lastName?: string;
        email?: string;
    };
}
