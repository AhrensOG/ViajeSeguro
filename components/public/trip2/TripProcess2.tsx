"use client";

import React, { useEffect, useState } from "react";
import TripDetail2 from "./TripDetail2";
import BookingSidebar2 from "./BookingSidebar2";
import { useSearchParams } from "next/navigation";
import { getTripForDetail } from "@/lib/api/trip";
import { Trip } from "@/lib/shared/types/trip-service-type.type";
import NotFoundMessage from "@/lib/client/components/NotFoundMessage";
import TripProcessFallback from "@/lib/client/components/fallbacks/trip/TripProcessFallback";
import { formatFullDate } from "@/lib/functions";
import { TripOptionsProvider } from "@/components/public/trip/auxiliarComponents/TripOptionsContext";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const TripProcess2 = () => {
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
                const tripData = await getTripForDetail(id);

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
        return <NotFoundMessage message="No se encontró ningún viaje relacionado" actionHref="/home2" actionLabel="Volver" />;
    }

    return (
        <TripOptionsProvider>
            <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link 
                        href="/home2"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Volver a la búsqueda</span>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-2xl font-bold text-gray-900 capitalize">
                        {trip?.departure && trip?.originalTimeZone 
                            ? formatFullDate(trip?.departure, trip?.originalTimeZone) 
                            : "Reserva tu viaje"}
                    </h1>
                </motion.div>

                {!loading && trip && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <TripDetail2 trip={trip} />
                        <BookingSidebar2 trip={trip} />
                    </div>
                )}
            </main>
        </TripOptionsProvider>
    );
};

export default TripProcess2;
