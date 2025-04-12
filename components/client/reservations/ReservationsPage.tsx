"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getReservationsByUser } from "@/lib/api/reservation";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import ReservationCard from "./auxiliarComponents/ReservationCard";

const ReservationsPage = () => {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!session?.user?.id) return;
      try {
        const data = await getReservationsByUser(session.user.id);
        setReservations(data);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [session?.user?.id]);

  return (
    <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
      <div className="w-full flex flex-col justify-start items-start">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Mis reservas
        </h1>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando reservas...</p>
      ) : (
        <div className="flex flex-col justify-center items-center w-full gap-4">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
