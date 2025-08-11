import { CardReservationVehicleOfferProps } from "@/lib/api/vehicleOffer/vehicleOffers.types";
import { calculateTotalDays } from "@/lib/functions";
import { ArrowRight, Fuel, MapPin, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CardProps extends CardReservationVehicleOfferProps {
    onClick: () => void;
}

// Traducciones de enums
const fuelTypeMap = {
    DIESEL: "Diésel",
    GASOLINE: "Nafta",
    ELECTRIC: "Eléctrico",
    HYBRID: "Híbrido",
} as const;

const transmissionTypeMap = {
    MANUAL: "Manual",
    AUTOMATIC: "Automática",
} as const;

const featuresMap = {
    GPS: "GPS incluido",
    AIR_CONDITIONING: "Aire acondicionado",
    BLUETOOTH: "Bluetooth",
    REAR_CAMERA: "Cámara trasera",
    USB: "Puerto USB",
    PARKING_SENSORS: "Sensores de aparcamiento",
    CRUISE_CONTROL: "Control de crucero",
} as const;

type FuelKey = keyof typeof fuelTypeMap;
type TransmissionKey = keyof typeof transmissionTypeMap;
type FeatureKey = keyof typeof featuresMap;

export default function CardReservation(props: CardProps) {
    const { imageUrl, title, capacity, fuelType, transmissionType, features, whitdrawLocation, dateStart, dateEnd, pricePerDay } = props;

    const formatDate = (input: string): string => {
        const date = new Date(input);
        const yyyy = date.getFullYear();
        const mm = `${date.getMonth() + 1}`.padStart(2, "0");
        const dd = `${date.getDate()}`.padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <article
            className="flex flex-col justify-around gap-5 w-full p-6 border border-custom-gray-300 rounded-xl shadow-sm xl:flex-row cursor pointer"
            onClick={props.onClick}
        >
            <div className="flex items-center justify-center xl:w-[20rem] w-full h-[18rem] relative rounded-md xl:h-full">
                <Image
                    className="rounded-md w-full h-full"
                    src={imageUrl.length > 0 ? imageUrl[0] : "/main/img_placeholder.webp"}
                    alt={title}
                    width={100}
                    height={100}
                />
            </div>
            <div className="flex flex-col gap-3 grow-1 justify-evenly">
                <h3 className="text-custom-gray-800 font-bold text-xl">{title}</h3>
                <div className="flex gap-2">
                    <p className="flex gap-2 items-center text-sm">
                        <Users className="size-4 text-custom-gray-600" />
                        {capacity} personas
                    </p>
                    <p className="flex gap-2 items-center text-sm">
                        <Fuel className="size-4 text-custom-gray-600" />
                        {fuelTypeMap[fuelType as FuelKey] ?? fuelType}
                    </p>
                    <p className="flex gap-2 items-center text-sm">
                        <Settings className="size-4 text-custom-gray-600" />
                        {transmissionTypeMap[transmissionType as TransmissionKey] ?? transmissionType}
                    </p>
                </div>
                <div className="flex flex-wrap gap-1">
                    {features.map((featureKey, idx) => (
                        <p key={idx} className="text-sm bg-custom-gray-300 rounded-full p-2">
                            {featuresMap[featureKey as FeatureKey] ?? featureKey}
                        </p>
                    ))}
                </div>
                <p className="flex items-center gap-2 text-lg">
                    <MapPin className="size-5 text-custom-gray-600" />
                    {whitdrawLocation}
                </p>
            </div>
            <div className="flex flex-col gap-2 w-[18rem] items-end justify-evenly">
                <p className="text-custom-gray-600 text-lg">
                    {formatDate(dateStart)} - {formatDate(dateEnd)}
                </p>
                <p className="text-custom-gray-700 text-3xl font-bold">{"€ " + pricePerDay}</p>
                <p className="text-custom-black-700 text-lg">{`${pricePerDay}€/dia x ${calculateTotalDays(dateStart, dateEnd)} dias`}</p>
                <Link
                    href={`/vehicle-booking?id=${props.id}`}
                    className="py-4 w-[12rem] bg-custom-golden-600 text-custom-white-100 rounded-md text-xl flex gap-3 items-center justify-center cursor-pointer hover:bg-custom-golden-700"
                >
                    Reservar
                    <ArrowRight className="size-5" />
                </Link>
                <p className="text-custom-black-700 text-sm">Cancelación gratuita</p>
            </div>
        </article>
    );
}
