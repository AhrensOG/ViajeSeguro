"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ClientTripRouteCompactType } from "@/lib/client/trip/types/trip.types";
import TripRouteCompact from "@/lib/client/components/TripRouteCompact";
import { motion, AnimatePresence } from "framer-motion";
import { PriceDetails } from "@/lib/api/reservation/reservation.types";

const DISCOUNT_LABELS: Record<string, string> = {
    PREFERENCIAL: "Cliente Preferencial",
    CLUB_LEALTAD: "Club Lealtad",
    CLUB_FIDELIDAD: "Club Fidelidad",
};

type Props = {
    dateLabel: string;
    price: number;
} & ClientTripRouteCompactType & {
        priceDetails?: PriceDetails | null;
    };

const PurchaseTripSummary = ({
    dateLabel,
    price,
    departureTime,
    duration,
    arrivalTime,
    originCity,
    originLocation,
    destinationCity,
    destinationLocation,
    size = "md",
    priceDetails,
}: Props) => {
    const [showDetails, setShowDetails] = useState(false);
    const IVA = process.env.NEXT_PUBLIC_IVA || 0;
    const hasDiscounts = priceDetails && priceDetails.discounts.length > 0;
    const finalPrice = (priceDetails?.finalPrice ?? price) * (1 + Number(IVA) / 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 rounded-md bg-custom-white-100 shadow-md border-2 border-custom-gray-300 w-full"
        >
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-medium text-custom-black-800">Resumen de tu viaje</h2>
                <div className="text-2xl font-bold text-custom-black-800">{finalPrice.toFixed(2).replace(".", ",")} €</div>
            </div>

            <div className="mb-4">
                <div className="inline-block px-2 py-1 rounded-md bg-custom-golden-100 text-custom-golden-700 border border-custom-golden-500 text-sm">
                    {dateLabel}
                </div>
            </div>

            <TripRouteCompact
                departureTime={departureTime}
                duration={duration}
                arrivalTime={arrivalTime}
                originCity={originCity}
                originLocation={originLocation}
                destinationCity={destinationCity}
                destinationLocation={destinationLocation}
                size={size}
            />

            <button
                onClick={() => setShowDetails((prev) => !prev)}
                className="flex items-center justify-between w-full text-sm text-custom-gray-700 mt-4 hover:text-custom-black-800 transition"
                aria-expanded={showDetails}
                aria-controls="cost-details"
            >
                <span>{showDetails ? "Ocultar detalles del coste" : "Ver detalles del coste"}</span>
                <motion.div animate={{ rotate: showDetails ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={18} />
                </motion.div>
            </button>

            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        id="cost-details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden mt-2 text-sm text-custom-gray-600 space-y-1"
                    >
                        <div className="flex justify-between">
                            <span>Precio base:</span>
                            <span>{price.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        {hasDiscounts &&
                            priceDetails?.discounts.map((discount) => {
                                const label = DISCOUNT_LABELS[discount.key] || discount.description;
                                return (
                                    <div className="flex justify-between" key={discount.key}>
                                        <span className="text-custom-gray-700">{label}</span>
                                        <span className="text-custom-golden-700 font-semibold">
                                            -{discount.amount.toFixed(2).replace(".", ",")} €
                                        </span>
                                    </div>
                                );
                            })}

                        <div className="flex justify-between">
                            <span>Gastos de gestión:</span>
                            <span>0,00 €</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>{finalPrice.toFixed(2).replace(".", ",")} €</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PurchaseTripSummary;
