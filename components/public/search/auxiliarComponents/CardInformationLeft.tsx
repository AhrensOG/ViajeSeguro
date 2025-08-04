"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardReservationVehicleOfferProps } from "@/lib/api/vehicleOffer/vehicleOffers.types";
import { calculateTotalDays } from "@/lib/functions";
import { CalendarDays, Car, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ImagePreviewModal from "@/components/admin/vehicles/auxiliarComponents/ImagePreviewModal";

export default function CardInformationLeft(props: CardReservationVehicleOfferProps) {
    const { capacity, whitdrawLocation, dateStart, dateEnd, imageUrl, vehicleOfferType } = props;
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const images = imageUrl.length > 0 ? imageUrl : ["/main/img_placeholder.webp"];

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <section className="flex flex-col items-center justify-between gap-5 xl:w-[25rem] rounded-md mt-5 sticky top-[100px]">
            {/* Carrusel de imágenes */}
            <div className="relative flex items-center justify-center xl:h-[25rem] w-full rounded-md shadow-md overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={images[currentIndex]}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-full h-full"
                    >
                        <Image
                            className="rounded-md object-cover w-full h-full"
                            src={images[currentIndex]}
                            alt={`Imagen ${currentIndex + 1}`}
                            width={900}
                            height={900}
                            onClick={() => setPreviewImage(images[currentIndex])}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Botones solo si hay más de una imagen */}
                {images.length > 1 ? (
                    <div className="relative flex items-center justify-center xl:h-[25rem] w-full rounded-md shadow-md overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={images[currentIndex]}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="absolute w-full h-full"
                            >
                                <Image
                                    className="rounded-md object-cover w-full h-full"
                                    src={images[currentIndex]}
                                    alt={`Imagen ${currentIndex + 1}`}
                                    width={900}
                                    height={900}
                                />
                            </motion.div>
                        </AnimatePresence>

                        <button
                            onClick={prevImage}
                            className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 shadow"
                        >
                            <ChevronLeft className="size-5 text-gray-700" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 shadow"
                        >
                            <ChevronRight className="size-5 text-gray-700" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center xl:h-[25rem] w-full rounded-md shadow-md">
                        <Image
                            className="rounded-md object-cover w-full h-full"
                            src={images[0]} // placeholder o imagen única
                            alt="Imagen alquiler"
                            width={900}
                            height={900}
                        />
                    </div>
                )}
            </div>

            {/* Detalles del alquiler */}
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
            {/* {previewImage && <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />} */}
        </section>
    );
}
