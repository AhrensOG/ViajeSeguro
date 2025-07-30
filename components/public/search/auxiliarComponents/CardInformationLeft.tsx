import { CardReservationVehicleOfferProps } from "@/lib/api/vehicleOffer/vehicleOffers.types";
import { calculateTotalDays } from "@/lib/functions";
import { CalendarDays, Car, MapPin, Users } from "lucide-react";
import Image from "next/image";

export default function CardInformationLeft(props: CardReservationVehicleOfferProps) {
    const { capacity, whitdrawLocation, dateStart, dateEnd, imageUrl, vehicleOfferType } = props;
    return (
        <section className="flex flex-col items-center justify-between gap-5 xl:w-[25rem] rounded-md mt-5 sticky top-[100px]">
            {/* Imagen */}
            <div className="flex items-center justify-center xl:h-[25rem] w-full rounded-md shadow-md">
                <Image
                    className="rounded-md object-cover w-full h-full"
                    src={`${imageUrl.length > 0 ? imageUrl[0] : "/main/img_placeholder.webp"}`}
                    alt="Imagen alquiler"
                    width={900}
                    height={900}
                />
            </div>

            {/* Detalles */}
            <div className="flex flex-col items-start justify-start gap-2 p-4 w-full border rounded-md border-custom-gray-300">
                <h3 className="text-custom-gray-800 font-bold text-xl">Información del alquiler</h3>
                <div className="space-y-1 text-custom-gray-600 text-sm">
                    <p className="flex items-center gap-2">
                        <MapPin className="size-4 text-custom-gray-500" />
                        Recogida: {whitdrawLocation}
                    </p>
                    <p className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-custom-gray-500" />
                        Duración: {calculateTotalDays(dateStart, dateEnd)} días.
                    </p>
                    <p className="flex items-center gap-2">
                        <Car className="size-4 text-custom-gray-500" />
                        Tipo: {vehicleOfferType === "WITH_DRIVER" ? "Con conductor" : "Sin conductor"}
                    </p>
                    <p className="flex items-center gap-2">
                        <Users className="size-4 text-custom-gray-500" />
                        Hasta {capacity} personas
                    </p>
                </div>
            </div>
        </section>
    );
}
