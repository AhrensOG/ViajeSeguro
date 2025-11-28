import PurchasePage from "@/components/public/purchase/PurchasePage";
import React from "react";

import { Suspense } from "react";

const Purchase = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PurchasePage />
    </Suspense>
  );
};

export default Purchase;
