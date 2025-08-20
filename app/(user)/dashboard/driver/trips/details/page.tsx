"use client";
import TripDetailsPage from "@/components/driver/trips/TripDetailsPage";
import { Suspense } from "react";

export default function TripsDetails() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TripDetailsPage />
        </Suspense>
    );
}
