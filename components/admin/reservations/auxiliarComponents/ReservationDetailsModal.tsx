import React, { useEffect } from "react";
import { X } from "lucide-react";
import { ReservationResponse } from "@/lib/api/admin/reservation/reservation.types";

interface Props {
    reservation: ReservationResponse;
    onClose: () => void;
}

const ReservationDetailModal = ({ reservation, onClose }: Props) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose(); // función que cierra el modal
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    // Calcular cantidad de maletas adicionales desde seatCode (formato: EXTRA_BAGS:N)
    const extraBagsMatch = reservation.seatCode?.match(/EXTRA_BAGS:(\d+)/);
    const extraBags = extraBagsMatch ? Number(extraBagsMatch[1]) : 0;

    return (
        <div onClick={onClose} className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Detalle de Reserva</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-custom-black-800">
                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Nombre completo</label>
                        <p>
                            {reservation.user?.name ?? "-"} {reservation.user?.lastName ?? ""}
                        </p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Correo electrónico</label>
                        <p>{reservation.user?.email ?? "-"}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Precio</label>
                        <p>€{reservation.price.toFixed(2)}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Método de pago</label>
                        <p>{reservation.paymentMethod}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Equipaje adicional</label>
                        <p>{Number.isFinite(extraBags) ? `${extraBags} maleta(s)` : "0 maleta(s)"}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Estado</label>
                        <p>{reservation.status}</p>
                    </div>

                    {reservation.status === "CANCELLED" && (
                        <div className="md:col-span-2 p-3 rounded-md border bg-yellow-50 border-yellow-200">
                            <label className="block text-xs font-semibold text-yellow-700 mb-1">Motivo de cancelación</label>
                            <p className="whitespace-pre-wrap break-words text-yellow-900/80">
                                {reservation.cancelReason?.trim() || "Sin motivo proporcionado"}
                            </p>
                        </div>
                    )}

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Fecha de creación</label>
                        <p>{new Date(reservation.createdAt).toLocaleString("es-ES")}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200 col-span-1 md:col-span-2">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Notas</label>
                        <p>{reservation.notes || "Sin notas registradas"}</p>
                    </div>

                    {reservation.trip && (
                        <>
                            <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                                <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Lugar de salida</label>
                                <p>{reservation.trip.originLocation || reservation.trip.origin || "-"}</p>
                            </div>

                            <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                                <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Lugar de destino</label>
                                <p>{reservation.trip.destinationLocation || reservation.trip.destination || "-"}</p>
                            </div>

                            <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200 col-span-1 md:col-span-2">
                                <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Fecha del viaje</label>
                                <p>{reservation.trip.departure ? new Date(reservation.trip.departure).toLocaleString("es-ES") : "-"}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailModal;
