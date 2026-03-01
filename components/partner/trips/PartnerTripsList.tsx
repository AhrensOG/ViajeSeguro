"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Route, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { getTripsByDriverId } from "@/lib/api/driver-profile/intex";
import CancelTripModalPartner from "./CancelTripModalPartner";

type TripItem = {
  id: string;
  origin: string;
  destination: string;
  originLocation?: string | null;
  destinationLocation?: string | null;
  departure: string; // ISO
  arrival: string;   // ISO
  basePrice: number;
  capacity: number;
  status: string;
  reservations?: {
    id: string;
    status: string;
  }[];
};

interface Props {
  onRequestCreate: () => void;
  onItemsLoaded?: (count: number) => void;
}

export default function PartnerTripsList({ onRequestCreate, onItemsLoaded }: Props) {
  const [trips, setTrips] = useState<TripItem[] | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "PAST" | "CANCELLED">("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelModalData, setCancelModalData] = useState<{
    id: string;
    origin: string;
    destination: string;
    reservationsCount: number;
  } | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = (await getTripsByDriverId()) as TripItem[];
      setTrips(res);
      onItemsLoaded?.(Array.isArray(res) ? res.length : 0);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar tus viajes");
      onItemsLoaded?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const initialLoad = async () => {
      try {
        setLoading(true);
        const res = (await getTripsByDriverId()) as TripItem[];
        if (!mounted) return;
        setTrips(res);
        onItemsLoaded?.(Array.isArray(res) ? res.length : 0);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setError("No se pudieron cargar tus viajes");
        onItemsLoaded?.(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initialLoad();
    return () => {
      mounted = false;
    };
  }, [onItemsLoaded]);

  const isCancelable = (departureIso: string) => {
    const departureDate = new Date(departureIso);
    const now = new Date();
    const diffHours = (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  const filteredTrips = trips?.filter((t) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "CANCELLED") return t.status === "CANCELLED";

    const departureDate = new Date(t.departure);
    const now = new Date();
    const isPast = departureDate < now;

    if (activeTab === "UPCOMING") {
      return !isPast && t.status !== "CANCELLED";
    }
    if (activeTab === "PAST") {
      return isPast && t.status !== "CANCELLED";
    }
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="w-full max-w-4xl mt-4">
        <div className="flex items-center gap-2 text-custom-gray-700 mb-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando tus viajes...
        </div>
        <div className="grid gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-custom-gray-200 bg-custom-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mt-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    // No render list; allow parent to show empty state
    return null;
  }

  return (
    <div className="w-full max-w-4xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-custom-black-800">Mis viajes publicados</h2>
        <button
          onClick={onRequestCreate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-custom-golden-700 hover:bg-custom-golden-800 text-white text-sm font-medium shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" /> Crear nuevo viaje
        </button>
      </div>

      <div className="flex bg-custom-gray-100 p-1 rounded-xl mb-6 w-full md:w-fit overflow-x-auto no-scrollbar">
        {[
          { id: "ALL", label: "Todos" },
          { id: "UPCOMING", label: "Próximos" },
          { id: "PAST", label: "Pasados" },
          { id: "CANCELLED", label: "Cancelados" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "ALL" | "UPCOMING" | "PAST" | "CANCELLED")}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
              ? "bg-white text-custom-black-800 shadow-sm"
              : "text-custom-gray-600 hover:text-custom-black-800 hover:bg-custom-gray-200"
              }`}
          >
            {tab.label}
            {trips && (
              <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id
                ? "bg-custom-gray-100 text-custom-black-800"
                : "bg-custom-gray-200 text-custom-gray-600"
                }`}>
                {
                  trips.filter((t) => {
                    if (tab.id === "ALL") return true;
                    if (tab.id === "CANCELLED") return t.status === "CANCELLED";
                    const isPast = new Date(t.departure) < new Date();
                    if (tab.id === "UPCOMING") return !isPast && t.status !== "CANCELLED";
                    if (tab.id === "PAST") return isPast && t.status !== "CANCELLED";
                    return true;
                  }).length
                }
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-custom-gray-200">
            <Route className="mx-auto h-12 w-12 text-custom-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-custom-black-800">Ningún viaje encontrado</h3>
            <p className="mt-1 text-sm text-custom-gray-500">
              {activeTab === "ALL"
                ? "Aún no tienes viajes publicados."
                : "No hay viajes que coincidan con este filtro."}
            </p>
          </div>
        ) : (
          filteredTrips.map((t) => (
            <div key={t.id} className="rounded-xl border border-custom-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-custom-black-800 font-semibold">
                    <Route className="h-4 w-4 text-custom-golden-700" />
                    {t.origin} → {t.destination}
                  </div>
                  <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-custom-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{t.originLocation || "Origen"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{t.destinationLocation || "Destino"}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-custom-gray-700">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(t.departure).toLocaleString()} — {new Date(t.arrival).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div>
                    <div className="text-sm font-semibold text-custom-black-800">
                      {t.basePrice.toFixed(2)} €
                    </div>
                    <div className="text-xs text-custom-gray-600">Capacidad: {t.capacity}</div>
                    <div className="text-xs mt-1">
                      <span className="inline-block px-2 py-0.5 rounded-md border text-[11px] uppercase tracking-wide
                      border-custom-gray-300 text-custom-gray-700">
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {t.status !== "CANCELLED" && t.status !== "FINISHED" && (
                    <button
                      onClick={() => {
                        const activeRes = t.reservations?.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING') || [];
                        setCancelModalData({
                          id: t.id,
                          origin: t.origin,
                          destination: t.destination,
                          reservationsCount: activeRes.length,
                        });
                      }}
                      disabled={!isCancelable(t.departure)}
                      title={
                        !isCancelable(t.departure)
                          ? "Solo puedes cancelar si faltan más de 24 horas"
                          : "Cancelar viaje"
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )))}
      </div>

      {cancelModalData && (
        <CancelTripModalPartner
          tripId={cancelModalData.id}
          origin={cancelModalData.origin}
          destination={cancelModalData.destination}
          reservationsCount={cancelModalData.reservationsCount}
          onClose={() => setCancelModalData(null)}
          onSuccess={() => {
            setCancelModalData(null);
            load(); // reload the trips to see the CANCELLED status
          }}
        />
      )}
    </div>
  );
}
