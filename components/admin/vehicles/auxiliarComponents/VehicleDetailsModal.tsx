"use client";

import { X } from "lucide-react";
import { format } from "date-fns";
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";
import { useEffect } from "react";

interface Props {
    vehicle: Vehicle;
    onClose: () => void;
}

const VehicleDetailsModal = ({ vehicle, onClose }: Props) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);
    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative border border-custom-gray-300 overflow-y-auto max-h-[90vh]"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Detalles del vehículo</h2>

                <div className="space-y-3 text-sm text-custom-black-800">
                    <p>
                        <strong>Placa:</strong> {vehicle.plate}
                    </p>
                    <p>
                        <strong>Capacidad:</strong> {vehicle.capacity}
                    </p>
                    <p>
                        <strong>Tipo de servicio:</strong> {String(vehicle.serviceType)}
                    </p>
                    <p>
                        <strong>Proveedor:</strong> {String(vehicle.provider)}
                    </p>
                    <p>
                        <strong>Selección de asientos:</strong> {vehicle.allowSeatSelection ? "Sí" : "No"}
                    </p>
                    <p>
                        <strong>Propietario:</strong> {vehicle.owner?.name} {vehicle.owner?.lastName} - {vehicle.owner?.email}
                    </p>
                </div>

                {/* Secciones opcionales */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Asientos asignados</h3>
                    <ul className="list-disc pl-6 text-sm text-custom-black-700">
                        {vehicle.seats?.length > 0 ? (
                            vehicle.seats.map((seat) => <li key={seat.id}>{`Asiento ${seat.code} `}</li>)
                        ) : (
                            <li>No hay asientos registrados.</li>
                        )}
                    </ul>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Viajes asignados</h3>
                    <ul className="list-disc pl-6 text-sm text-custom-black-700 space-y-1">
                        {vehicle.trips?.length > 0 ? (
                            vehicle.trips.map((trip) => (
                                <li key={trip.id}>
                                    <span className="font-medium">
                                        {trip.origin} → {trip.destination}
                                    </span>
                                    <br />
                                    <span className="text-custom-gray-600 text-xs">
                                        Salida: {format(new Date(trip.departure), "dd/MM/yyyy HH:mm")} | Llegada:{" "}
                                        {format(new Date(trip.arrival), "dd/MM/yyyy HH:mm")}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li>No hay viajes asignados.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsModal;
