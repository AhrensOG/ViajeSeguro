"use client";

import { Calendar1Icon, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { calculateTotalDays } from "@/lib/functions";
import AuthRequiredModal from "./AuthRequireModal";
import { VehicleOfferWithVehicle } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { useSession } from "next-auth/react";
import { getDiscountByUserId } from "@/lib/api/trip";

const IVA = Number(process.env.NEXT_PUBLIC_IVA || 21);

interface RentalSidebarProps {
    vehicleOffer: VehicleOfferWithVehicle;
}

const RentalSidebar = ({ vehicleOffer }: RentalSidebarProps) => {
    const [referral, setReferral] = useState("");
    const { data: session } = useSession();

    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const basePrice = vehicleOffer.pricePerDay;
    const days = calculateTotalDays(vehicleOffer.availableFrom, vehicleOffer.availableTo);
    const total = basePrice * days;
    const iva = total * (IVA / 100);
    const final = total + iva;

    useEffect(() => {
        const fetchDiscounts = async () => {
            if (!session) return;
            const res = await getDiscountByUserId();
            if (res) {
                setReferral(res?.id);
            }
        };
        fetchDiscounts();
    }, [session]);

    const handleBookingClick = () => {
        if (!vehicleOffer || !vehicleOffer.id) {
            setShowModal(true);
        } else {
            router.push(`/purchase?id=${vehicleOffer.id}/&referral=${referral}&&type=vehicle`);
        }
    };

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
                        Días de alquiler:<span>{days}</span>
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
                        <span className="text-xl font-semibold text-custom-black-800">{total.toFixed(2).replace(".", ",")} €</span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">IVA ({IVA}%)</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <span className="text-xl font-semibold text-custom-black-800">{iva.toFixed(2).replace(".", ",")} €</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Importe Final</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <span className="text-2xl font-bold text-custom-black-800">{final.toFixed(2).replace(".", ",")} €</span>
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                    <button
                        onClick={handleBookingClick}
                        className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 py-4 mt-4 rounded-lg flex items-center justify-center"
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
