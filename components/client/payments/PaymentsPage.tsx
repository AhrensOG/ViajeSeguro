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
            setLoading(true);
            const res = await getAllPaymentsByUser();
            setPayments(res);
            setLoading(false);
        };
        if (!session?.user?.id) fetchPayments();
    }, [session?.user?.id]);

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
