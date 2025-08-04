"use client";
import { Suspense } from "react";
import NavBar from "../navigation/NavBar";
import TripProcessFallback from "@/lib/client/components/fallbacks/trip/TripProcessFallback";
import VehicleBookingProcess from "./auxiliarComponents/VehicleBookingProcess";
import Footer from "../navigation/Footer";

export default function VehicleBookingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <Suspense fallback={<TripProcessFallback />}>
                <VehicleBookingProcess />
            </Suspense>
            <Footer />
        </div>
    );
}
