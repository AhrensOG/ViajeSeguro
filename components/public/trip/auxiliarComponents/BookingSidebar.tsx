"use client";

import { motion } from "framer-motion";
import { Calendar1Icon, ChevronDown, ChevronRight, Minus, Plus, Users } from "lucide-react";
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
import { toast } from "sonner";

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
    const IVA = 21;
    const [referral, setReferral] = useState("");
    const { extraBags } = useTripOptions();
    const EXTRA_BAG_PRICE = 5;

    // --- Multiple passengers state ---
    const capacity: number | undefined = (trip as TripWithPriceDetails & { capacity?: number }).capacity;
    const passengersCount: number =
        (trip as TripWithPriceDetails & { passengers?: unknown[]; passengerCount?: number }).passengers?.length ??
        (trip as TripWithPriceDetails & { passengers?: unknown[]; passengerCount?: number }).passengerCount ??
        0;
    const seatsAvailable = typeof capacity === "number" ? Math.max(capacity - passengersCount, 0) : undefined;
    const maxPassengers = seatsAvailable ?? 10;

    const [numPassengers, setNumPassengers] = useState(1);
    const [companionNames, setCompanionNames] = useState<string[]>([]);

    useEffect(() => {
        const savedPassengers = sessionStorage.getItem("tripPassengers");
        const savedNumPassengers = sessionStorage.getItem("tripNumPassengers");
        
        if (savedPassengers) {
            try {
                const parsed = JSON.parse(savedPassengers);
                if (Array.isArray(parsed)) {
                    setCompanionNames(parsed);
                }
            } catch {
                // ignore
            }
        }
        
        if (savedNumPassengers) {
            const parsed = parseInt(savedNumPassengers, 10);
            if (!isNaN(parsed) && parsed > 0) {
                setNumPassengers(parsed);
            }
        }
    }, []);

    useEffect(() => {
        const companions = numPassengers - 1;
        setCompanionNames((prev) => {
            if (prev.length === companions) return prev;
            if (prev.length < companions) return [...prev, ...Array(companions - prev.length).fill("")];
            return prev.slice(0, companions);
        });
    }, [numPassengers]);

    const departureTime = convertUTCToLocalTime(trip.departure, trip.originalTimeZone);
    const arrivalTime = convertUTCToLocalTime(trip.arrival, trip.originalTimeZone);
    const durationStr = getDurationString(trip.departure, trip.arrival);
    const dateLabel = formatFullDate(trip.departure, trip.originalTimeZone);
    const fullname = `${trip.user.name} ${trip.user.lastName}`;

    useEffect(() => {
        const fetchDiscounts = async () => {
            if (!session) return;
            try {
                const res = await getDiscountByUserId();
                if (res) setReferral(res.id);
            } catch {
                // ignore
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
        if (!session) {
            setShowModal(true);
            return;
        }
        if (numPassengers > 1) {
            const filledNames = companionNames.filter((n) => n.trim() !== "").length;
            if (filledNames < numPassengers - 1) {
                toast.error("Debes completar los nombres de todos los pasajeros");
                return;
            }
        }
        const companions = companionNames.filter((n) => n.trim() !== "");
        sessionStorage.setItem("tripPassengers", JSON.stringify(companions));
        sessionStorage.setItem("tripNumPassengers", String(numPassengers));
        router.push(
            `/purchase?id=${trip.id}&&referral=${referral}&&type=trip&&extraBags=${extraBags}&&numPassengers=${numPassengers}`
        );
    };

    const basePrice = trip.basePrice;
    const isAdmin = trip.user.role === "ADMIN";

    let finalPrice = trip.priceDetails?.finalPrice;
    let discounts = trip.priceDetails?.discounts || [];

    if (isAdmin) {
        const adminDiscountAmount = +(basePrice * 0.4).toFixed(2);
        if (!finalPrice || finalPrice === basePrice) {
            finalPrice = +(basePrice - adminDiscountAmount).toFixed(2);
            if (!discounts.some((d) => d.key === "PREFERENCIAL")) {
                discounts = [
                    ...discounts,
                    { key: "PREFERENCIAL", description: "Descuento Promocional", amount: adminDiscountAmount },
                ];
            }
        }
    } else {
        finalPrice = finalPrice ?? basePrice;
    }

    const hasDiscounts = discounts.length > 0;
    const displayFinalPrice = finalPrice;
    const extraCost = (extraBags || 0) * EXTRA_BAG_PRICE;
    const effectivePrice = (displayFinalPrice + extraCost) * numPassengers;
    const ivaAmount = (effectivePrice * IVA) / 100;
    const totalWithIVA = effectivePrice * (1 + IVA / 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-4"
        >
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

                <div className="flex items-center gap-3 mt-4 mb-4">
                    <span className="font-medium">{fullname ?? "Conductor"}</span>
                </div>

                {/* Passenger selector */}
                <div className="mb-4 p-3 bg-custom-gray-50 rounded-lg border border-custom-gray-200">
                    <p className="text-sm font-medium text-custom-black-800 mb-3 flex items-center gap-2">
                        <Users size={16} className="text-custom-golden-700" />
                        Número de pasajeros
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={() => setNumPassengers((n) => Math.max(1, n - 1))}
                            className="w-8 h-8 rounded-full border border-custom-gray-300 flex items-center justify-center hover:bg-custom-gray-100 transition-colors disabled:opacity-40"
                            disabled={numPassengers <= 1}
                            aria-label="Reducir pasajeros"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">{numPassengers}</span>
                        <button
                            onClick={() => setNumPassengers((n) => Math.min(maxPassengers, n + 1))}
                            className="w-8 h-8 rounded-full border border-custom-gray-300 flex items-center justify-center hover:bg-custom-gray-100 transition-colors disabled:opacity-40"
                            disabled={numPassengers >= maxPassengers}
                            aria-label="Aumentar pasajeros"
                        >
                            <Plus size={14} />
                        </button>
                        {typeof seatsAvailable === "number" && (
                            <span className="text-xs text-custom-gray-500">({seatsAvailable} disponibles)</span>
                        )}
                    </div>

                    {companionNames.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs text-custom-gray-600 font-medium">Nombre de los acompañantes:</p>
                            {companionNames.map((name, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        const updated = [...companionNames];
                                        updated[idx] = e.target.value;
                                        setCompanionNames(updated);
                                    }}
                                    placeholder={`Acompañante ${idx + 1}`}
                                    className="w-full border border-custom-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-custom-golden-500 bg-white"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-b border-custom-gray-300 py-4 my-4">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Importe</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <div className="text-right">
                            {basePrice > displayFinalPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                    {(basePrice * numPassengers).toFixed(2).replace(".", ",")} €
                                </div>
                            )}
                            <div className="text-xl font-semibold text-custom-black-800">
                                {(displayFinalPrice * numPassengers).toFixed(2).replace(".", ",")} €
                                {numPassengers > 1 && (
                                    <span className="text-xs text-custom-gray-500 ml-1">
                                        ({numPassengers} × {displayFinalPrice.toFixed(2).replace(".", ",")} €)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Equipaje adicional</span>
                            <ChevronRight size={16} className="text-custom-gray-500" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-custom-gray-600">
                                {extraBags} x {EXTRA_BAG_PRICE.toFixed(2).replace(".", ",")} €
                            </div>
                            <div className="text-base font-semibold text-custom-black-800">
                                {extraCost.toFixed(2).replace(".", ",")} €
                            </div>
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
                            {basePrice > displayFinalPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                    {(((basePrice * numPassengers) + extraCost) * (1 + IVA / 100))
                                        .toFixed(2)
                                        .replace(".", ",")} €
                                </div>
                            )}
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
                                <ChevronDown
                                    size={16}
                                    className={`${showDiscountDetails ? "rotate-180" : ""} transition-transform`}
                                />
                            </button>
                            <motion.div
                                initial={false}
                                animate={{ height: showDiscountDetails ? "auto" : 0, opacity: showDiscountDetails ? 1 : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden mt-3"
                            >
                                <ul className="space-y-1">
                                    {discounts.map((discount) => {
                                        const label =
                                            DISCOUNT_LABELS[discount.key as DiscountKey] || discount.description;
                                        return (
                                            <li
                                                key={discount.key}
                                                className="flex items-center justify-between text-sm text-custom-gray-500"
                                            >
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

                <p className="mt-2 text-xs text-custom-gray-600">
                    Este viaje incluye 1 equipaje de mano y 1 maleta.
                </p>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                    <button
                        onClick={handleBookingClick}
                        className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 py-4 mt-4 rounded-lg flex items-center justify-center"
                    >
                        <Calendar1Icon size={16} className="mr-2" />
                        {numPassengers > 1 ? `Ir a pagar (${numPassengers} pasajeros)` : "Ir a pagar"}
                    </button>
                </motion.div>
            </div>

            <AuthRequiredModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleLoginRedirect}
            />
        </motion.div>
    );
};

export default BookingSidebar;
