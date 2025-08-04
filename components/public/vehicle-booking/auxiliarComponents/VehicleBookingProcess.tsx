"use client";

import { useSearchParams } from "next/navigation";
import Header from "./Header";
import ReservationDetails from "./ReservationDetails";
import ReservationInfo from "./ReservationInfo";
import VehicleDetails from "./VehicleDetails";
import { useEffect, useState } from "react";
import RentalSidebar from "./RentalSummary";
import { VehicleOfferWithVehicle } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { fetchOffer } from "@/lib/api/vehicle-booking";
import Link from "next/link";
import { convertUTCToLocalDate } from "@/lib/functions";

export default function VehicleBookingProcess() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [vehicleOffer, setVehicleOffer] = useState<VehicleOfferWithVehicle | null>(null);

    useEffect(() => {
        if (!id) return;

        const getOffer = async () => {
            try {
                const res = await fetchOffer(id);
                setVehicleOffer(res);
            } catch (error) {
                console.error("Error fetching offer:", error);
            }
        };

        getOffer();
    }, [id]);

    return (
        <main className="flex-1 w-full mx-auto py-8">
            {vehicleOffer && vehicleOffer.vehicle ? (
                <div className="flex flex-col  items-center justify-center w-full">
                    <Header
                        subTitle={`${vehicleOffer.vehicle.brand} ${vehicleOffer.vehicle.model} ${vehicleOffer.vehicle.year} - ${convertUTCToLocalDate(
                            vehicleOffer.availableFrom,
                            vehicleOffer.originalTimeZone
                        )} - ${convertUTCToLocalDate(vehicleOffer.availableTo, vehicleOffer.originalTimeZone)}`}
                    />
                    <div className="flex flex-col md:flex-row w-full justify-center gap-8 grow-1">
                        <section className="flex flex-col items-center justify-center gap-3 m-8 mt-5 md:w-[55rem]">
                            <VehicleDetails {...vehicleOffer.vehicle} />
                            <ReservationDetails
                                serviceType={vehicleOffer.vehicleOfferType}
                                withdrawLocation={vehicleOffer.withdrawLocation}
                                dateStart={vehicleOffer.availableFrom}
                                dateEnd={vehicleOffer.availableTo}
                                originalTimeZone={vehicleOffer.originalTimeZone}
                            />
                            <ReservationInfo />
                            <Link
                                href={"https://wa.me/34624051168"}
                                target="_blank"
                                className="w-full text-center bg-transparent border border-custom-golden-600 text-custom-golden-600 font-bold text-lg rounded-md p-4 shadow-sm hover:bg-custom-golden-600 hover:text-custom-white-100 transition-colors duration-300"
                            >
                                Contactar con Viaje Seguro
                            </Link>
                        </section>
                        <RentalSidebar vehicleOffer={vehicleOffer} />
                    </div>{" "}
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-custom-black-800">No se pudo cargar la información del vehículo</h2>
                </div>
            )}
        </main>
    );
}
