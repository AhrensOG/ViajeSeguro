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
    prepaidExtraMileage?: number;
}

const PurchaseVehicleSummary = ({ vehicleOffer, start, end, originalTimeZone, prepaidExtraMileage = 0 }: PurchaseVehicleSummaryProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const IVA_RATE = 0.21;

    const from = DateTime.fromISO(start || vehicleOffer.availableFrom).setZone(originalTimeZone);
    const to = DateTime.fromISO(end || vehicleOffer.availableTo).setZone(originalTimeZone);
    const totalDays = Math.max(1, Math.ceil(to.diff(from, "days").days));
    
    const basePricePerDay = vehicleOffer.pricePerDay;
    const dailyMileageLimit = vehicleOffer.dailyMileageLimit || 200;
    const extraKmPrice = 0.30;
    
    const basePrice = basePricePerDay * totalDays;
    const extraKmCost = prepaidExtraMileage * extraKmPrice;
    const subtotal = basePrice + extraKmCost;
    const ivaAmount = subtotal * IVA_RATE;
    const totalWithIVA = subtotal + ivaAmount;
    
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
                            <span>{basePricePerDay.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Días de alquiler:</span>
                            <span>{totalDays}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Km incluidos:</span>
                            <span>{dailyMileageLimit} km/día ({dailyMileageLimit * totalDays} km total)</span>
                        </div>

                        {prepaidExtraMileage > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Km extra pre-contratados ({prepaidExtraMileage} km):</span>
                                <span>+{extraKmCost.toFixed(2).replace(".", ",")} €</span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span>Precio base (sin IVA):</span>
                            <span>{subtotal.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between">
                            <span>IVA ({(IVA_RATE * 100).toFixed(0)}%):</span>
                            <span>{ivaAmount.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{totalWithIVA.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between bg-amber-50 -mx-2 px-2 py-1 rounded">
                            <span className="font-medium">Fianza (devuelta al final):</span>
                            <span className="font-medium">{deposit.toFixed(2).replace(".", ",")} €</span>
                        </div>

                        <div className="flex justify-between font-bold text-custom-black-800 mt-2 pt-2 border-t border-gray-300">
                            <span>Total (incluye fianza):</span>
                            <span>{totalWithIvaAndDeposit.toFixed(2).replace(".", ",")} €</span>
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-blue-700 space-y-1">
                            <p className="font-semibold">Información importante:</p>
                            <p>• Km adicionales post-pago: 0,50 €/km</p>
                            <p>• La fianza se devuelve al entregar el vehículo sin daños</p>
                            <p>• Incluye seguro básico</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PurchaseVehicleSummary;
