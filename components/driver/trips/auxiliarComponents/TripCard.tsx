import { useState } from "react";
import { DateTime } from "luxon";
import { CalendarDays, Clock, MapPin, Users, ChevronDown, Eye, ArrowRight, Luggage } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TripResponse } from "@/lib/api/driver-profile/driverProfile.types";
import { useRouter } from "next/navigation";

interface Props {
    trip: TripResponse;
}

const statusConfig: Record<string, { label: string; dot: string; classes: string }> = {
    PENDING: { label: "Pendiente", dot: "bg-amber-500", classes: "bg-amber-50 text-amber-700 border-amber-200" },
    CONFIRMED: { label: "Confirmado", dot: "bg-emerald-500", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CANCELLED: { label: "Cancelado", dot: "bg-red-500", classes: "bg-red-50 text-red-700 border-red-200" },
};

const TripCard = ({ trip }: Props) => {
    const [openCard, setOpenCard] = useState(false);
    const router = useRouter();

    const reservations = ((trip as unknown as { reservations?: Array<{ seatCode?: string | null }> }).reservations) ?? [];
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

    const status = statusConfig[trip.status] ?? { label: trip.status, dot: "bg-gray-500", classes: "bg-gray-50 text-gray-700 border-gray-200" };

    const now = DateTime.now();
    const diff = departure.diff(now, ["hours", "minutes"]).toObject();
    const isUpcoming = departure > now && trip.status !== "CANCELLED";

    let timeRemaining = "";
    if (isUpcoming) {
        if (diff.hours && diff.hours >= 24) {
            const days = Math.floor(diff.hours / 24);
            timeRemaining = `En ${days} día${days > 1 ? "s" : ""}`;
        } else if (diff.hours && diff.hours >= 1) {
            timeRemaining = `En ${Math.floor(diff.hours)}h`;
        } else if (diff.minutes && diff.minutes >= 1) {
            timeRemaining = `En ${Math.floor(diff.minutes)}min`;
        } else {
            timeRemaining = "Ahora";
        }
    }

    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200">
            <div
                onClick={() => setOpenCard(!openCard)}
                className="p-5 md:p-6 flex flex-col gap-4 cursor-pointer"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                        <CalendarDays className="size-4" />
                        <span className="text-sm font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.classes}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                        </span>
                        <motion.div animate={{ rotate: openCard ? 180 : 0 }} transition={{ duration: 0.3 }}>
                            <ChevronDown className="size-4 text-gray-400" />
                        </motion.div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-0.5 pt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
                        <div className="w-0.5 h-8 bg-gradient-to-b from-amber-300 to-emerald-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 capitalize">
                            {trip.origin}
                        </h2>
                        <p className="text-xs text-gray-500 mb-2">{trip.originLocation}</p>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <ArrowRight className="size-3" />
                            <span className="text-gray-900 font-semibold capitalize">{trip.destination}</span>
                            <span className="text-gray-400 font-normal">— {trip.destinationLocation}</span>
                        </div>
                    </div>
                    {isUpcoming && (
                        <div className="shrink-0 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-700 whitespace-nowrap">
                            {timeRemaining}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="size-4 text-gray-400" />
                        <span>{departureTime} — {arrivalTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <Users className="size-4 text-gray-400" />
                        <span>Cap. {trip.capacity} · mín. {trip.minPassengers}</span>
                    </div>
                    {trip.basePrice > 0 && (
                        <div className="ml-auto flex items-center gap-1.5 font-semibold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg text-xs">
                            <span>€ {trip.basePrice.toFixed(2).replace(".", ",")}</span>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {openCard && (
                    <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-gray-100 mx-5 md:mx-6" />
                        <div className="p-5 md:p-6 pt-0 flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Estado</p>
                                    {trip.status === "PENDING" && (
                                        <p className="text-sm text-gray-700">
                                            Pendiente — se confirmará al alcanzar <strong>{trip.minPassengers}</strong> pasajero(s).
                                        </p>
                                    )}
                                    {trip.status === "CONFIRMED" && (
                                        <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Viaje confirmado
                                        </div>
                                    )}
                                    {trip.status === "CANCELLED" && (
                                        <div className="flex items-center gap-2 text-red-600 font-medium text-sm">
                                            <span className="w-2 h-2 rounded-full bg-red-500" />
                                            Cancelado
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Capacidad</p>
                                    <p className="text-sm text-gray-700">{trip.capacity} plazas · mínimo {trip.minPassengers}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-2.5">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Detalles del trayecto</p>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="flex items-center gap-2.5">
                                        <MapPin className="size-4 text-gray-400 shrink-0" />
                                        <span><span className="text-gray-500">Salida:</span> {trip.originLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <MapPin className="size-4 text-gray-400 shrink-0" />
                                        <span><span className="text-gray-500">Destino:</span> {trip.destinationLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Luggage className="size-4 text-gray-400 shrink-0" />
                                        <span><span className="text-gray-500">Equipaje adicional:</span> {totalExtraBags} maleta(s)</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/dashboard/driver/trips/details?id=${trip.id}`);
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all text-sm cursor-pointer"
                            >
                                <Eye className="size-4" />
                                Ver detalles completos
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TripCard;
