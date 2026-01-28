"use client";

import { Search } from "lucide-react";
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
    const [activeTab, setActiveTab] = useState<"UPCOMING" | "FINISHED" | "CANCELLED" | "ALL">("UPCOMING");

    const now = new Date();

    const isUpcoming = (dateStr: string, status: string) => {
        const date = new Date(dateStr);
        return date >= now && !["CANCELLED", "DECLINED", "FINISHED", "RETURNED"].includes(status);
    };

    const isFinished = (dateStr: string, status: string) => {
        const date = new Date(dateStr);
        return ["FINISHED", "RETURNED", "COMPLETED"].includes(status) || (date < now && !["CANCELLED", "DECLINED"].includes(status));
    };

    const isCancelled = (status: string) => ["CANCELLED", "DECLINED"].includes(status);

    const filterItems = <T extends { status?: string }>(items: T[], dateGetter: (item: T) => string) => {
        if (activeTab === "ALL") return items;
        return items.filter((item) => {
            const date = dateGetter(item);
            const status = item.status || "PENDING";
            if (activeTab === "UPCOMING") return isUpcoming(date, status);
            if (activeTab === "FINISHED") return isFinished(date, status);
            if (activeTab === "CANCELLED") return isCancelled(status);
            return true;
        });
    };

    const countItems = (tab: typeof activeTab) => {
        const check = (dateStr: string, status: string) => {
            if (tab === "UPCOMING") return isUpcoming(dateStr, status);
            if (tab === "FINISHED") return isFinished(dateStr, status);
            if (tab === "CANCELLED") return isCancelled(status);
            return true;
        };

        const rCount = reservations.filter(r => check(r.trip.departure, r.status)).length;
        const vCount = vehicleBookings.filter(v => check(v.endDate, v.status)).length;
        const mCount = myRequests.filter(m => check(m.departureAt, m.status || "PENDING")).length;
        const jCount = joinedRequests.filter(j => check(j.departureAt, j.status || "PENDING")).length;

        return rCount + vCount + mCount + jCount;
    };

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
                    <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md text-sm mb-6">
                        <p>
                            Recuerda que es obligatorio presentar un documento que acredite tu identidad al momento del viaje. En caso de no hacerlo,
                            tu reserva podría ser cancelada. Esta medida busca garantizar la seguridad de todos los pasajeros.
                        </p>
                    </div>

                    {/* Filtros Premium */}
                    <div className="w-full flex flex-wrap gap-2 mb-6 p-1 bg-custom-gray-50 rounded-xl">
                        {[
                            { id: "UPCOMING", label: "Próximos", color: "text-blue-700 bg-blue-50 border-blue-200" },
                            { id: "FINISHED", label: "Finalizados", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                            { id: "CANCELLED", label: "Cancelados", color: "text-red-700 bg-red-50 border-red-200" },
                            { id: "ALL", label: "Todos", color: "text-custom-gray-700 bg-custom-white-100 border-custom-gray-200" }
                        ].map((tab) => {
                            const count = countItems(tab.id as typeof activeTab);
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${isActive
                                        ? `${tab.color} border-current shadow-sm scale-105 z-10`
                                        : "bg-white text-custom-gray-500 border-transparent hover:border-custom-gray-200"
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${isActive ? "bg-white/50" : "bg-custom-gray-100"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {filterItems(myRequests, (m) => m.departureAt).length > 0 && (
                        <div className="w-full">
                            <h2 className="text-lg font-semibold text-custom-gray-800 mb-2">Mis viajes armados</h2>
                            <div className="space-y-3">
                                {filterItems(myRequests, (m) => m.departureAt).map((req) => {
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

                    {filterItems(joinedRequests, (j) => j.departureAt).length > 0 && (
                        <div className="w-full">
                            <h2 className="text-lg font-semibold text-custom-gray-800 mb-2">Viajes a los que me uní</h2>
                            <div className="space-y-3">
                                {filterItems(joinedRequests, (j) => j.departureAt).map((req) => {
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

                    {filterItems(reservations, (r) => r.trip.departure).map((reservation, idx) => (
                        <ReservationCard key={`res-${reservation.id || idx}`} reservation={reservation} />
                    ))}
                    {filterItems(vehicleBookings, (v) => v.endDate).map((vehicleBooking, idx) => (
                        <ReservationVehicleCard
                            key={`vb-${vehicleBooking.id || idx}`}
                            vehicleBooking={vehicleBooking}
                            onBookingUpdate={fetchReservations}
                        />
                    ))}

                    {countItems(activeTab) === 0 && (
                        <div className="w-full flex flex-col items-center justify-center py-10 text-custom-gray-500">
                            <div className="bg-custom-gray-100 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="font-medium">No se encontraron reservas en esta categoría.</p>
                            <p className="text-sm">Prueba cambiando el filtro o realiza una nueva reserva.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;
