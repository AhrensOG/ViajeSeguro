"use client";

import { useState } from "react";
import { markQrAsUsed } from "@/lib/api/qr";
import { toast } from "sonner";
import { fetchVehicleBookingWhitDetails, markBookingAsPaid } from "@/lib/api/vehicle-booking";
import { ResponseForQrPage } from "@/lib/api/vehicle-booking/vehicleBooking.types";

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

    return (
        <section className="text-sm bg-custom-gray-100 p-4 rounded-lg flex flex-col gap-3">
            {/* Método de pago */}
            <div className="flex justify-between items-center">
                <span className="text-custom-gray-600">Método de pago:</span>
                <span className="font-medium text-custom-black-900">{isCash ? "Efectivo" : "Stripe"}</span>
            </div>

            {/* Checkbox solo si es efectivo y aún no fue usado */}
            {isCash && qrValid && !qrUsed && (
                <label className="flex items-center gap-2 text-custom-gray-700 mt-2">
                    <input type="checkbox" checked={paid} onChange={() => setPaid(!paid)} className="w-4 h-4" />
                    El cliente abonó antes de retirar el vehículo
                </label>
            )}

            {/* Botón de confirmación */}
            {qrValid && !qrUsed && (
                <button
                    disabled={loading || (isCash && !paid)}
                    onClick={handleConfirmDelivery}
                    className={`w-full text-sm font-semibold py-2 px-4 rounded-lg transition ${
                        !isCash || paid ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                    {loading ? "Confirmando..." : "Confirmar entrega del vehículo"}
                </button>
            )}
        </section>
    );
};

export default BookingPaymentInfo;
