"use client";
import NavBar from "../navigation/NavBar";
import Header from "./auxiliarComponents/Header";
import RentalSummary from "./auxiliarComponents/RentalSummary";
import ReservationDetails from "./auxiliarComponents/ReservationDetails";
import ReservationInfo from "./auxiliarComponents/ReservationInfo";
import VehicleDetails from "./auxiliarComponents/VehicleDetails";

export default function PurchaseVehicleOffer() {
    return (
        <main>
            <NavBar shadow={true} />
            <Header />
            <div className="flex justify-center gap-8">
                <section className="flex flex-col items-center justify-center gap-3 m-8 mt-5 w-[55rem]">
                    <VehicleDetails />
                    <ReservationDetails />
                    <ReservationInfo />
                    <button className="w-full bg-transparent border border-custom-golden-600 text-custom-golden-600 font-bold text-lg rounded-md p-4 shadow-sm hover:bg-custom-golden-600 hover:text-custom-white-100 transition-colors duration-300">
                        Contactar con Viaje Seguro
                    </button>
                </section>
                <RentalSummary />
            </div>
        </main>
    );
}
