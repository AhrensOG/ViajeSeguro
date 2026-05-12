"use client";

import { Search, AlertTriangle, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import TripCard from "./auxiliarComponents/TripCard";
import { TripResponse } from "@/lib/api/driver-profile/driverProfile.types";
import { getTripsByDriverId } from "@/lib/api/driver-profile/intex";

const TripsPanel = () => {
  const { data: session } = useSession();
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "FINISHED" | "CANCELLED" | "ALL">("UPCOMING");

  const now = new Date();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      try {
        const data = await getTripsByDriverId();
        if (!Array.isArray(data)) return setTrips([]);
        setTrips(data);
      } catch (error) {
        console.log("Error al obtener reservas:", error);
        toast.info("¡Ups! Ocurrió un error al obtener tus reservas.", {
          description: "Intenta recargando la página o contacta con el soporte",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [session?.user?.id]);

  const isUpcoming = (trip: TripResponse) => {
    const date = new Date(trip.departure);
    return date >= now && trip.status !== "CANCELLED";
  };

  const isFinished = (trip: TripResponse) => {
    const date = new Date(trip.departure);
    return date < now && trip.status !== "CANCELLED";
  };

  const isCancelled = (status: string) => status === "CANCELLED";

  const getFilteredTrips = () => {
    if (activeTab === "ALL") return trips;
    return trips.filter((trip) => {
      if (activeTab === "UPCOMING") return isUpcoming(trip);
      if (activeTab === "FINISHED") return isFinished(trip);
      if (activeTab === "CANCELLED") return isCancelled(trip.status);
      return true;
    });
  };

  const countItems = (tab: typeof activeTab) => {
    return trips.filter((trip) => {
      if (tab === "UPCOMING") return isUpcoming(trip);
      if (tab === "FINISHED") return isFinished(trip);
      if (tab === "CANCELLED") return isCancelled(trip.status);
      return true;
    }).length;
  };

  const sortedTrips = getFilteredTrips().sort((a, b) => {
    if (activeTab === "UPCOMING") return new Date(a.departure).getTime() - new Date(b.departure).getTime();
    return new Date(b.departure).getTime() - new Date(a.departure).getTime();
  });

  const tabs = [
    { id: "UPCOMING" as const, label: "Próximos", color: "text-blue-700", dot: "bg-blue-500" },
    { id: "FINISHED" as const, label: "Historial", color: "text-emerald-700", dot: "bg-emerald-500" },
    { id: "CANCELLED" as const, label: "Cancelados", color: "text-red-700", dot: "bg-red-500" },
    { id: "ALL" as const, label: "Todos", color: "text-gray-700", dot: "bg-gray-500" },
  ];

  const TripCardSkeleton = () => (
    <div className="w-full rounded-2xl border border-gray-200 shadow-sm bg-white p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
      <div className="h-6 w-64 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-32 bg-gray-200 rounded" />
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full flex flex-col justify-start items-start mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis viajes</h1>
        <p className="text-sm text-gray-500 mt-1">Gestiona los viajes que tienes como conductor</p>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center w-full gap-4">
          <div className="w-full bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg text-sm mb-4 space-y-2">
            <div className="h-3 w-[90%] bg-amber-200/60 rounded" />
            <div className="h-3 w-[80%] bg-amber-200/60 rounded" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full gap-4">
          <div className="w-full bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 text-sm text-amber-800 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 mt-0.5 shrink-0" />
              <p>
                Recuerda que es obligatorio que el pasajero presente un documento
                que acredite su identidad al momento del viaje. En caso de no
                hacerlo, usted debe informar al pasajero que no puede realizar el
                viaje. Esta medida busca garantizar la seguridad de todos los
                pasajeros.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => {
              const count = countItems(tab.id);
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${tab.dot} ${isActive ? "opacity-100" : "opacity-40"}`} />
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    isActive ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
            <div className="flex-1" />
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent transition-all"
              title="Refrescar"
            >
              <RefreshCw className="size-4" />
              <span className="hidden sm:inline">Refrescar</span>
            </button>
          </div>

          {sortedTrips.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-16">
              <div className="bg-gray-100 p-5 rounded-full mb-5">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No hay viajes {activeTab === "UPCOMING" ? "próximos" : activeTab === "FINISHED" ? "finalizados" : activeTab === "CANCELLED" ? "cancelados" : ""}
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                {activeTab === "ALL"
                  ? "Aún no tienes ningún viaje. Cuando te asignen uno, aparecerá aquí."
                  : "No se encontraron viajes en esta categoría. Prueba cambiando el filtro."}
              </p>
            </div>
          ) : (
            sortedTrips.map((trip, i) => (
              <div
                key={trip.id}
                className="w-full"
                style={{ animation: `fadeSlideUp ${300 + i * 80}ms ease-out both` }}
              >
                <TripCard trip={trip} />
              </div>
            ))
          )}
        </div>
      )}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TripsPanel;
