"use client";

import React, { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cancelTripPartner } from "@/lib/api/admin/trips";

interface Props {
    tripId: string;
    origin: string;
    destination: string;
    reservationsCount?: number;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CancelTripModalPartner({
    tripId,
    origin,
    destination,
    reservationsCount = 0,
    onClose,
    onSuccess,
}: Props) {
    const [submitting, setSubmitting] = useState(false);

    const handleCancelTrip = async () => {
        const toastId = toast.loading("Cancelando viaje...");
        setSubmitting(true);

        try {
            await cancelTripPartner(tripId);
            toast.success("Viaje cancelado exitosamente", { id: toastId });
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Error al cancelar el viaje";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative border border-custom-gray-300 transform transition-all"
            >
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                    aria-label="Cerrar"
                >
                    <X className="size-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6 mt-2">
                        <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
                    </div>

                    <h2 className="text-xl font-bold mb-2 text-custom-black-800">¿Estás seguro de cancelar este viaje?</h2>

                    <p className="text-sm text-custom-gray-600 mb-6">
                        Vas a cancelar el viaje de <strong>{origin}</strong> a <strong>{destination}</strong>.
                        Esta acción no se puede deshacer.
                    </p>

                    <div className="w-full bg-red-50 border border-red-100 rounded-lg p-4 mb-8 text-sm text-red-800 text-left">
                        <p className="font-semibold mb-1">Impacto de la cancelación:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            {reservationsCount > 0 ? (
                                <li>
                                    Se notificará a los <strong>{reservationsCount} pasajeros</strong> con reservas activas.
                                </li>
                            ) : (
                                <li>No hay reservas activas en este viaje actualmente.</li>
                            )}
                            {reservationsCount > 0 && <li>Su dinero será reembolsado automáticamente.</li>}
                            <li>El viaje ya no será visible en los resultados de búsqueda.</li>
                        </ul>
                    </div>

                    <div className="w-full flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2.5 px-5 rounded-md w-full sm:w-auto transition-colors"
                            disabled={submitting}
                        >
                            Mantener el viaje
                        </button>
                        <button
                            onClick={handleCancelTrip}
                            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-5 rounded-md disabled:opacity-50 w-full sm:w-auto transition-colors shadow-sm"
                            disabled={submitting}
                        >
                            {submitting ? "Cancelando..." : "Sí, cancelar viaje"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
