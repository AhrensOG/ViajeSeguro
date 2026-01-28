"use client";

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import ReservationCardFallback from "@/lib/client/components/reservations/ReservationCardFallback";
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

  return (
    <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
      <div className="w-full flex flex-col justify-start items-start">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Mis viajes</h1>
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
              Recuerda que es obligatorio que el pasajero presente un documento
              que acredite su identidad al momento del viaje. En caso de no
              hacerlo, usted debe informar al pasajero que no puede realizar el
              viaje. Esta medida busca garantizar la seguridad de todos los
              pasajeros.
            </p>
          </div>

          <div className="w-full flex flex-wrap gap-2 mb-6 p-1 bg-custom-gray-50 rounded-xl">
            {[
              { id: "UPCOMING", label: "Próximos", color: "text-blue-700 bg-blue-50 border-blue-200" },
              { id: "FINISHED", label: "Historial", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
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

          {sortedTrips.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-10 text-custom-gray-500">
              <div className="bg-custom-gray-100 p-4 rounded-full mb-4">
                <Search className="w-8 h-8 opacity-20" />
              </div>
              <p className="font-medium">No se encontraron viajes en esta categoría.</p>
              <p className="text-sm">Prueba cambiando el filtro o crea un nuevo viaje.</p>
            </div>
          ) : (
            sortedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TripsPanel;
