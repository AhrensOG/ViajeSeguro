"use client";

import Image from "next/image";
import { Fuel, Settings, Users } from "lucide-react";

interface VehicleDetailsProps {
    model: string;
    brand: string;
    year: number;
    capacity: number;
    fuelType: "DIESEL" | "GASOLINE" | "ELECTRIC" | "HYBRID";
    transmissionType: "MANUAL" | "AUTOMATIC";
    features: string[];
    images: string[];
}

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

type FeatureKey = keyof typeof featuresMap;

export default function VehicleDetails(props: VehicleDetailsProps) {
    const { model, brand, year, capacity, fuelType, transmissionType, features, images } = props;

    return (
        <article className="flex justify-between gap-6 w-full h-[16rem] m-3 mb-1 p-6 border rounded-md border-custom-gray-300 shadow-sm">
            <div className="flex items-center justify-center w-[23rem] h-[13rem] relative rounded-md">
                <Image className="rounded-md" src={`${images.length > 0 ? images[0] : "/main/img_placeholder.webp"}`} alt="placeholder" fill />
            </div>
            <div className="flex flex-col gap-3 grow-1 justify-evenly">
                <h2 className="text-custom-gray-800 font-bold text-2xl">{`${brand} ${model} ${year}`}</h2>
                <div className="flex gap-3">
                    <p className="flex gap-2 items-center text-lg">
                        <Users className="size-5 text-custom-gray-600" /> {capacity} personas
                    </p>
                    <p className="flex gap-2 items-center text-lg">
                        <Fuel className="size-5 text-custom-gray-600" /> {fuelTypeMap[fuelType]}
                    </p>
                    <p className="flex gap-2 items-center text-lg">
                        <Settings className="size-5 text-custom-gray-600" /> {transmissionTypeMap[transmissionType]}
                    </p>
                </div>
                <div className="flex flex-wrap gap-6">
                    {features.map((feature, i) => (
                        <p key={i} className="text-sm bg-custom-gray-300 rounded-full p-2">
                            {featuresMap[feature as FeatureKey] ?? feature}
                        </p>
                    ))}
                </div>
            </div>
        </article>
    );
}
