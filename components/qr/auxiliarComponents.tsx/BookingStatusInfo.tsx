"use client";

import { ResponseForQrPage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { AlertTriangle, CheckCircle2, CheckIcon, Timer } from "lucide-react";

type Props = {
    booking: ResponseForQrPage;
};

const BookingStatusInfo = ({ booking }: Props) => {
    const { status } = booking;

    const getBookingStatusLabel = () => {
        switch (status) {
            case "PENDING":
                return <span className="text-yellow-600 font-medium">Pendiente de pago</span>;
            case "APPROVED":
                return <span className="text-blue-700 font-semibold">Aprobada</span>;
            case "COMPLETED":
                return <span className="text-green-700 font-semibold">Completada - lista para comenzar</span>;
            case "FINISHED":
                return <span className="text-custom-black-700 font-medium">Finalizada</span>;
            case "DECLINED":
                return <span className="text-red-600 font-medium">Rechazada</span>;
            case "CANCELLED":
                return <span className="text-red-600 font-medium">Cancelada</span>;
            default:
                return <span className="text-gray-500 font-medium">Desconocido</span>;
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case "COMPLETED":
                return (
                    <div className="flex items-center gap-2 mt-2 text-green-700 font-medium">
                        <Timer className="size-5" />
                        <span>¡Reserva lista para comenzar!</span>
                    </div>
                );
            case "FINISHED":
                return (
                    <div className="flex items-center gap-2 mt-2 text-custom-black-700 font-medium">
                        <CheckIcon className="size-5" />
                        <span>El viaje ha finalizado correctamente.</span>
                    </div>
                );
            case "APPROVED":
                return (
                    <div className="flex items-center gap-2 mt-2 text-blue-700 font-medium">
                        <CheckCircle2 className="size-5" />
                        <span>¡Reserva aprobada!</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 mt-2 text-red-600 font-medium">
                        <AlertTriangle className="size-5" />
                        <span>Revisar el estado antes de entregar el vehículo.</span>
                    </div>
                );
        }
    };

    return (
        <section className="bg-custom-gray-100 p-4 rounded-lg text-sm">
            <div className="flex flex-col gap-2">
                <div>
                    <p className="text-custom-black-800 font-medium mb-1">Estado de la reserva:</p>
                    {getBookingStatusLabel()}
                </div>

                <div>
                    <h2 className="text-custom-black-800 font-medium mt-2 mb-1 text-sm">Estado del alquiler:</h2>
                    {getStatusIcon()}
                </div>
            </div>
        </section>
    );
};

export default BookingStatusInfo;
