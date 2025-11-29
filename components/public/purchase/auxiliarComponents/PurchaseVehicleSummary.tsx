"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { VehicleOfferWithVehicle } from "@/lib/api/vehicle-booking/vehicleBooking.types";

interface PurchaseVehicleSummaryProps {
    vehicleOffer: VehicleOfferWithVehicle;
    start: string;
    end: string;
    originalTimeZone: string;
}

const PurchaseVehicleSummary = ({ vehicleOffer, start, end, originalTimeZone }: PurchaseVehicleSummaryProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const IVA_RATE = 0.21;

    const from = DateTime.fromISO(start || vehicleOffer.availableFrom).setZone(originalTimeZone);
    const to = DateTime.fromISO(end || vehicleOffer.availableTo).setZone(originalTimeZone);
    const totalDays = Math.max(1, Math.ceil(to.diff(from, "days").days));
    const basePrice = vehicleOffer.pricePerDay * totalDays;
    const totalWithIVA = basePrice * (1 + IVA_RATE);
    const ivaAmount = totalWithIVA - basePrice;
    // Fianza: usar valor real si está presente; fallback 600 mientras tanto
    const deposit = typeof vehicleOffer.depositAmount === "number" ? vehicleOffer.depositAmount : 600;
    const totalWithIvaAndDeposit = totalWithIVA + deposit;

    const dateLabel = from.setLocale("es").toFormat("ccc, dd 'de' LLLL");
    const departureTime = from.toFormat("HH:mm");
    const arrivalTime = to.toFormat("HH:mm");
    const durationInMinutes = to.diff(from, "minutes").minutes;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = Math.round(durationInMinutes % 60);
    const duration = `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 rounded-md bg-custom-white-100 shadow-md border-2 border-custom-gray-300 w-full"
        >
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-medium text-custom-black-800">Resumen de tu alquiler</h2>
                <div className="text-2xl font-bold text-custom-black-800">{totalWithIvaAndDeposit.toFixed(2).replace(".", ",")} €</div>
            </div>

            <div className="mb-4">
                <div className="inline-block px-2 py-1 rounded-md bg-custom-golden-100 text-custom-golden-700 border border-custom-golden-500 text-sm">
                    {dateLabel}
                </div>
            </div>

            <div className="space-y-1 text-custom-gray-700">
                <p>
                    <strong>Retiro:</strong> {vehicleOffer.withdrawLocation} — {departureTime}
                </p>
                <p>
                    <strong>Devolución:</strong> {vehicleOffer.returnLocation} — {arrivalTime}
                </p>
                <p>
                    <strong>Duración:</strong> {duration}
                </p>
                <p>
                    <strong>Vehículo:</strong> {vehicleOffer?.vehicle?.brand || ""} {vehicleOffer?.vehicle?.model || ""}
                </p>
            </div>

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
                            <span>Precio por día:</span>
                            <span>{vehicleOffer.pricePerDay.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Días de alquiler:</span>
                            <span>{totalDays}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Precio base (sin IVA):</span>
                            <span>{basePrice.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between">
                            <span>IVA ({(IVA_RATE * 100).toFixed(0)}%):</span>
                            <span>{ivaAmount.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Fianza:</span>
                            <span>{deposit.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between font-medium">
                            <span>Total (incluye fianza):</span>
                            <span>{totalWithIvaAndDeposit.toFixed(2).replace(".", ",")} €</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PurchaseVehicleSummary;
