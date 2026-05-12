import type { Metadata } from "next";
import PurchasePage from "@/components/public/purchase/PurchasePage";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Confirmar compra",
  robots: { index: false, follow: false },
};

const Purchase = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PurchasePage />
    </Suspense>
  );
};

export default Purchase;
