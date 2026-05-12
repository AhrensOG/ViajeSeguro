"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { CheckCircle2, AlertTriangle } from "lucide-react";

type Props = {
    reservation: ReservationResponse;
};

const StatusInfo = ({ reservation }: Props) => {
    const { status, trip } = reservation;

    const reservationOk = status === "CONFIRMED";
    const tripOk = trip.status === "CONFIRMED";
    const allOk = reservationOk && tripOk;

    return (
        <section className="rounded-xl border border-gray-200 overflow-hidden">
            <div className={`px-4 py-3 border-b border-gray-200 ${
                allOk ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50" : "bg-gradient-to-r from-red-50 to-red-100/50"
            }`}>
                <div className="flex items-center gap-2">
                    {allOk ? (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                        <AlertTriangle className="size-4 text-red-600" />
                    )}
                    <span className={`font-semibold text-sm ${allOk ? "text-emerald-700" : "text-red-700"}`}>
                        {allOk ? "Todo en orden" : "Revisar estado"}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estado de reserva</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        reservationOk
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "PENDING"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                    }`}>
                        {reservationOk ? "Confirmada" : status === "PENDING" ? "Pendiente" : "Cancelada"}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estado del viaje</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tripOk
                            ? "bg-emerald-100 text-emerald-700"
                            : trip.status === "PENDING"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                    }`}>
                        {tripOk ? "Confirmado" : trip.status === "PENDING" ? "Pendiente" : "Cancelado"}
                    </span>
                </div>

                {!allOk && (
                    <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-50 rounded-lg text-xs text-red-700">
                        <AlertTriangle className="size-4 shrink-0" />
                        <span>Verifica bien antes de dejar subir al pasajero.</span>
                    </div>
                )}

                {allOk && (
                    <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-emerald-50 rounded-lg text-xs text-emerald-700">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>Reserva y viaje confirmados. Pasajero listo para abordar.</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default StatusInfo;
