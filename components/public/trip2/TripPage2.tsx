"use client";

import NavBar from "@/components/public/navigation/NavBar";
import Footer from "@/components/public/navigation/Footer";
import TripProcess2 from "./TripProcess2";
import { Suspense } from "react";
import TripProcessFallback from "@/lib/client/components/fallbacks/trip/TripProcessFallback";
import AuthPromptModal from "@/components/common/AuthPromptModal";

const TripPage2 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      <Suspense fallback={<TripProcessFallback />}>
        <TripProcess2 />
      </Suspense>
      <Footer />
      <AuthPromptModal delay={2} />
    </div>
  );
};

export default TripPage2;
