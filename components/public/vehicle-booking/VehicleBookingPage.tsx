"use client";
import { Suspense } from "react";
import NavBar from "../navigation/NavBar";
import { Footer } from "react-day-picker";
import TripProcessFallback from "@/lib/client/components/fallbacks/trip/TripProcessFallback";
import VehicleBookingProcess from "./auxiliarComponents/VehicleBookingProcess";

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
