"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/functions";

type Props = {
    reservation: ReservationResponse | { qr: [{ id: string; isValid: boolean; usedAt: Date }] };
};

const QrStatusInfo = ({ reservation }: Props) => {
    const qr = reservation.qr[0];
    const isValid = qr?.isValid && !qr.usedAt;

    return (
        <section className={`rounded-xl border overflow-hidden ${
            isValid ? "border-emerald-200" : "border-red-200"
        }`}>
            <div className={`px-4 py-3 border-b ${isValid ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center gap-2">
                    {isValid ? (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                        <AlertTriangle className="size-4 text-red-600" />
                    )}
                    <span className={`font-semibold text-sm ${isValid ? "text-emerald-700" : "text-red-700"}`}>
                        Código QR
                    </span>
                </div>
            </div>

            <div className="p-4 text-sm">
                {isValid ? (
                    <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 className="size-5" />
                        <span className="font-medium">Válido — aún no fue escaneado</span>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-red-700 font-medium">
                            <AlertTriangle className="size-5" />
                            <span>No activo</span>
                        </div>
                        {qr?.usedAt ? (
                            <p className="text-xs text-red-500">Ya fue escaneado el {formatDateTime(qr.usedAt)}</p>
                        ) : (
                            <p className="text-xs text-red-500">El código QR no está activo.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default QrStatusInfo;
