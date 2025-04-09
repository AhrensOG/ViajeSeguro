import React, { useEffect, useState } from "react";
import TripDetail from "./TripDetail";
import BookingSidebar from "./BookingSidebar";
import { useSearchParams } from "next/navigation";
import { getTripById } from "@/lib/api/trip";
import Link from "next/link";
import Image from "next/image";
import { Trip } from "@/lib/shared/types/trip-service-type.type";

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
      } catch (err: any) {
        console.log("Error al cargar el viaje:", err);
        setError(err.message || "Error al obtener el viaje");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-custom-black-800 mb-6">
        Domingo, 6 de abril
      </h1>

      {loading && <p className="text-gray-500">Cargando viaje...</p>}
      {error && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Image
            src="/trip/not_found_trip.webp"
            alt="No se encontró el viaje"
            width={256}
            height={256}
          />
          <p className="text-lg text-center text-gray-700 font-medium">
            No se encontró ningún viaje relacionado
          </p>
          <Link
            href="/"
            className="bg-custom-golden-500 hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow">
            Volver a buscar
          </Link>
        </div>
      )}
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
