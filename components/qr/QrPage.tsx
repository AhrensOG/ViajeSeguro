"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReservationById } from "@/lib/api/reservation";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { LoaderCircle, AlertTriangle, ShieldCheck, ScanLine } from "lucide-react";
import TripInfo from "./auxiliarComponents.tsx/TripInfo";
import UserInfo from "./auxiliarComponents.tsx/UserInfo";
import StatusInfo from "./auxiliarComponents.tsx/StatusInfo";
import QrStatusInfo from "./auxiliarComponents.tsx/QrStatusInfo";
import PriceInfo from "./auxiliarComponents.tsx/PriceInfo";
import PaymentInfo from "./auxiliarComponents.tsx/PaymentInfo";
import { fetchVehicleBookingWhitDetails } from "@/lib/api/vehicle-booking";
import OfferInfo from "./auxiliarComponents.tsx/OfferInfo";
import BookingStatusInfo from "./auxiliarComponents.tsx/BookingStatusInfo";
import BookingPriceInfo from "./auxiliarComponents.tsx/BookingPriceInfo";
import BookingPaymentInfo from "./auxiliarComponents.tsx/BookingPaymentInfo";
import { ResponseForQrPage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import BookingQrStatusInfo from "./auxiliarComponents.tsx/BookingQrStatusInfo";

const QrPage = () => {
    const { refId, type } = useParams();
    const [reservation, setReservation] = useState<ReservationResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [booking, setBooking] = useState<ResponseForQrPage | null>(null);

    useEffect(() => {
        const fetchReservation = async (): Promise<void> => {
            try {
                const data = await getReservationById(refId as string);
                setReservation(data);
            } catch (err) {
                console.log(err);
                setError("No se pudo cargar la información de la reserva.");
            } finally {
                setLoading(false);
            }
        };

        const getVehicleBooking = async (): Promise<void> => {
            try {
                const data = await fetchVehicleBookingWhitDetails(refId as string);
                setBooking(data);
            } catch (err) {
                console.log(err);
                setError("No se pudo cargar la información de la reserva.");
            } finally {
                setLoading(false);
            }
        };

        if (refId && type === "reservation") fetchReservation();
        if (refId && type === "vehicle") getVehicleBooking();
    }, [refId, type]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white gap-4">
                <LoaderCircle className="animate-spin w-10 h-10 text-amber-500" />
                <p className="text-sm text-gray-500">Cargando información de la reserva...</p>
            </div>
        );
    }

    if (error || (!reservation && !booking)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white gap-4 px-6">
                <div className="bg-red-50 p-4 rounded-full">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-red-600 font-medium text-center">{error ?? "Reserva no encontrada."}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 px-4">
            <main className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <ScanLine className="size-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-white">Verificación de Reserva</h1>
                    </div>
                    <p className="text-amber-100 text-xs">Revisa los datos antes de confirmar el abordaje</p>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {booking && (
                        <>
                            <OfferInfo booking={booking} />
                            <UserInfo reservation={{ user: { ...booking?.renter } }} />
                            <BookingStatusInfo booking={booking} />
                            <BookingQrStatusInfo booking={booking} />
                            <BookingPriceInfo booking={booking} />
                            <BookingPaymentInfo booking={booking} setBooking={setBooking} />
                        </>
                    )}

                    {reservation && (
                        <>
                            <TripInfo reservation={reservation} />
                            <UserInfo reservation={reservation} />
                            <StatusInfo reservation={reservation} />
                            <QrStatusInfo reservation={reservation} />
                            <PriceInfo reservation={reservation} />
                            <PaymentInfo reservation={reservation} setReservation={setReservation} />
                        </>
                    )}

                    <div className="flex items-center justify-center gap-2 pt-2 pb-1 text-xs text-gray-400 border-t border-gray-100">
                        <ShieldCheck className="size-3.5" />
                        <span>Datos verificados por ViajeSeguro</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QrPage;
