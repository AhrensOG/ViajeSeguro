import TripPage from "@/components/public/trip/TripPage";
import React from "react";

import { Suspense } from "react";

const Trip = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TripPage />
    </Suspense>
  );
};

export default Trip;
