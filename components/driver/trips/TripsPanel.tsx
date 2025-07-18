"use client";

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

  useEffect(() => {
    const fetchReservations = async () => {
      if (!session?.user?.id) return;
      try {
        const data = await getTripsByDriverId();

        setTrips(Array.isArray(data) ? (data as TripResponse[]) : []);
      } catch (error) {
        console.log("Error al obtener reservas:", error);
        toast.info("¡Ups! Ocurrió un error al obtener tus reservas.", {
          description: "Intenta recargando la pagina o contacta con el soporte",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [session?.user?.id]);

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
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripsPanel;
