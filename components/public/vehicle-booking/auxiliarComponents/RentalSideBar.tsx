"use client";

import { Calendar1Icon, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AuthRequiredModal from "./AuthRequireModal";
import { VehicleOfferWithVehicle } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { useSession } from "next-auth/react";
import { getDiscountByUserId } from "@/lib/api/trip";

const IVA = Number(process.env.NEXT_PUBLIC_IVA || 21);

interface RentalSidebarProps {
    vehicleOffer: VehicleOfferWithVehicle;
    selectedStart?: Date;
    selectedEnd?: Date;
}

const toUTCDay = (d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

const diffDaysInclusive = (start: Date, end: Date) => {
    const s = toUTCDay(start).getTime();
    const e = toUTCDay(end).getTime();
    const ms = e - s;
    if (ms < 0) return 0;
    return Math.floor(ms / 86_400_000);
};

const RentalSidebar = ({ vehicleOffer, selectedStart, selectedEnd }: RentalSidebarProps) => {
    const [referral, setReferral] = useState("");
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const basePrice = vehicleOffer.pricePerDay;

    const days = useMemo(() => {
        if (!selectedStart || !selectedEnd) return 0;
        return diffDaysInclusive(selectedStart, selectedEnd);
    }, [selectedStart, selectedEnd]);

    const total = useMemo(() => basePrice * days, [basePrice, days]);
    const iva = useMemo(() => total * (IVA / 100), [total]);
    const final = useMemo(() => total + iva, [total, iva]);

    useEffect(() => {
        const fetchDiscounts = async () => {
            if (!session) return;
            const res = await getDiscountByUserId();
            if (res) setReferral(res.id);
        };
        fetchDiscounts();
    }, [session]);

    const handleBookingClick = () => {
        if (!selectedStart || !selectedEnd) return; // safety
        if (!vehicleOffer || !vehicleOffer.id) {
            setShowModal(true);
            return;
        }
        const startISO = selectedStart.toISOString();
        const endISO = selectedEnd.toISOString();

        router.push(
            `/purchase?id=${vehicleOffer.id}` +
                `&type=vehicle` +
                `${referral ? `&referral=${referral}` : ""}` +
                `&start=${encodeURIComponent(startISO)}` +
                `&end=${encodeURIComponent(endISO)}`
        );
    };

    const canPay = selectedStart && selectedEnd && days > 0;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="space-y-4">
            <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300 my-8">
                <h2 className="text-xl font-bold text-custom-black-900 mb-4 capitalize">Resumen de tu alquiler</h2>

                <div className="flex flex-col gap-3">
                    <p className="text-base font-medium text-custom-black-700 flex justify-between">
                        Modelo:<span>{vehicleOffer.vehicle?.model}</span>
                    </p>
                    <p className="text-base font-medium text-custom-black-700 flex justify-between">
                        Marca:<span>{vehicleOffer.vehicle?.brand}</span>
                    </p>
                    <p className="text-base font-medium text-custom-black-700 flex justify-between">
                        Días de alquiler:<span>{days || "Selecciona fechas"}</span>
                    </p>
                    <p className="text-base font-medium text-custom-black-700 flex justify-between">
                        Precio por día:<span>{basePrice.toFixed(2).replace(".", ",")} €</span>
                    </p>
                </div>

                <div className="border-t border-b border-custom-gray-300 py-4 my-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Importe</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <span className="text-xl font-semibold text-custom-black-800">{(canPay ? total : 0).toFixed(2).replace(".", ",")} €</span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">IVA ({IVA}%)</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <span className="text-xl font-semibold text-custom-black-800">{(canPay ? iva : 0).toFixed(2).replace(".", ",")} €</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Importe Final</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <span className="text-2xl font-bold text-custom-black-800">{(canPay ? final : 0).toFixed(2).replace(".", ",")} €</span>
                    </div>
                </div>

                <motion.div whileHover={{ scale: canPay ? 1.02 : 1 }} whileTap={{ scale: canPay ? 0.96 : 1 }}>
                    <button
                        onClick={handleBookingClick}
                        disabled={!canPay}
                        className={`w-full py-4 mt-4 rounded-lg flex items-center justify-center
              ${
                  canPay
                      ? "bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100"
                      : "bg-custom-gray-300 text-custom-gray-600 cursor-not-allowed"
              }`}
                    >
                        <Calendar1Icon size={16} className="mr-2" />
                        Ir a pagar
                    </button>
                </motion.div>
            </div>

            <AuthRequiredModal show={showModal} onClose={() => setShowModal(false)} onConfirm={handleBookingClick} />
        </motion.div>
    );
};

export default RentalSidebar;
