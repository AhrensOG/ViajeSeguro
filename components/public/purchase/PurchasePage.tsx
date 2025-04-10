"use client";

import React, { Suspense } from "react";
import NavBar from "../navigation/NavBar";
import PurchaseProcess from "./auxiliarComponents/PurchaseProcess";
import Footer from "../navigation/Footer";
import PurchaseProcessFallback from "@/lib/client/components/fallbacks/purchase/PurchaseProcessFallback";

const PurchasePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Suspense fallback={<PurchaseProcessFallback />}>
        <PurchaseProcess />
      </Suspense>
      <Footer />
    </div>
  );
};

export default PurchasePage;
