import ReservationConfirmedPage from "@/components/public/reservation/confirmed/ReservationConfirmedPage";
import { Suspense } from "react";

export default function ReservationConfirmed() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <ReservationConfirmedPage />
    </Suspense>
  );
}
