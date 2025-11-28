import RiderRequestPage from "@/components/public/rider-request/RiderRequestPage";

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RiderRequestPage />
    </Suspense>
  );
}
