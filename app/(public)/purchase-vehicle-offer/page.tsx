import VehicleBookingPage from "@/components/public/vehicle-booking/VehicleBookingPage";

import { Suspense } from "react";

export default function PurchaseVehicleOfferPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <VehicleBookingPage />
        </Suspense>
    );
}
