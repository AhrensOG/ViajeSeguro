"use client";

import { useState } from "react";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { toast } from "sonner";
import { markQrAsUsed } from "@/lib/api/qr";
import { getReservationById, markReservationAsPaid } from "@/lib/api/reservation";

type Props = {
    reservation: ReservationResponse;
    setReservation: React.Dispatch<React.SetStateAction<ReservationResponse | null>>;
};

const PaymentInfo = ({ reservation, setReservation }: Props) => {
    const [paid, setPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const isCash = reservation.paymentMethod === "CASH";
    const qrValid = reservation.qr?.isValid;
    const qrUsed = reservation.qr?.usedAt;

    const handleConfirmBoarding = async () => {
        try {
            setLoading(true);

            if (!reservation.qr?.id) {
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
            await markQrAsUsed(reservation.qr.id);
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

    return (
        <section className="text-sm bg-custom-gray-100 p-4 rounded-lg flex flex-col gap-3">
            {/* Método de pago */}
            <div className="flex justify-between items-center">
                <span className="text-custom-gray-600">Método de pago:</span>
                <span className="font-medium text-custom-black-900">{isCash ? "Efectivo" : "Stripe"}</span>
            </div>

            {/* Checkbox solo para efectivo */}
            {isCash && qrValid && !qrUsed && (
                <label className="flex items-center gap-2 text-custom-gray-700 mt-2">
                    <input type="checkbox" checked={paid} onChange={() => setPaid(!paid)} className="w-4 h-4" />
                    El pasajero abonó antes de subir
                </label>
            )}

            {/* Botón de confirmación */}
            {qrValid && !qrUsed && (
                <button
                    disabled={loading || (isCash && !paid)}
                    onClick={handleConfirmBoarding}
                    className={`w-full text-sm font-semibold py-2 px-4 rounded-lg transition ${
                        !isCash || paid ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                    {loading ? "Confirmando..." : "Confirmar abordaje"}
                </button>
            )}
        </section>
    );
};

export default PaymentInfo;
