"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReservationById } from "@/lib/api/reservation";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { LoaderCircle, AlertTriangle } from "lucide-react";
import TripInfo from "./auxiliarComponents.tsx/TripInfo";
import UserInfo from "./auxiliarComponents.tsx/UserInfo";
import StatusInfo from "./auxiliarComponents.tsx/StatusInfo";
import QrStatusInfo from "./auxiliarComponents.tsx/QrStatusInfo";
import PriceInfo from "./auxiliarComponents.tsx/PriceInfo";
import PaymentInfo from "./auxiliarComponents.tsx/PaymentInfo";

const QrPage = () => {
    const { reservationId } = useParams();
    const [reservation, setReservation] = useState<ReservationResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservation = async (): Promise<void> => {
            try {
                const data = await getReservationById(reservationId as string);
                console.log(data);
                setReservation(data);
            } catch (err) {
                console.log(err);
                setError("No se pudo cargar la información de la reserva.");
            } finally {
                setLoading(false);
            }
        };

        if (reservationId) fetchReservation();
    }, [reservationId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoaderCircle className="animate-spin w-8 h-8 text-custom-golden-700" />
            </div>
        );
    }

    if (error || !reservation) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center text-red-500">
                <AlertTriangle className="w-8 h-8 mb-2" />
                <p>{error ?? "Reserva no encontrada."}</p>
            </div>
        );
    }

    return (
        <main className="max-w-md sm:mx-auto p-6 bg-white rounded-xl shadow-lg my-8 mx-2 border border-gray-200 flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-custom-black-900 text-center">Verificación de Reserva</h1>

            <TripInfo reservation={reservation} />
            <UserInfo reservation={reservation} />
            <StatusInfo reservation={reservation} />
            <QrStatusInfo reservation={reservation} />
            <PriceInfo reservation={reservation} />
            <PaymentInfo reservation={reservation} setReservation={setReservation} />
        </main>
    );
};

export default QrPage;
