"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getReservationsByUser } from "@/lib/api/reservation";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import ReservationCard from "./auxiliarComponents/ReservationCard";
import { toast } from "sonner";
import ReservationCardFallback from "@/lib/client/components/reservations/ReservationCardFallback";
import ReservationVehicleCard from "./auxiliarComponents/ReservationVehicleCard";
import { getVehicleBookingsForProfile } from "@/lib/api/vehicle-booking";
import { ResponseForProfilePage } from "@/lib/api/vehicle-booking/vehicleBooking.types";

const ReservationsPage = () => {
    const { data: session } = useSession();
    const [reservations, setReservations] = useState<ReservationResponse[]>([]);
    const [vehicleBookings, setVehicleBookings] = useState<ResponseForProfilePage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = useCallback(async () => {
        if (!session?.user?.id) return;
        try {
            const data = await getReservationsByUser(session.user.id);
            const vehicleBookings = await getVehicleBookingsForProfile(session.user.id);

            setVehicleBookings(vehicleBookings as ResponseForProfilePage[]);
            setReservations(data);
        } catch (error) {
            console.log("Error al obtener reservas:", error);
            toast.info("¡Ups! Ocurrió un error al obtener tus reservas.", {
                description: "Intenta recargando la pagina o contacta con el soporte",
            });
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    return (
        <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
            <div className="w-full flex flex-col justify-start items-start">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Mis reservas</h1>
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
                            Recuerda que es obligatorio presentar un documento que acredite tu identidad al momento del viaje. En caso de no hacerlo,
                            tu reserva podría ser cancelada. Esta medida busca garantizar la seguridad de todos los pasajeros.
                        </p>
                    </div>
                    {reservations.map((reservation, idx) => (
                        <ReservationCard key={`res-${reservation.id || idx}`} reservation={reservation} />
                    ))}
                    {vehicleBookings.map((vehicleBooking, idx) => (
                        <ReservationVehicleCard 
                            key={`vb-${vehicleBooking.id || idx}`} 
                            vehicleBooking={vehicleBooking} 
                            onBookingUpdate={fetchReservations}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;
