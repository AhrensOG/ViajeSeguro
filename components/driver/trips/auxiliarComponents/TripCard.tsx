import { useState } from "react";
import { DateTime } from "luxon";
import { CalendarDays, Clock, MapPin, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TripResponse } from "@/lib/api/driver-profile/driverProfile.types";
import { useRouter } from "next/navigation";

interface Props {
    trip: TripResponse;
}

const TripCard = ({ trip }: Props) => {
    const [openCard, setOpenCard] = useState(false);
    const router = useRouter();

    // Total de equipaje adicional (suma de todas las reservas del viaje)
    const reservations: Array<{ seatCode?: string | null }> = (trip as any)?.reservations || [];
    const totalExtraBags = reservations.reduce((acc, r) => {
        const m = r.seatCode?.match(/^EXTRA_BAGS:(\d+)$/);
        const n = m ? Number(m[1]) : 0;
        return acc + (Number.isFinite(n) ? n : 0);
    }, 0);

    const departure = DateTime.fromISO(trip.departure).setZone(trip.originalTimeZone);
    const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);
    const formattedDate = departure.setLocale("es").toFormat("cccc, d 'de' LLLL");
    const departureTime = departure.toFormat("HH:mm");
    const arrivalTime = arrival.toFormat("HH:mm");

    return (
        <div
            onClick={() => setOpenCard(!openCard)}
            className="w-full rounded-2xl border border-custom-gray-200 shadow-md bg-custom-white-100 p-6 flex flex-col gap-4 cursor-pointer transition hover:shadow-lg"
        >
            {/* Cabecera */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-custom-golden-700">
                    <CalendarDays className="size-5" />
                    <span className="font-semibold text-sm">{formattedDate}</span>
                </div>
                <span className="text-sm text-custom-gray-500 font-medium">
                    ID: <span className="text-custom-black-700">{trip.id.slice(-6)}</span>
                </span>
            </div>

            {/* Info principal */}
            <div>
                <h2 className="text-xl font-bold text-custom-black-900 capitalize mb-1">
                    {trip.origin} → {trip.destination}
                </h2>
                <p className="text-sm text-custom-gray-600 capitalize">
                    {trip.originLocation} — {trip.destinationLocation}
                </p>
                <div className="flex items-center gap-2 mt-2 text-custom-gray-600 text-sm">
                    <Clock className="size-4" />
                    <span>
                        {departureTime} — {arrivalTime}
                    </span>
                </div>
            </div>

            {/* Indicador */}
            <p className="text-xs text-custom-gray-500 italic">Toca para ver más detalles del viaje</p>

            <AnimatePresence>
                {openCard && (
                    <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden flex flex-col gap-6 mt-2"
                    >
                        {/* Estado del viaje */}
                        <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
                            <p className="font-semibold text-custom-black-900 mb-1">Estado del viaje</p>
                            {trip.status === "PENDING" && (
                                <p className="text-custom-gray-700">
                                    Este viaje se confirmará automáticamente al alcanzar al menos <strong>{trip.minPassengers}</strong> pasajeros.
                                </p>
                            )}
                            {trip.status === "CONFIRMED" && (
                                <div className="flex items-center gap-2 text-green-700 font-medium">
                                    <CheckCircle2 className="size-4" />
                                    <span>Viaje confirmado</span>
                                </div>
                            )}
                            {trip.status === "CANCELLED" && (
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <AlertTriangle className="size-4" />
                                    <span>El viaje fue cancelado</span>
                                </div>
                            )}
                        </div>

                        {/* Detalles adicionales */}
                        <div className="flex items-center gap-2 text-sm text-custom-gray-700">
                            <Users className="size-4" />
                            Capacidad: {trip.capacity} pasajeros mínimo {trip.minPassengers}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-custom-gray-700">
                            <Users className="size-4" />
                            Equipaje adicional total: <span className="font-medium">{totalExtraBags}</span> maleta(s)
                        </div>
                        <div className="flex items-center gap-2 text-sm text-custom-gray-700">
                            <MapPin className="size-4" />
                            Origen: {trip.originLocation}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-custom-gray-700">
                            <MapPin className="size-4" />
                            Destino: {trip.destinationLocation}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/driver/trips/details?id=${trip.id}`);
                            }}
                            className="mt-4 w-full text-center text-sm text-custom-golden-700 font-semibold hover:underline cursor-pointer"
                        >
                            Ver detalles del viaje
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TripCard;
