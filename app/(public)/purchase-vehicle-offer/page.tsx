import type { Metadata } from "next";
import VehicleBookingPage from "@/components/public/vehicle-booking/VehicleBookingPage";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Confirmar compra",
  robots: { index: false, follow: false },
};

export default function PurchaseVehicleOfferPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <VehicleBookingPage />
        </Suspense>
    );
}
