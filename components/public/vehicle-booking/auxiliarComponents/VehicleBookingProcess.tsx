"use client";

import { useSearchParams } from "next/navigation";
import Header from "./Header";
import ReservationDetails from "./ReservationDetails";
import ReservationInfo from "./ReservationInfo";
import VehicleDetails from "./VehicleDetails";
import { useEffect, useMemo, useState } from "react";
import RentalSidebar from "./RentalSideBar";
import { VehicleOfferWithVehicle } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { fetchOffer } from "@/lib/api/vehicle-booking";
import Link from "next/link";
import { convertUTCToLocalDate } from "@/lib/functions";

export default function VehicleBookingProcess() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const dateStart = searchParams.get("dateStart");
    const dateEnd = searchParams.get("dateEnd");


    const [vehicleOffer, setVehicleOffer] = useState<VehicleOfferWithVehicle | null>(null);
    const [pickStart, setPickStart] = useState<Date | undefined>(undefined);
    const [pickEnd, setPickEnd] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (!id) return;
        const getOffer = async () => {
            try {
                const res = await fetchOffer(id);
                setVehicleOffer(res);
                // Opcional: limpiar selección al cambiar de oferta
                setPickStart(dateStart ? new Date(dateStart) : undefined);
                setPickEnd(dateEnd ? new Date(dateEnd) : undefined);
            } catch (error) {
                console.error("Error fetching offer:", error);
            }
        };
        getOffer();
    }, [id, dateStart, dateEnd]);

    // Fechas formateadas para el header (con guardas por si vinieran undefined)
    const headerDates = useMemo(() => {
        const from = vehicleOffer?.availableFrom ? convertUTCToLocalDate(vehicleOffer.availableFrom, vehicleOffer.originalTimeZone) : "—";
        const to = vehicleOffer?.availableTo ? convertUTCToLocalDate(vehicleOffer.availableTo, vehicleOffer.originalTimeZone) : "—";
        return `${from} - ${to}`;
    }, [vehicleOffer]);

    return (
        <main className="flex-1 w-full mx-auto py-8">
            {vehicleOffer && vehicleOffer.vehicle ? (
                <div className="flex flex-col items-center justify-center w-full">
                    <Header subTitle={`${vehicleOffer.vehicle.brand} ${vehicleOffer.vehicle.model} ${vehicleOffer.vehicle.year} - ${headerDates}`} />

                    <div className="flex flex-col md:flex-row w-full justify-center gap-8 grow-1">
                        <section className="flex flex-col items-center justify-center gap-3 m-8 mt-5 md:w-[55rem]">
                            <VehicleDetails {...vehicleOffer.vehicle} />

                            {/* Date pickers con huecos libres entre reservas */}
                            <ReservationDetails
                                serviceType={vehicleOffer.vehicleOfferType}
                                withdrawLocation={vehicleOffer.withdrawLocation}
                                originalTimeZone={vehicleOffer.originalTimeZone}
                                availabilityStart={vehicleOffer.availableFrom}
                                availabilityEnd={vehicleOffer.availableTo}
                                bookings={(vehicleOffer.bookings ?? []).map((b) => ({
                                    startDate: b.startDate,
                                    endDate: b.endDate,
                                }))}
                                // Fechas iniciales opcionales para mostrar arriba (si querés, podés omitirlas)
                                dateStart={pickStart ? pickStart.toISOString() : undefined}
                                dateEnd={pickEnd ? pickEnd.toISOString() : undefined}
                                onChangeStart={(d) => setPickStart(d)}
                                onChangeEnd={(d) => setPickEnd(d)}
                            />

                            <ReservationInfo />

                            <Link
                                href="https://wa.me/34624051168"
                                target="_blank"
                                className="w-full text-center bg-transparent border border-custom-golden-600 text-custom-golden-600 font-bold text-lg rounded-md p-4 shadow-sm hover:bg-custom-golden-600 hover:text-custom-white-100 transition-colors duration-300"
                            >
                                Contactar con Viaje Seguro
                            </Link>
                        </section>

                        {/* Sidebar: si necesitás precio, días, etc., ya tenés pickStart/pickEnd */}
                        <RentalSidebar vehicleOffer={vehicleOffer} selectedStart={pickStart} selectedEnd={pickEnd} />
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-custom-black-800">No se pudo cargar la información del vehículo</h2>
                </div>
            )}
        </main>
    );
}
