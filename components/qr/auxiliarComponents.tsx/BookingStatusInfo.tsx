"use client";

import { ResponseForQrPage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { CheckCircle2, AlertTriangle, Timer, Check } from "lucide-react";

type Props = {
    booking: ResponseForQrPage;
};

const statusConfig: Record<string, { label: string; ok: boolean; color: string }> = {
    PENDING: { label: "Pendiente de pago", ok: false, color: "amber" },
    APPROVED: { label: "Aprobada", ok: true, color: "blue" },
    COMPLETED: { label: "Completada", ok: true, color: "emerald" },
    FINISHED: { label: "Finalizada", ok: true, color: "gray" },
    DECLINED: { label: "Rechazada", ok: false, color: "red" },
    CANCELLED: { label: "Cancelada", ok: false, color: "red" },
};

const BookingStatusInfo = ({ booking }: Props) => {
    const { status } = booking;
    const cfg = statusConfig[status] ?? { label: "Desconocido", ok: false, color: "gray" };
    const isOk = cfg.ok;

    return (
        <section className="rounded-xl border border-gray-200 overflow-hidden">
            <div className={`px-4 py-3 border-b border-gray-200 ${
                isOk ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50" : "bg-gradient-to-r from-red-50 to-red-100/50"
            }`}>
                <div className="flex items-center gap-2">
                    {isOk ? (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                        <AlertTriangle className="size-4 text-red-600" />
                    )}
                    <span className={`font-semibold text-sm ${isOk ? "text-emerald-700" : "text-red-700"}`}>
                        Estado de la reserva
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Reserva</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cfg.color === "emerald" ? "bg-emerald-100 text-emerald-700" :
                        cfg.color === "amber" ? "bg-amber-100 text-amber-700" :
                        cfg.color === "blue" ? "bg-blue-100 text-blue-700" :
                        cfg.color === "red" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                    }`}>
                        {cfg.label}
                    </span>
                </div>

                {status === "COMPLETED" && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                        <Timer className="size-4 shrink-0" />
                        <span className="font-medium">¡Reserva lista para comenzar!</span>
                    </div>
                )}

                {status === "FINISHED" && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-700">
                        <Check className="size-4 shrink-0" />
                        <span>El viaje ha finalizado correctamente.</span>
                    </div>
                )}

                {!isOk && status !== "FINISHED" && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg text-xs text-red-700">
                        <AlertTriangle className="size-4 shrink-0" />
                        <span>Revisar antes de entregar el vehículo.</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BookingStatusInfo;
