import React, { useEffect, useState } from "react";
import TripDetail from "./TripDetail";
import BookingSidebar from "./BookingSidebar";
import { useSearchParams } from "next/navigation";
import { getTripById } from "@/lib/api/trip";
import { Trip } from "@/lib/shared/types/trip-service-type.type";
import NotFoundMessage from "@/lib/client/components/NotFoundMessage";
import TripProcessFallback from "@/lib/client/components/fallbacks/trip/TripProcessFallback";

const TripProcess = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const tripData = await getTripById(id);
        setTrip(tripData as Trip);
      } catch (err) {
        console.log("Error al cargar el viaje:", err);
        setError("Error al obtener el viaje");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) {
    return <TripProcessFallback />;
  }

  if (error) {
    return (
      <NotFoundMessage
        message="No se encontró ningun viaje relacionado"
        actionHref="/"
        actionLabel="Volver"
      />
    );
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-custom-black-800 mb-6">
        Domingo, 6 de abril
      </h1>

      {!loading && trip && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TripDetail trip={trip} />
          <BookingSidebar trip={trip} />
        </div>
      )}
    </main>
  );
};

export default TripProcess;
