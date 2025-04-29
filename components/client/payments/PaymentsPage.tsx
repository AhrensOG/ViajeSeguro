import { PaymentCardData } from "@/lib/api/payments/payments.type";
import ReservationCardFallback from "@/lib/client/components/reservations/ReservationCardFallback";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PaymentCard from "./auxiliarComponents/PaymentCard";
import { getAllPaymentsByUser } from "@/lib/api/payments/intex";

export default function PaymentsPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState<PaymentCardData[]>([]);

    useEffect(() => {
        const fetchPayments = async () => {
            const res = await getAllPaymentsByUser();
            console.log(res);

            setPayments(res);
        };
        if (!session?.user?.id) fetchPayments();
        return;
    }, [session?.user?.id]);

    const paymentsMock: PaymentCardData[] = [
        {
            id: "pay_1234567890",
            amount: 59.99,
            status: "PAID",
            createdAt: "2025-04-27T10:30:00Z",
            method: "Tarjeta de Crédito",
            subscriptionName: "Suscripción Premium",
        },
        {
            id: "pay_9876543210",
            amount: 29.99,
            status: "PENDING",
            createdAt: "2025-04-28T15:45:00Z",
            method: "PayPal",
            subscriptionName: "Suscripción Básica",
        },
        {
            id: "pay_2468101214",
            amount: 19.99,
            status: "FAILED",
            createdAt: "2025-04-26T08:15:00Z",
            method: "Transferencia Bancaria",
            subscriptionName: "Suscripción Starter",
        },
    ];

    return (
        <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
            <div className="w-full flex flex-col justify-start items-start">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Mis reservas</h1>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center w-full gap-4">
                    <div className="w-full h-[72px] bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md text-sm mb-4 space-y-2">
                        <div className="h-2 w-[90%] bg-custom-gray-300 rounded" />
                        <div className="h-2 w-[80%] bg-custom-gray-300 rounded" />
                    </div>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ReservationCardFallback key={i} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center w-full gap-4">
                    <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md text-sm mb-4">
                        <p>
                            Recuerda que es obligatorio presentar un documento que acredite tu identidad al momento del viaje. En caso de no hacerlo,
                            tu reserva podría ser cancelada. Esta medida busca garantizar la seguridad de todos los pasajeros.
                        </p>
                    </div>
                    {payments.map((payment, i) => (
                        <PaymentCard key={i} payment={payment} />
                    ))}
                </div>
            )}
        </div>
    );
}
