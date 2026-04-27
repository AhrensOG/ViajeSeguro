"use client";

import NavBar from "@/components/public/navigation/NavBar";
import Footer from "../navigation/Footer";
import TripProcess from "./auxiliarComponents/TripProcess";
import { Suspense } from "react";
import TripProcessFallback from "@/lib/client/components/fallbacks/trip/TripProcessFallback";
import AuthPromptModal from "@/components/common/AuthPromptModal";

const TripPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Suspense fallback={<TripProcessFallback />}>
        <TripProcess />
      </Suspense>
      <Footer />
      <AuthPromptModal delay={2} />
    </div>
  );
};

export default TripPage;
