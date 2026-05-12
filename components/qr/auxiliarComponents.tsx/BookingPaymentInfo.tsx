"use client";

import { useState } from "react";
import { markQrAsUsed } from "@/lib/api/qr";
import { toast } from "sonner";
import { fetchVehicleBookingWhitDetails, markBookingAsPaid } from "@/lib/api/vehicle-booking";
import { ResponseForQrPage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { KeyRound, CheckCircle2, ShieldCheck } from "lucide-react";

type Props = {
    booking: ResponseForQrPage;
    setBooking: React.Dispatch<React.SetStateAction<ResponseForQrPage | null>>;
};

const BookingPaymentInfo = ({ booking, setBooking }: Props) => {
    const [paid, setPaid] = useState(false);
    const [loading, setLoading] = useState(false);

    const isCash = booking.paymentMethod === "CASH";
    const qrValid = booking.qrCode[0]?.isValid;
    const qrUsed = booking.qrCode[0]?.usedAt;

    const handleConfirmDelivery = async () => {
        try {
            setLoading(true);

            if (!booking.qrCode[0]?.id) {
                toast.info("No se pudo actualizar el estado del QR.", {
                    description: "El ID del QR es requerido. Intenta nuevamente o contacta con soporte.",
                });
                return;
            }

            if (isCash && !paid) {
                toast.info("Debes marcar que el cliente abonó antes de entregar el vehículo.");
                return;
            }

            if (isCash && paid) {
                await markBookingAsPaid(booking.id);
            }

            await markQrAsUsed(booking.qrCode[0].id);
            const updated = await fetchVehicleBookingWhitDetails(booking.id);
            setBooking(updated as ResponseForQrPage);
            toast.success("QR marcado como usado. Vehículo entregado.");
        } catch (err) {
            console.error(err);
            toast.error("No se pudo actualizar el estado del QR.");
        } finally {
            setLoading(false);
        }
    };

    if (qrUsed) {
        return (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                    <CheckCircle2 className="size-6 text-emerald-600" />
                </div>
                <div>
                    <p className="font-semibold text-emerald-800">Vehículo entregado</p>
                    <p className="text-xs text-emerald-600">El QR ya fue escaneado y el vehículo fue entregado.</p>
                </div>
            </section>
        );
    }

    if (!qrValid) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                    <ShieldCheck className="size-6 text-red-600" />
                </div>
                <div>
                    <p className="font-semibold text-red-800">QR no válido</p>
                    <p className="text-xs text-red-600">No se puede confirmar la entrega con este código.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 space-y-4">
                {isCash && (
                    <label className="flex items-center gap-3 px-3 py-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={paid}
                            onChange={() => setPaid(!paid)}
                            className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-amber-800">El cliente abonó en efectivo</span>
                            <p className="text-xs text-amber-600">Marca solo si recibiste el pago</p>
                        </div>
                    </label>
                )}

                <button
                    disabled={loading || (isCash && !paid)}
                    onClick={handleConfirmDelivery}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm ${
                        !isCash || paid
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md active:scale-[0.98]"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {loading ? (
                        <>Confirmando...</>
                    ) : (
                        <>
                            <KeyRound className="size-5" />
                            Confirmar entrega del vehículo
                        </>
                    )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                    Al confirmar, el QR quedará marcado como usado y el vehículo se marcará como entregado.
                </p>
            </div>
        </section>
    );
};

export default BookingPaymentInfo;
