"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AdminSideBar from "./sidebar/AdminSideBar";
import UsersPanel from "./users/UsersPanel";
import ReservationPanel from "./reservations/ReservationsPanel";
import PaymentsPanel from "./payments/PaymentsPanel";
import TripsPanel from "./trips/TripsPanel";
import VehiclesPanel from "./vehicles/VehiclesPanel";
import VehicleOfferPanel from "./vehicle-offer/VehicleOfferPanel";
import VehicleBookingPanel from "./vehicle-booking/VehicleBookingPanel";

export default function AdminPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sec = searchParams.get("sec") || "usuarios";

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
            case "ofertas-furgonetas":
                return <VehicleOfferPanel />;
            case "reservas-furgonetas":
                return <VehicleBookingPanel />;
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
            />
            <div className="grow p-4 pb-0 overflow-auto">{renderSection()}</div>
        </main>
    );
}
