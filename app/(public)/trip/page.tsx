import type { Metadata } from "next";
import TripPage from "@/components/public/trip/TripPage";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Detalles del viaje",
  description:
    "Información completa del viaje compartido: ruta, horarios, precio y plazas disponibles. Reserva tu plaza en ViajeSeguro.",
  robots: { index: false, follow: true },
};

const Trip = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TripPage />
    </Suspense>
  );
};

export default Trip;
