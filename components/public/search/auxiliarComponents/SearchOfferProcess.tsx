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
    const capacity = Number(searchParams.get("capacity") || 1);
    const vehicleOfferType = searchParams.get("serviceType") || "WITH_DRIVER";
    const availableFrom = searchParams.get("departure") || "";
    const availableTo = searchParams.get("return") || "";
    const [invalidParams, setInvalidParams] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!availableFrom || !availableTo || !capacity) {
                setInvalidParams(true);
                setLoading(false);
                return;
            }

            try {
                const data = await searchVehicleOffers({
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
                        requestedStartDate: availableFrom,
                        requestedEndDate: availableTo,
                        requestedOfferType: vehicleOfferType,
                        requestedCapacity: capacity,
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
            <div className="flex flex-col lg:flex-row justify-between lg:justify-center gap-8">
                <div className="w-full lg:w-[40%] xl:w-[25rem] hidden lg:block">{offerSelected && <CardInformationLeft {...offerSelected} />}</div>

                <section className="flex flex-col items-start gap-4 w-full lg:w-[60%] xl:w-[60rem]">
                    <div className="flex flex-col gap-2 w-full">
                        <h1 className="text-custom-gray-800 text-2xl xl:text-4xl font-bold">Furgonetas disponibles en Valencia</h1>
                        {invalidParams ? (
                            <p className="text-custom-red-600 text-sm mt-6">
                                Faltan datos para realizar la búsqueda. Verifica que hayas seleccionado fecha de recogida, devolución y capacidad.
                            </p>
                        ) : loading ? (
                            <p className="text-custom-gray-600 text-sm">Buscando ofertas...</p>
                        ) : offers.length > 0 ? (
                            <p className="text-custom-gray-600 text-sm">Encontramos {offers.length} furgonetas para tus fechas</p>
                        ) : (
                            <p className="text-custom-gray-600 text-sm">No se encontraron coincidencias con los filtros actuales.</p>
                        )}
                    </div>

                    <div className="w-full mx-auto px-4 space-y-4">
                        {!invalidParams &&
                            !loading &&
                            offers.map((offer) => <CardReservation key={offer.id} {...offer} onClick={() => setOfferSelected(offer)} />)}
                    </div>
                </section>
            </div>
        </div>
    );
}
