import type { Metadata } from "next";
import VehicleBookingPage from "@/components/public/vehicle-booking/VehicleBookingPage";

export const metadata: Metadata = {
  title: "Alquiler de vehículos",
  description:
    "Alquila vehículos con o sin conductor para tus desplazamientos. Reserva tu coche de alquiler con ViajeSeguro.",
  robots: { index: false, follow: true },
};

export default function VehicleBooking() {
    return <VehicleBookingPage />;
}
