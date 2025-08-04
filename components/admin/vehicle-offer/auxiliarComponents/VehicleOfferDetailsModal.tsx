"use client";

import { X } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { VehicleOffersAdminResponse } from "@/lib/api/admin/vehicle-offers/vehicleOffers.types";
import Image from "next/image";

interface Props {
    onClose: () => void;
    offer: VehicleOffersAdminResponse;
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

const vehicleOfferTypeMap = {
    WITH_DRIVER: "Con conductor",
    WITHOUT_DRIVER: "Sin conductor",
} as const;

const VehicleOfferDetailsModal = ({ onClose, offer }: Props) => {
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

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Detalles de la oferta</h2>

                <div className="space-y-3 text-sm text-custom-black-800">
                    <p>
                        <strong>Precio por día:</strong> €{offer.pricePerDay}
                    </p>
                    <p>
                        <strong>Disponible desde:</strong> {format(new Date(offer.availableFrom), "dd/MM/yyyy")}
                    </p>
                    <p>
                        <strong>Disponible hasta:</strong> {format(new Date(offer.availableTo), "dd/MM/yyyy")}
                    </p>
                    <p>
                        <strong>Zona horaria original:</strong> {offer.originalTimeZone}
                    </p>
                    <p>
                        <strong>Ubicación de retiro:</strong> {offer.withdrawLocation}
                    </p>
                    <p>
                        <strong>Ubicación de devolución:</strong> {offer.returnLocation}
                    </p>
                    <p>
                        <strong>Tipo de oferta:</strong>{" "}
                        {vehicleOfferTypeMap[offer.vehicleOfferType as keyof typeof vehicleOfferTypeMap] || offer.vehicleOfferType}
                    </p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Información del vehículo</h3>
                    <div className="space-y-2 text-sm text-custom-black-700">
                        <p>
                            <strong>Marca:</strong> {offer.vehicle.brand}
                        </p>
                        <p>
                            <strong>Modelo:</strong> {offer.vehicle.model}
                        </p>
                        <p>
                            <strong>Año:</strong> {offer.vehicle.year}
                        </p>
                        <p>
                            <strong>Capacidad:</strong> {offer.vehicle.capacity} personas
                        </p>
                        <p>
                            <strong>Combustible:</strong> {fuelTypeMap[offer.vehicle.fuelType as keyof typeof fuelTypeMap] || offer.vehicle.fuelType}
                        </p>
                        <p>
                            <strong>Transmisión:</strong>{" "}
                            {transmissionTypeMap[offer.vehicle.transmissionType as keyof typeof transmissionTypeMap] ||
                                offer.vehicle.transmissionType}
                        </p>
                        <p>
                            <strong>Características:</strong>{" "}
                            {offer.vehicle.features?.map((f) => featuresMap[f as keyof typeof featuresMap] || f).join(", ")}
                        </p>
                    </div>
                </div>

                {offer.vehicle.images?.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Imágenes</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {offer.vehicle.images.map((url, i) => (
                                <Image
                                    key={i}
                                    src={url}
                                    alt={`Imagen ${i + 1}`}
                                    className="rounded-md w-full h-32 object-cover border border-custom-gray-200"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Reservas</h3>
                    {offer.bookings && offer.bookings.length > 0 ? (
                        <ul className="space-y-2 text-sm text-custom-black-800">
                            {offer.bookings.map((booking) => (
                                <li key={booking.id} className="border border-custom-gray-200 rounded-md p-3">
                                    <p>
                                        <strong>Renter:</strong> {booking.renter.name} {booking.renter.lastName} ({booking.renter.email})
                                    </p>
                                    <p>
                                        <strong>Precio total:</strong> €{booking.totalPrice}
                                    </p>
                                    <p>
                                        <strong>Fecha de reserva:</strong> {format(new Date(booking.createdAt), "dd/MM/yyyy")}
                                    </p>
                                    <p>
                                        <strong>Estado:</strong> {booking.status}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Todavía no tiene reservas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleOfferDetailsModal;
