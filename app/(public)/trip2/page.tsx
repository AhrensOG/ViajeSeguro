import TripPage2 from "@/components/public/trip2/TripPage2";
import { Suspense } from "react";

export default function Trip2() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <TripPage2 />
    </Suspense>
  );
}
