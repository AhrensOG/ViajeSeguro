"use client";
import { Suspense } from "react";
import NavBar from "../navigation/NavBar";
import SearchOfferProcess from "./auxiliarComponents/SearchOfferProcess";

export default function VehicleOfferSearchPage() {
    return (
        <div className="min-h-screen flex flex-col bg-custom-white-50">
            <NavBar shadow={false} />
            <Suspense fallback={<div className="p-4">Cargando...</div>}>
                <SearchOfferProcess />
            </Suspense>
        </div>
    );
}
