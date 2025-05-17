import { fetchWithOptionalAuth } from "@/lib/functions";
import { PaymentCardData, PaymentResponse, SubscriptionPaymentResponse } from "./payments.type";
import { BACKEND_URL } from "@/lib/constants";

export const getAllPaymentsByUser = async (): Promise<PaymentCardData[]> => {
    const payments: PaymentResponse[] = (await fetchWithOptionalAuth(`${BACKEND_URL}/payment/by_user`)) || [];
    const subscriptionPayments: SubscriptionPaymentResponse[] = (await fetchWithOptionalAuth(`${BACKEND_URL}/payment-subscription/by_user`)) || [];

    const mappedPayments: PaymentCardData[] = payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt,
        method: payment.method,
    }));

    const mappedSubscriptions: PaymentCardData[] = subscriptionPayments.map((sub) => ({
        id: sub.id,
        amount: sub.amount,
        status: sub.status,
        createdAt: sub.createdAt,
        paymentMethod: sub.paymentMethod,
        subscriptionName: "Pago de suscripción", // 👈 nombre claro para diferenciar
    }));

    return [...mappedPayments, ...mappedSubscriptions];
};
