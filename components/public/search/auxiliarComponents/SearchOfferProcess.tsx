"use client";

import CardInformationLeft from "./CardInformationLeft";
import CardReservation from "./CardReservation";
import { searchVehicleOffers } from "@/lib/api/vehicleOffer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CardReservationVehicleOfferProps } from "@/lib/api/vehicleOffer/vehicleOffers.types";
import TripCardFallback from "@/lib/client/components/fallbacks/shared/TripCardFallback";

export default function SearchOfferProcess() {
    const searchParams = useSearchParams();
    const [offers, setOffers] = useState<CardReservationVehicleOfferProps[]>([]);
    const [offerSelected, setOfferSelected] = useState<CardReservationVehicleOfferProps | null>(null);
    const [loading, setLoading] = useState(true);
    // const withdrawLocation = searchParams.get("origin") || "";
    const capacity = Number(searchParams.get("capacity") || 1);
    const vehicleOfferType = searchParams.get("serviceType") || "WITH_DRIVER";
    const availableFrom = searchParams.get("departure") || "";
    const availableTo = searchParams.get("return") || "";

    useEffect(() => {
        const fetchData = async () => {
            if (!availableFrom || !availableTo) return;

            setLoading(true);
            console.log("Buscando ofertas:", {
                // withdrawLocation,
                capacity,
                vehicleOfferType,
                availableFrom,
                availableTo,
            });

            try {
                const data = await searchVehicleOffers({
                    // withdrawLocation,
                    capacity,
                    vehicleOfferType,
                    availableFrom,
                    availableTo,
                });

                let dataFormated: CardReservationVehicleOfferProps[] = [];
                if (Array.isArray(data)) {
                    dataFormated = data.map((off) => ({
                        id: off.id,
                        imageUrl: off.vehicle.images || [],
                        title: `${off.vehicle.brand} ${off.vehicle.model} ${off.vehicle.year}`,
                        capacity: off.vehicle.capacity,
                        fuelType: off.vehicle.fuelType,
                        transmissionType: off.vehicle.transmissionType,
                        features: off.vehicle.features,
                        whitdrawLocation: off.withdrawLocation,
                        returnLocation: off.returnLocation,
                        dateStart: off.availableFrom,
                        dateEnd: off.availableTo,
                        pricePerDay: off.pricePerDay,
                        vehicleOfferType: off.vehicleOfferType,
                    }));
                }

                setOffers(dataFormated);
            } catch (err) {
                console.error("Error buscando ofertas:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [capacity, vehicleOfferType, availableFrom, availableTo]);

    if (loading) {
        return (
            <div className="grow flex flex-col bg-custom-white-100 relative px-4 lg:px-20 py-10">
                <div className="flex flex-col lg:flex-row justify-between lg:justify-center gap-8">
                    <div className="w-full lg:w-[40%] xl:w-[25rem] hidden lg:block">{/* Fallback para la card izquierda, opcional */}</div>
                    <section className="flex flex-col items-start gap-4 w-full lg:w-[60%] xl:w-[60rem]">
                        <div className="flex flex-col gap-2 w-full">
                            <h1 className="text-custom-gray-800 text-2xl xl:text-4xl font-bold">Furgonetas disponibles en Valencia</h1>
                            <p className="text-custom-gray-600 text-md lg:text-lg">Buscando ofertas...</p>
                        </div>
                        <div className="w-full mx-auto px-4 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <TripCardFallback key={i} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="grow flex flex-col bg-custom-white-100 relative px-4 lg:px-20 py-10">
            {/* Contenedor principal responsive */}
            <div className="flex flex-col lg:flex-row justify-between lg:justify-center gap-8">
                {/* Columna izquierda con info del alquiler */}
                <div className="w-full lg:w-[40%] xl:w-[25rem] hidden lg:block">{offerSelected && <CardInformationLeft {...offerSelected} />}</div>

                {/* Columna derecha con resultados */}
                <section className="flex flex-col items-start gap-4 w-full lg:w-[60%] xl:w-[60rem]">
                    <div className="flex flex-col gap-2 w-full">
                        <h1 className="text-custom-gray-800 text-2xl xl:text-4xl font-bold">Furgonetas disponibles en Valencia</h1>
                        <p className="text-custom-gray-600 text-md lg:text-lg">Encontramos {offers.length} furgonetas para tus fechas</p>
                    </div>
                    <div className="w-full mx-auto px-4 space-y-4">
                        {offers.length > 0 ? (
                            offers.map((offer) => <CardReservation key={offer.id} {...offer} onClick={() => setOfferSelected(offer)} />)
                        ) : (
                            <p className="text-custom-gray-600 text-md lg:text-lg text-center mt-12">No se encontraron ofertas</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
