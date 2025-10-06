"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { VehicleBookingResponseAdmin } from "@/lib/api/admin/vehicle-bookings/vehicleBookings.types";
import Image from "next/image";

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

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const media = booking.media || [];
    const byPhase = {
        OWNER_PRE: media.filter(m => m.phase === 'OWNER_PRE'),
        RENTER_PICKUP: media.filter(m => m.phase === 'RENTER_PICKUP'),
        RENTER_RETURN: media.filter(m => m.phase === 'RENTER_RETURN'),
        OWNER_POST: media.filter(m => m.phase === 'OWNER_POST'),
    } as const;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl relative border border-custom-gray-300 overflow-y-auto max-h-[90vh]"
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

                {/* Resumen de odómetro y combustible */}
                {(booking.odometerOut !== undefined || booking.odometerIn !== undefined || booking.fuelOut !== undefined || booking.fuelIn !== undefined) && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                            <h4 className="font-semibold text-gray-900 mb-2">Salida</h4>
                            <p className="text-sm text-gray-700">Kilometraje salida: <strong>{booking.odometerOut ?? '-'}</strong></p>
                            <p className="text-sm text-gray-700">Combustible salida: <strong>{booking.fuelOut ?? '-'}</strong></p>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                            <h4 className="font-semibold text-gray-900 mb-2">Entrada</h4>
                            <p className="text-sm text-gray-700">Kilometraje entrada: <strong>{booking.odometerIn ?? '-'}</strong></p>
                            <p className="text-sm text-gray-700">Combustible entrada: <strong>{booking.fuelIn ?? '-'}</strong></p>
                        </div>
                    </div>
                )}

                {/* Galerías por fase */}
                <div className="mt-6 space-y-6">
                    {([
                        { key: 'OWNER_PRE', title: 'Dueño — Antes de entregar (OWNER_PRE)', items: byPhase.OWNER_PRE },
                        { key: 'RENTER_PICKUP', title: 'Cliente — Retiro del vehículo (RENTER_PICKUP)', items: byPhase.RENTER_PICKUP },
                        { key: 'RENTER_RETURN', title: 'Cliente — Devolución del vehículo (RENTER_RETURN)', items: byPhase.RENTER_RETURN },
                        { key: 'OWNER_POST', title: 'Dueño — Recepción tras devolución (OWNER_POST)', items: byPhase.OWNER_POST },
                    ] as const).map(section => (
                        <div key={section.key}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base md:text-lg font-semibold text-custom-golden-600">{section.title}</h3>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{section.items.length} registros</span>
                            </div>
                            {section.items.length === 0 ? (
                                <p className="text-sm text-gray-500">Sin registros</p>
                            ) : (
                                <div className="space-y-4">
                                    {section.items.map((m) => (
                                        <div key={m.id} className="rounded-xl border border-gray-200 bg-white">
                                            <div className="px-3 pt-3 text-xs text-gray-700 flex flex-wrap gap-4 items-center">
                                                {m.mileage !== undefined && <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">Km: <strong>{m.mileage}</strong></span>}
                                                {m.fuelLevel !== undefined && <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">Combustible: <strong>{m.fuelLevel}</strong></span>}
                                                <span className="text-gray-500 ml-auto">{new Date(m.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                {m.urls.map((url, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setPreviewUrl(url)}
                                                        className="group relative block rounded-lg overflow-hidden border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                        title="Ver grande"
                                                    >
                                                        <Image
                                                            src={url}
                                                            alt={`media-${idx}`}
                                                            width={320}
                                                            height={112}
                                                            className="w-full h-28 object-cover transition-transform duration-200 group-hover:scale-105"
                                                        />
                                                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {/* Lightbox preview */}
            {previewUrl && (
                <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
                    <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="absolute -top-10 right-0 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded px-3 py-1"
                        >
                            Cerrar
                        </button>
                        <div className="relative w-full h-[80vh]">
                            <Image src={previewUrl} alt="preview" fill className="object-contain rounded-lg shadow-2xl" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleBookingDetailsModal;
