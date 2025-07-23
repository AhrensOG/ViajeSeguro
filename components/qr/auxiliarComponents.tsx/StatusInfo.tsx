"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type Props = {
    reservation: ReservationResponse;
};

const StatusInfo = ({ reservation }: Props) => {
    const { status, trip } = reservation;

    return (
        <section className="bg-custom-gray-100 p-4 rounded-lg text-sm">
            <div className="flex flex-col gap-2">
                <div>
                    <p className="text-custom-black-800 font-medium mb-1">Estado de la reserva:</p>
                    {status === "CONFIRMED" ? (
                        <span className="text-green-700 font-semibold">Confirmada</span>
                    ) : status === "PENDING" ? (
                        <span className="text-yellow-600 font-medium">Pendiente de pago</span>
                    ) : (
                        <span className="text-red-600 font-medium">Cancelada</span>
                    )}
                </div>

                <div>
                    <p className="text-custom-black-800 font-medium mb-1">Estado del viaje:</p>
                    {trip.status === "CONFIRMED" ? (
                        <span className="text-green-700 font-semibold">Confirmado</span>
                    ) : trip.status === "PENDING" ? (
                        <span className="text-yellow-600 font-medium">Pendiente - se confirmará cuando se alcancen los pasajeros mínimos</span>
                    ) : (
                        <span className="text-red-600 font-medium">Cancelado por el organizador</span>
                    )}
                </div>

                {status === "CONFIRMED" && trip.status === "CONFIRMED" && (
                    <div className="flex items-center gap-2 mt-2 text-green-700 font-medium">
                        <CheckCircle2 className="size-5" />
                        <span>¡Reserva y viaje confirmados!</span>
                    </div>
                )}

                {(status !== "CONFIRMED" || trip.status !== "CONFIRMED") && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 font-medium">
                        <AlertTriangle className="size-5" />
                        <span>Verifica bien antes de dejar subir al pasajero.</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default StatusInfo;
