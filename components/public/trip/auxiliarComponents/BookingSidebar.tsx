"use client";

import { motion } from "framer-motion";
import { Calendar1Icon, ChevronDown, ChevronRight } from "lucide-react";
import TripRouteCompact from "../../../../lib/client/components/TripRouteCompact";
import { TripWithPriceDetails } from "@/lib/shared/types/trip-service-type.type";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AuthRequiredModal from "./AuthRequiredModal";
import { BASE_URL } from "@/lib/constants";
import { convertUTCToLocalTime, formatFullDate, getDurationString } from "@/lib/functions";
import { useSession } from "next-auth/react";
import { getDiscountByUserId } from "@/lib/api/trip";
import { useTripOptions } from "./TripOptionsContext";

type BookingSidebarProps = {
    trip: TripWithPriceDetails;
};

const DISCOUNT_LABELS = {
    PREFERENCIAL: "Descuento Promocional",
    CLUB_LEALTAD: "Club Lealtad",
    CLUB_FIDELIDAD: "Club Fidelidad",
};

type DiscountKey = keyof typeof DISCOUNT_LABELS;

const BookingSidebar = ({ trip }: BookingSidebarProps) => {
    const [showModal, setShowModal] = useState(false);
    const [showDiscountDetails, setShowDiscountDetails] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // Frontend: IVA fijo para mostrar precios finales
    const IVA = 21;
    const [referral, setReferral] = useState("");
    const { extraBags } = useTripOptions();
    const EXTRA_BAG_PRICE = 5;

    const departureTime = convertUTCToLocalTime(trip.departure, trip.originalTimeZone);
    const arrivalTime = convertUTCToLocalTime(trip.arrival, trip.originalTimeZone);
    const durationStr = getDurationString(trip.departure, trip.arrival);
    const dateLabel = formatFullDate(trip.departure, trip.originalTimeZone);
    const fullname = `${trip.user.name} ${trip.user.lastName}`;

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

    const handleLoginRedirect = () => {
        const current = `${BASE_URL}${pathname}?${searchParams.toString()}`;
        const encoded = encodeURIComponent(current);
        router.push(`/auth/login?callbackUrl=${encoded}`);
    };

    const handleBookingClick = () => {
        if (!trip.priceDetails) {
            setShowModal(true);
        } else {
            router.push(`/purchase?id=${trip.id}&&referral=${referral}&&type=trip&&extraBags=${extraBags}`);
        }
    };

    const basePrice = trip.basePrice;
    const finalPrice = trip.priceDetails?.finalPrice ?? basePrice;
    const hasDiscounts = !!trip.priceDetails?.discounts?.length;
    // Mostrar promoción del 40% aunque no haya sesión/discounts
    const promoPrice = +(basePrice * 0.6).toFixed(2);
    const displayFinalPrice = hasDiscounts ? finalPrice : promoPrice;
    const extraCost = (extraBags || 0) * EXTRA_BAG_PRICE;
    const effectivePrice = displayFinalPrice + extraCost;
    const ivaAmount = (effectivePrice * IVA) / 100;
    const totalWithIVA = effectivePrice * (1 + IVA / 100);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="space-y-4">
            <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
                <h2 className="text-xl font-bold text-custom-black-900 mb-4 capitalize">{dateLabel}</h2>
                <TripRouteCompact
                    departureTime={departureTime}
                    duration={durationStr}
                    arrivalTime={arrivalTime}
                    originCity={trip.origin}
                    originLocation={trip.originLocation}
                    destinationCity={trip.destination}
                    destinationLocation={trip.destinationLocation}
                    size="md"
                />

                <div className="flex items-center gap-3 mt-4 mb-6">
                    <span className="font-medium">{fullname ?? "Conductor"}</span>
                </div>

                <div className="border-t border-b border-custom-gray-300 py-4 my-4">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Importe</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 line-through">{basePrice.toFixed(2).replace(".", ",")} €</div>
                            <div className="text-xl font-semibold text-custom-black-800">{displayFinalPrice.toFixed(2).replace(".", ",")} €</div>
                        </div>
                    </div>

                    {/* Equipaje adicional */}
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Equipaje adicional</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-custom-gray-600">{extraBags} x {EXTRA_BAG_PRICE.toFixed(2).replace(".", ",")} €</div>
                            <div className="text-base font-semibold text-custom-black-800">{extraCost.toFixed(2).replace(".", ",")} €</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">IVA</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-semibold text-custom-black-800">
                                {ivaAmount.toFixed(2).replace(".", ",")} €
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Importe Final</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 line-through">
                                {((basePrice + extraCost) * (1 + IVA / 100)).toFixed(2).replace(".", ",")} €
                            </div>
                            <div className="text-2xl font-bold text-custom-black-800">
                                {totalWithIVA.toFixed(2).replace(".", ",")} €
                            </div>
                        </div>
                    </div>

                    {hasDiscounts && (
                        <div className="mt-2">
                            <button
                                onClick={() => setShowDiscountDetails((prev) => !prev)}
                                className="text-sm text-custom-golden-700 hover:underline flex items-center gap-1"
                            >
                                Ver detalles de descuentos
                                <ChevronDown size={16} className={`${showDiscountDetails ? "rotate-180" : ""} transition-transform`} />
                            </button>

                            <motion.div
                                initial={false}
                                animate={{
                                    height: showDiscountDetails ? "auto" : 0,
                                    opacity: showDiscountDetails ? 1 : 0,
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden mt-3"
                            >
                                <ul className="space-y-1">
                                    {trip.priceDetails?.discounts.map((discount) => {
                                        const label = DISCOUNT_LABELS[discount.key as DiscountKey] || discount.description;

                                        return (
                                            <li key={discount.key} className="flex items-center justify-between text-sm text-custom-gray-500">
                                                <span className="text-custom-gray-700">{label}</span>
                                                <span className="text-custom-golden-700 font-semibold">
                                                    -{discount.amount.toFixed(2).replace(".", ",")} €
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Nota de equipaje incluido */}
                <p className="mt-2 text-xs text-custom-gray-600">
                    Este viaje incluye 1 equipaje de mano y 1 maleta.
                </p>

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

            {/* Modal para login */}
            <AuthRequiredModal show={showModal} onClose={() => setShowModal(false)} onConfirm={handleLoginRedirect} />
        </motion.div>
    );
};

export default BookingSidebar;
