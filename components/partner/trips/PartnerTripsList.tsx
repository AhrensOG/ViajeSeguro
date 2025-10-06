"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Route, Loader2, PlusCircle } from "lucide-react";
import { getTripsByDriverId } from "@/lib/api/driver-profile/intex";

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
};

interface Props {
  onRequestCreate: () => void;
  onItemsLoaded?: (count: number) => void;
}

export default function PartnerTripsList({ onRequestCreate, onItemsLoaded }: Props) {
  const [trips, setTrips] = useState<TripItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
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
    load();
    return () => {
      mounted = false;
    };
  }, [onItemsLoaded]);

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

      <div className="grid gap-4">
        {trips.map((t) => (
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
              <div className="text-right">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
