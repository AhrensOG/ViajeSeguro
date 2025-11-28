"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getReservationsByUser } from "@/lib/api/reservation";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import ReservationCard from "./auxiliarComponents/ReservationCard";
import { toast } from "sonner";
import ReservationCardFallback from "@/lib/client/components/reservations/ReservationCardFallback";
import ReservationVehicleCard from "./auxiliarComponents/ReservationVehicleCard";
import { getVehicleBookingsForProfile } from "@/lib/api/vehicle-booking";
import { ResponseForProfilePage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { getMyRiderRequests, getJoinedRiderRequests, MyRiderRequestItem } from "@/lib/api/rider-requests";
import { convertUTCToLocalDate, convertUTCToLocalTime } from "@/lib/functions";

const ReservationsPage = () => {
    const { data: session } = useSession();
    const [reservations, setReservations] = useState<ReservationResponse[]>([]);
    const [vehicleBookings, setVehicleBookings] = useState<ResponseForProfilePage[]>([]);
    const [myRequests, setMyRequests] = useState<MyRiderRequestItem[]>([]);
    const [joinedRequests, setJoinedRequests] = useState<MyRiderRequestItem[]>([]);
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    const fetchReservations = useCallback(async () => {
        if (!session?.user?.id) return;
        try {
            const data = await getReservationsByUser(session.user.id);
            const vehicleBookings = await getVehicleBookingsForProfile(session.user.id);
            const my = await getMyRiderRequests();
            const joined = await getJoinedRiderRequests();

            setVehicleBookings(vehicleBookings as ResponseForProfilePage[]);
            setReservations(data);
            setMyRequests(Array.isArray(my) ? my : []);
            setJoinedRequests(Array.isArray(joined) ? joined : []);
        } catch (error) {
            console.log("Error al obtener reservas:", error);
            toast.info("¡Ups! Ocurrió un error al obtener tus reservas.", {
                description: "Intenta recargando la pagina o contacta con el soporte",
            });
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
            <div className="w-full flex flex-col justify-start items-start">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Mis reservas</h1>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center w-full gap-4">
                    <div className="w-full h-[72px] bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md text-sm mb-4 space-y-2">
                        <div className="h-2 w-[90%] bg-custom-gray-300 rounded" />
                        <div className="h-2 w-[80%] bg-custom-gray-300 rounded" />
                    </div>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ReservationCardFallback key={i} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center w-full gap-4">
                    <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md text-sm mb-4">
                        <p>
                            Recuerda que es obligatorio presentar un documento que acredite tu identidad al momento del viaje. En caso de no hacerlo,
                            tu reserva podría ser cancelada. Esta medida busca garantizar la seguridad de todos los pasajeros.
                        </p>
                    </div>

                    {myRequests.length > 0 && (
                        <div className="w-full">
                            <h2 className="text-lg font-semibold text-custom-gray-800 mb-2">Mis viajes armados</h2>
                            <div className="space-y-3">
                                {myRequests.map((req) => {
                                    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                    const date = convertUTCToLocalDate(req.departureAt, tz);
                                    const time = convertUTCToLocalTime(req.departureAt, tz);
                                    const expanded = !!expandedIds[req.id];
                                    const joinedCount = Array.isArray(req.passengers) ? req.passengers.filter(p => p.status === "JOINED").length : undefined;
                                    const available = typeof joinedCount === "number" ? Math.max(req.maxPassengers - joinedCount, 0) : undefined;
                                    const hasDriver = Boolean(req.chosenBid);
                                    return (
                                        <div key={req.id} className="rounded-xl border border-blue-200 shadow-sm overflow-hidden bg-white">
                                            <button
                                                type="button"
                                                onClick={() => toggleExpand(req.id)}
                                                className="w-full text-left px-4 py-3 md:px-5 bg-blue-50/50 hover:bg-blue-100/40 transition-colors flex items-center justify-between"
                                            >
                                                <div>
                                                    <div className="text-sm font-semibold text-blue-800">Armar tu viaje</div>
                                                    <div className="text-sm text-custom-black-800 font-semibold flex items-center gap-2">
                                                        <span className="truncate max-w-[220px] md:max-w-[320px]">{req.origin}</span>
                                                        <span className="opacity-60">→</span>
                                                        <span className="truncate max-w-[220px] md:max-w-[320px]">{req.destination}</span>
                                                    </div>
                                                    <div className="text-xs text-custom-gray-700">Salida: {date} · {time}</div>
                                                </div>
                                                <span className={`text-xs font-medium ${expanded ? "text-blue-700" : "text-custom-gray-700"}`}>
                                                    {expanded ? "Ocultar" : "Ver más"}
                                                </span>
                                            </button>
                                            {expanded && (
                                                <div className="px-4 py-3 md:px-5 space-y-2 text-sm text-custom-gray-800 bg-white">
                                                    <div className="flex flex-wrap gap-4">
                                                        <div><span className="font-semibold">Postulados:</span> {typeof joinedCount === 'number' ? joinedCount : '—'}</div>
                                                        <div><span className="font-semibold">Capacidad:</span> {req.maxPassengers}{typeof available === 'number' && <span className="ml-1 text-xs text-custom-gray-600">({available} disp.)</span>}</div>
                                                        <div><span className="font-semibold">Plazas que ocupas:</span> {req.seatsRequested}</div>
                                                        <div><span className="font-semibold">Conductor:</span> {hasDriver ? 'Asignado' : 'Sin asignar'}</div>
                                                        <div><span className="font-semibold">Estado:</span> {req.status || 'Abierta'}</div>
                                                    </div>
                                                    <div className="pt-1 text-right">
                                                        <a
                                                            href={`/rider-request?id=${req.id}`}
                                                            className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                                                        >
                                                            Ver detalle
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {joinedRequests.length > 0 && (
                        <div className="w-full">
                            <h2 className="text-lg font-semibold text-custom-gray-800 mb-2">Viajes a los que me uní</h2>
                            <div className="space-y-3">
                                {joinedRequests.map((req) => {
                                    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                    const date = convertUTCToLocalDate(req.departureAt, tz);
                                    const time = convertUTCToLocalTime(req.departureAt, tz);
                                    const expanded = !!expandedIds[req.id];
                                    const joinedCount = Array.isArray(req.passengers) ? req.passengers.filter(p => p.status === "JOINED").length : undefined;
                                    const available = typeof joinedCount === "number" ? Math.max(req.maxPassengers - joinedCount, 0) : undefined;
                                    const hasDriver = Boolean(req.chosenBid);
                                    return (
                                        <div key={req.id} className="rounded-xl border border-blue-200 shadow-sm overflow-hidden bg-white">
                                            <button
                                                type="button"
                                                onClick={() => toggleExpand(req.id)}
                                                className="w-full text-left px-4 py-3 md:px-5 bg-blue-50/50 hover:bg-blue-100/40 transition-colors flex items-center justify-between"
                                            >
                                                <div>
                                                    <div className="text-sm font-semibold text-blue-800">Armar tu viaje</div>
                                                    <div className="text-sm text-custom-black-800 font-semibold flex items-center gap-2">
                                                        <span className="truncate max-w-[220px] md:max-w-[320px]">{req.origin}</span>
                                                        <span className="opacity-60">→</span>
                                                        <span className="truncate max-w-[220px] md:max-w-[320px]">{req.destination}</span>
                                                    </div>
                                                    <div className="text-xs text-custom-gray-700">Salida: {date} · {time}</div>
                                                </div>
                                                <span className={`text-xs font-medium ${expanded ? "text-blue-700" : "text-custom-gray-700"}`}>
                                                    {expanded ? "Ocultar" : "Ver más"}
                                                </span>
                                            </button>
                                            {expanded && (
                                                <div className="px-4 py-3 md:px-5 space-y-2 text-sm text-custom-gray-800 bg-white">
                                                    <div className="flex flex-wrap gap-4">
                                                        <div><span className="font-semibold">Postulados:</span> {typeof joinedCount === 'number' ? joinedCount : '—'}</div>
                                                        <div><span className="font-semibold">Capacidad:</span> {req.maxPassengers}{typeof available === 'number' && <span className="ml-1 text-xs text-custom-gray-600">({available} disp.)</span>}</div>
                                                        <div><span className="font-semibold">Conductor:</span> {hasDriver ? 'Asignado' : 'Sin asignar'}</div>
                                                    </div>
                                                    <div className="pt-1 text-right">
                                                        <a
                                                            href={`/rider-request?id=${req.id}`}
                                                            className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                                                        >
                                                            Ver detalle
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {reservations.map((reservation, idx) => (
                        <ReservationCard key={`res-${reservation.id || idx}`} reservation={reservation} />
                    ))}
                    {vehicleBookings.map((vehicleBooking, idx) => (
                        <ReservationVehicleCard 
                            key={`vb-${vehicleBooking.id || idx}`} 
                            vehicleBooking={vehicleBooking} 
                            onBookingUpdate={fetchReservations}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;
