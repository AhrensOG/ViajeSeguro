"use client";

import { useState } from "react";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { toast } from "sonner";
import { markQrAsUsed } from "@/lib/api/qr";
import { getReservationById, markReservationAsPaid } from "@/lib/api/reservation";
import { LogIn, CheckCircle2, ShieldCheck } from "lucide-react";

type Props = {
    reservation: ReservationResponse;
    setReservation: React.Dispatch<React.SetStateAction<ReservationResponse | null>>;
};

const PaymentInfo = ({ reservation, setReservation }: Props) => {
    const [paid, setPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const isCash = reservation.paymentMethod === "CASH";
    const qrValid = reservation.qr[0]?.isValid;
    const qrUsed = reservation.qr[0]?.usedAt;

    const handleConfirmBoarding = async () => {
        try {
            setLoading(true);

            if (!reservation.qr[0]?.id) {
                toast.info("No se pudo actualizar el estado del QR.", {
                    description: "El ID del QR es requerido. Intenta nuevamente o contacta con el soporte.",
                });
                return;
            }

            if (isCash && !paid) {
                toast.info("Debes marcar que el pasajero abonó antes de subir.");
                return;
            }
            if (isCash && paid) {
                await markReservationAsPaid(reservation.id);
            }
            await markQrAsUsed(reservation.qr[0].id);
            const updatedReservation = await getReservationById(reservation.id);
            setReservation(updatedReservation);

            toast.success("QR marcado como usado. Abordaje confirmado.");
        } catch (err) {
            console.log(err);
            toast.info("No se pudo actualizar el estado del QR.", {
                description: "Intenta nuevamente o contacta con el soporte.",
            });
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
                    <p className="font-semibold text-emerald-800">Abordaje confirmado</p>
                    <p className="text-xs text-emerald-600">El QR ya fue escaneado y el pasajero abordó.</p>
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
                    <p className="text-xs text-red-600">No se puede confirmar el abordaje con este código.</p>
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
                            <span className="text-sm font-medium text-amber-800">El pasajero abonó en efectivo</span>
                            <p className="text-xs text-amber-600">Marca solo si recibiste el pago</p>
                        </div>
                    </label>
                )}

                <button
                    disabled={loading || (isCash && !paid)}
                    onClick={handleConfirmBoarding}
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
                            <LogIn className="size-5" />
                            Confirmar abordaje
                        </>
                    )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                    Al confirmar, el QR quedará marcado como usado y el pasajero podrá abordar.
                </p>
            </div>
        </section>
    );
};

export default PaymentInfo;
