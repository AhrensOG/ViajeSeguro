"use client";

import { X } from "lucide-react";
import { format } from "date-fns";
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImagePreviewModal from "./ImagePreviewModal";

interface Props {
    vehicle: Vehicle;
    onClose: () => void;
}
const featuresMap = {
    GPS: "GPS",
    AIR_CONDITIONING: "Aire acondicionado",
    BLUETOOTH: "Bluetooth",
    REAR_CAMERA: "Cámara trasera",
    USB: "Puerto USB",
    PARKING_SENSORS: "Sensores de aparcamiento",
    CRUISE_CONTROL: "Control de crucero",
} as const;

const transmissionTypeMap = {
    MANUAL: "Manual",
    AUTOMATIC: "Automática",
} as const;

const fuelTypeMap = {
    DIESEL: "Diésel",
    GASOLINE: "Nafta",
    ELECTRIC: "Eléctrico",
    HYBRID: "Híbrido",
} as const;

const serviceTypeMap: Record<string, string> = {
    SIMPLE_TRIP: "Viaje simple",
    RENTAL_WITH_DRIVER: "Con chofer",
    RENTAL_WITHOUT_DRIVER: "Sin chofer",
} as const;

const providerMap = {
    VS: "ViajeSeguro",
    PARTNER: "Particular",
} as const;

const VehicleDetailsModal = ({ vehicle, onClose }: Props) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Detalles del vehículo</h2>

                <div className="space-y-3 text-sm text-custom-black-800">
                    <p>
                        <strong>Marca:</strong> {vehicle.brand}
                    </p>
                    <p>
                        <strong>Modelo:</strong> {vehicle.model}
                    </p>
                    <p>
                        <strong>Año:</strong> {vehicle.year}
                    </p>
                    <p>
                        <strong>Transmisión:</strong> {transmissionTypeMap[vehicle.transmissionType]}
                    </p>
                    <p>
                        <strong>Combustible:</strong> {fuelTypeMap[vehicle.fuelType]}
                    </p>
                    <p>
                        <strong>Placa:</strong> {vehicle.plate}
                    </p>
                    <p>
                        <strong>Capacidad:</strong> {vehicle.capacity}
                    </p>
                    <p>
                        <strong>Tipo de servicio:</strong> {serviceTypeMap[vehicle.serviceType]}
                    </p>
                    <p>
                        <strong>Proveedor:</strong> {providerMap[vehicle.provider as keyof typeof providerMap]}
                    </p>
                    <p>
                        <strong>Selección de asientos:</strong> {vehicle.allowSeatSelection ? "Sí" : "No"}
                    </p>
                    <p>
                        <strong>Propietario:</strong> {vehicle.owner?.name} {vehicle.owner?.lastName} - {vehicle.owner?.email}
                    </p>
                    <p>
                        <strong>Características:</strong>{" "}
                        {vehicle.features?.length > 0
                            ? vehicle.features.map((f) => featuresMap[f as keyof typeof featuresMap] || f).join(", ")
                            : "Ninguna"}
                    </p>
                </div>

                {vehicle.images?.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Imágenes</h3>
                        <div className="flex flex-wrap gap-3">
                            {vehicle.images.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img}
                                    alt={`Imagen ${idx + 1}`}
                                    className="w-32 h-32 object-cover rounded border border-custom-gray-300"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Asientos asignados</h3>
                    <ul className="list-disc pl-6 text-sm text-custom-black-700">
                        {vehicle.seats?.length > 0 ? (
                            vehicle.seats.map((seat) => <li key={seat.id}>{`Asiento ${seat.code}`}</li>)
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

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Galería de imágenes</h3>

                    {vehicle.images?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {vehicle.images.map((img, idx) => (
                                <div key={idx} className="cursor-pointer" onClick={() => setPreviewImage(img)}>
                                    <Image
                                        src={img}
                                        alt={`Imagen ${idx + 1}`}
                                        className="w-full h-48 object-cover rounded border border-custom-gray-300"
                                        width={400}
                                        height={300}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-custom-gray-600">No se encontraron imágenes para el vehículo seleccionado.</p>
                    )}
                </div>
            </div>
            {previewImage && <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />}
        </div>
    );
};

export default VehicleDetailsModal;
