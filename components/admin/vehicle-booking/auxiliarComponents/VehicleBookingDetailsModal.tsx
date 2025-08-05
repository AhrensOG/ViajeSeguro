"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { VehicleBookingResponseAdmin } from "@/lib/api/admin/vehicle-bookings/vehicleBookings.types";

interface Props {
    onClose: () => void;
    booking: VehicleBookingResponseAdmin;
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

const statusMap = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmada",
    DECLINED: "Declinada",
    CANCELLED: "Cancelada",
    FINISHED: "Finalizada",
} as const;

const vehicleOfferTypeMap = {
    WITH_DRIVER: "Con conductor",
    WITHOUT_DRIVER: "Sin conductor",
} as const;

const VehicleBookingDetailsModal = ({ onClose, booking }: Props) => {
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

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Detalles de la reserva</h2>

                <div className="space-y-3 text-sm text-custom-black-800">
                    <p>
                        <strong>Estado:</strong> {statusMap[booking.status as keyof typeof statusMap] || booking.status}
                    </p>
                    <p>
                        <strong>Precio total:</strong> €{booking.totalPrice}
                    </p>
                    <p>
                        <strong>Desde:</strong> {format(new Date(booking.startDate), "dd/MM/yyyy")}
                    </p>
                    <p>
                        <strong>Hasta:</strong> {format(new Date(booking.endDate), "dd/MM/yyyy")}
                    </p>
                    <p>
                        <strong>Fee de agencia:</strong> €{booking.offer.agencyFee}
                    </p>
                    <p>
                        <strong>Condiciones:</strong> {booking.offer.conditions}
                    </p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Información del arrendatario</h3>
                    <div className="space-y-2 text-sm text-custom-black-700">
                        <p>
                            <strong>Nombre:</strong> {booking.renter.name} {booking.renter.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {booking.renter.email}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Información de la oferta</h3>
                    <div className="space-y-2 text-sm text-custom-black-700">
                        <p>
                            <strong>Precio por día:</strong> €{booking.offer.pricePerDay}
                        </p>
                        <p>
                            <strong>Disponible desde:</strong> {format(new Date(booking.offer.availableFrom), "dd/MM/yyyy")}
                        </p>
                        <p>
                            <strong>Disponible hasta:</strong> {format(new Date(booking.offer.availableTo), "dd/MM/yyyy")}
                        </p>
                        <p>
                            <strong>Ubicación de retiro:</strong> {booking.offer.withdrawLocation}
                        </p>
                        <p>
                            <strong>Ubicación de devolución:</strong> {booking.offer.returnLocation}
                        </p>
                        <p>
                            <strong>Tipo de oferta:</strong>{" "}
                            {vehicleOfferTypeMap[booking.offer.vehicleOfferType as keyof typeof vehicleOfferTypeMap] ||
                                booking.offer.vehicleOfferType}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-custom-golden-600 mb-2">Información del vehículo</h3>
                    <div className="space-y-2 text-sm text-custom-black-700">
                        <p>
                            <strong>Marca:</strong> {booking.offer.vehicle.brand}
                        </p>
                        <p>
                            <strong>Modelo:</strong> {booking.offer.vehicle.model}
                        </p>
                        <p>
                            <strong>Año:</strong> {booking.offer.vehicle.year}
                        </p>
                        <p>
                            <strong>Capacidad:</strong> {booking.offer.vehicle.capacity} personas
                        </p>
                        <p>
                            <strong>Combustible:</strong> {fuelTypeMap[booking.offer.vehicle.fuelType] || booking.offer.vehicle.fuelType}
                        </p>
                        <p>
                            <strong>Transmisión:</strong>{" "}
                            {transmissionTypeMap[booking.offer.vehicle.transmissionType] || booking.offer.vehicle.transmissionType}
                        </p>
                        <p>
                            <strong>Patente:</strong> {booking.offer.vehicle.plate}
                        </p>
                        <p>
                            <strong>Características:</strong>{" "}
                            {booking.offer.vehicle.features.map((f) => featuresMap[f as keyof typeof featuresMap] || f).join(", ")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleBookingDetailsModal;
