"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSideBar from "./sidebar/AdminSideBar";
import UsersPanel from "./users/UsersPanel";
import ReservationPanel from "./reservations/ReservationsPanel";
import PaymentsPanel from "./payments/PaymentsPanel";
import TripsPanel from "./trips/TripsPanel";
import VehiclesPanel from "./vehicles/VehiclesPanel";
import CitiesPanel from "./cities/CitiesPanel";
import VehicleOfferPanel from "./vehicle-offer/VehicleOfferPanel";
import VehicleBookingPanel from "./vehicle-booking/VehicleBookingPanel";
import StatisticsPanel from "./stats/StatisticsPanel";
import ReferralsPanel from "./referrals/ReferralsPanel";
import { getAllReservations } from "@/lib/api/admin/reservation/intex";
import { fetchVehicleBookingsAdmin } from "@/lib/api/admin/vehicle-bookings/index";

export default function AdminPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sec = searchParams.get("sec") || "usuarios";

    const [pendingCounts, setPendingCounts] = useState({ reservas: 0, reservasFurgonetas: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [reservations, vehicleBookings] = await Promise.all([
                    getAllReservations(),
                    fetchVehicleBookingsAdmin(),
                ]);
                const pendingReservations = Array.isArray(reservations)
                    ? reservations.filter((r: { status: string }) => r.status === "PENDING").length
                    : 0;
                const pendingVehicleBookings = Array.isArray(vehicleBookings)
                    ? vehicleBookings.filter((r: { status: string }) => r.status === "PENDING").length
                    : 0;
                setPendingCounts({ reservas: pendingReservations, reservasFurgonetas: pendingVehicleBookings });
            } catch {
                // Si falla el fetch, simplemente no mostramos badges
            }
        };
        fetchCounts();
    }, [sec]);

    const renderSection = () => {
        switch (sec) {
            case "usuarios":
                return <UsersPanel />;
            case "reservas":
                return <ReservationPanel />;
            case "pagos":
                return <PaymentsPanel />;
            case "viajes":
                return <TripsPanel />;
            case "vehiculos":
                return <VehiclesPanel />;
            case "ciudades":
                return <CitiesPanel />;
            case "ofertas-furgonetas":
                return <VehicleOfferPanel />;
            case "reservas-furgonetas":
                return <VehicleBookingPanel />;
            case "estadísticas":
                return <StatisticsPanel />;
            case "referidos":
                return <ReferralsPanel />;
            default:
                return <div className="p-6">Sección no encontrada.</div>;
        }
    };

    return (
        <main className="flex h-screen overflow-hidden">
            <AdminSideBar
                onSelect={(itemName: string) => {
                    const secParam = itemName.toLowerCase();
                    router.push(`?sec=${secParam}`);
                }}
                counts={pendingCounts}
            />
            <div className="grow p-4 pb-0 overflow-auto">{renderSection()}</div>
        </main>
    );
}
