"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Fuel, Settings, Users, ChevronLeft, ChevronRight } from "lucide-react";
import ImagePreviewModal from "@/components/admin/vehicles/auxiliarComponents/ImagePreviewModal";

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
    const imageList = images?.length > 0 ? images : ["/main/img_placeholder.webp"];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const next = () => setCurrentIndex((prev) => (prev + 1) % imageList.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);

    return (
        <article className="flex flex-col md:flex-row justify-between gap-6 w-full md:h-[16rem] m-3 mb-1 p-6 border rounded-md border-custom-gray-300 shadow-sm">
            <div className="flex items-center justify-center md:w-[23rem] h-[13rem] relative rounded-md overflow-hidden">
                {imageList.length > 1 ? (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={imageList[currentIndex]}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="absolute w-full h-full"
                            >
                                <Image
                                    src={imageList[currentIndex]}
                                    alt={`Imagen ${currentIndex + 1}`}
                                    className="rounded-md object-cover w-full h-full cursor-pointer"
                                    width={900}
                                    height={600}
                                    onClick={() => setPreviewImage(imageList[currentIndex])}
                                />
                            </motion.div>
                        </AnimatePresence>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 shadow"
                        >
                            <ChevronLeft className="size-5 text-gray-700" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 shadow"
                        >
                            <ChevronRight className="size-5 text-gray-700" />
                        </button>
                    </>
                ) : (
                    <Image
                        src={imageList[0]}
                        alt="Imagen del vehículo"
                        className="rounded-md object-cover w-full h-full cursor-pointer"
                        fill
                        onClick={() => setPreviewImage(imageList[0])}
                    />
                )}
            </div>

            <div className="flex flex-col gap-3 grow-1 justify-evenly">
                <h2 className="text-custom-gray-800 font-bold text-xl md:text-2xl">{`${brand} ${model} ${year}`}</h2>
                <div className="flex flex-wrap md:flex-nowrap gap-3">
                    <p className="flex gap-2 items-center text-sm md:text-lg">
                        <Users className="size-5 text-custom-gray-600" /> {capacity} personas
                    </p>
                    <p className="flex gap-2 items-center text-sm md:text-lg">
                        <Fuel className="size-5 text-custom-gray-600" /> {fuelTypeMap[fuelType]}
                    </p>
                    <p className="flex gap-2 items-center text-sm md:text-lg">
                        <Settings className="size-5 text-custom-gray-600" /> {transmissionTypeMap[transmissionType]}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 md:gap-6">
                    {features.map((feature, i) => (
                        <p key={i} className="text-sm bg-custom-gray-300 rounded-full p-2">
                            {featuresMap[feature as FeatureKey] ?? feature}
                        </p>
                    ))}
                </div>
            </div>

            {/* Modal para vista previa */}
            {previewImage && <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />}
        </article>
    );
}
