import React from "react";
import { X } from "lucide-react";
import { ReservationResponse } from "@/lib/api/admin/reservation/reservation.types";

interface Props {
    reservation: ReservationResponse;
    onClose: () => void;
}

const ReservationDetailModal = ({ reservation, onClose }: Props) => {
    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative border border-custom-gray-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black" aria-label="Cerrar">
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
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Estado</label>
                        <p>{reservation.status}</p>
                    </div>

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
