import type { Metadata } from "next";
import TripPage2 from "@/components/public/trip2/TripPage2";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Detalles del viaje",
  description:
    "Información completa del viaje compartido: ruta, horarios, precio y plazas disponibles. Reserva tu plaza en ViajeSeguro.",
  robots: { index: false, follow: true },
};

export default function Trip2() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <TripPage2 />
    </Suspense>
  );
}
