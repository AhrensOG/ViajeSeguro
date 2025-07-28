"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchTrip, TripCardType, TripServiceType } from "@/lib/shared/types/trip-service-type.type";
import Image from "next/image";
import { toast } from "sonner";
import TripCard from "./TripCard";
import { convertUTCToLocalTime } from "@/lib/functions";
import TripCardFallback from "@/lib/client/components/fallbacks/shared/TripCardFallback";
import { DateTime } from "luxon";
import { searchTrips } from "@/lib/api/trip";
import { ClientSearchFormData } from "@/lib/client/trip/types/search-form.type";

const SearchProcess = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const mode = searchParams.get("mode");

    const [trips, setTrips] = useState<TripCardType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [invalidParams, setInvalidParams] = useState(false);

    const updateSearchParams = (formData: ClientSearchFormData) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(formData).forEach(([key, value]) => {
            if (value) {
                if (value instanceof Date) {
                    const selectedDate = DateTime.fromJSDate(value).setZone(userTimeZone);
                    const now = DateTime.local().setZone(userTimeZone);

                    const dateTimeWithTime = selectedDate.set({
                        hour: now.hour,
                        minute: now.minute,
                        second: now.second,
                    });

                    const isoStringWithTZ = dateTimeWithTime.toISO();

                    if (isoStringWithTZ) {
                        params.set(key, isoStringWithTZ);
                    }
                } else {
                    params.set(key, value);
                }
            } else {
                params.delete(key);
            }
        });

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const departureParam = searchParams.get("departure");
    const departureDate = departureParam ? new Date(departureParam) : new Date();
    const targetDateStr = convertUTCToLocalTime(departureDate.toISOString(), userTimeZone, "yyyy-MM-dd");

    useEffect(() => {
        const fetchTrips = async () => {
            const origin = searchParams.get("origin");
            const destination = searchParams.get("destination");
            const serviceType = (searchParams.get("serviceType") as TripServiceType) || "SIMPLE_TRIP";
            const departure = departureParam || "";

            if (!origin || !destination || !departure) {
                setTrips([]);
                setInvalidParams(true);
                return;
            }

            setInvalidParams(false);
            setIsLoading(true);

            const query: SearchTrip = { origin, destination, serviceType, departure };

            try {
                const data = await searchTrips(query);
                setTrips(data);
            } catch (error) {
                console.log(error);
                toast.info("¡Ups! Ocurrió un error inesperado.", {
                    description: "Intenta nuevamente o contacta con nuestro soporte",
                });
                setTrips([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, [searchParams, departureParam]);

    const tripsOnSameDay = trips.filter((trip) => {
        const localDate = convertUTCToLocalTime(trip.departure, userTimeZone, "yyyy-MM-dd");
        return localDate === targetDateStr;
    });

    const nearbyTrips = trips.filter((trip) => {
        const localDate = convertUTCToLocalTime(trip.departure, userTimeZone, "yyyy-MM-dd");
        return localDate !== targetDateStr;
    });

    return (
        <div>
            <div className="container mx-auto px-4 py-4 flex gap-2 grow h-[calc(100vh-316px)] sm:h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)]">
                <div className="w-1/3 relative rounded-md overflow-hidden hidden lg:block">
                    <Image src="/search/search.jpeg" alt="Map" fill />
                </div>
                <div className="w-full lg:w-2/3 space-y-4 overflow-y-auto scrollbar-none">
                    {isLoading ? (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <TripCardFallback key={i} />
                            ))}
                        </>
                    ) : invalidParams ? (
                        <div className="text-center py-12">
                            <p className="text-lg font-semibold text-custom-gray-700">Faltan datos para buscar viajes.</p>
                            <p className="text-sm text-custom-gray-500 mt-2">
                                Asegúrate de completar el origen, destino y fecha para poder mostrar los resultados.
                            </p>
                        </div>
                    ) : tripsOnSameDay.length === 0 && nearbyTrips.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-lg font-semibold text-custom-gray-700">No se encontraron viajes disponibles para esta fecha.</p>
                            <p className="text-sm text-custom-gray-500 mt-2">
                                Estamos creciendo para ofrecerte cada vez más opciones. Prueba buscar otra fecha cercana o contáctanos si necesitas
                                ayuda.
                            </p>
                        </div>
                    ) : (
                        <>
                            {tripsOnSameDay.length === 0 && nearbyTrips.length > 0 && (
                                <p className="text-sm text-center text-custom-gray-600">
                                    No hay viajes exactos para la fecha seleccionada, pero encontramos estas opciones cercanas:
                                </p>
                            )}

                            {tripsOnSameDay.length > 0 && (
                                <>
                                    {tripsOnSameDay.map((trip) => (
                                        <TripCard key={trip.id} trip={trip} timeZone={userTimeZone} />
                                    ))}
                                </>
                            )}

                            {nearbyTrips.length > 0 && (
                                <div className="mt-10 text-center">
                                    <h2 className="text-base font-semibold text-custom-gray-800 mb-4">Otras opciones en fechas cercanas:</h2>
                                    <div className="space-y-4">
                                        {nearbyTrips.map((trip) => (
                                            <TripCard key={trip.id} trip={trip} timeZone={userTimeZone} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchProcess;
