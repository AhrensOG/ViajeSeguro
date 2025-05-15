export type PaymentCardData = {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    method?: string;
    paymentMethod?: string;
    subscriptionName?: string; // opcional para identificar los subscription payments
};
