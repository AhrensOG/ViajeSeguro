export interface CreateSubscriptionRequest {
    userId: string;
    plan: string;
    startDate: Date;
    endDate: Date;
}
export interface PricingCardProps {
    plan: {
        title: string;
        price?: number;
        subtitle?: string;
        recommended?: string;
        premium?: boolean;
        benefits: string[];
        buttonText: string;
        type: string;
    };
    index: number;
    isInView: boolean;
    action: (data: CreateSubscriptionRequest, amount: number) => Promise<void>;
}

export interface CreateSubscriptionPayload {
    amount: number;
    paymentMethod: string;
    subscriptionId: string;
}
