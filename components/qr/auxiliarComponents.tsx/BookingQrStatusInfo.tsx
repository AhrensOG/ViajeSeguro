"use client";

import { AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/functions";

type Props = {
    booking: { qrCode: { id: string; isValid: boolean; usedAt: Date | null }[] };
};

const BookingQrStatusInfo = ({ booking }: Props) => {
    const qr = booking.qrCode[0];

    return (
        <section className="bg-custom-gray-100 p-4 rounded-lg text-sm">
            <p className="font-medium text-custom-black-900 mb-1">Estado del código QR:</p>

            {qr?.isValid && !qr.usedAt ? (
                <p className="flex items-center gap-2 text-custom-gray-700">
                    Este código es válido.
                    <span className="text-green-600 font-medium">Aún no fue escaneado.</span>
                </p>
            ) : (
                <div className="flex flex-col gap-2 text-red-600 font-medium mt-1">
                    <span className="flex gap-2">
                        <AlertTriangle className="size-4" />
                        Estado del código QR:
                    </span>
                    {qr?.usedAt ? (
                        <span className="text-red-500 font-medium">Ya fue escaneado el {formatDateTime(qr.usedAt)}</span>
                    ) : (
                        <span className="text-red-500 font-medium">El código QR no está activo.</span>
                    )}
                </div>
            )}
        </section>
    );
};

export default BookingQrStatusInfo;
