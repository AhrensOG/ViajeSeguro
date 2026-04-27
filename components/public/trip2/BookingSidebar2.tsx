"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Users, CreditCard, Banknote, CheckCircle } from "lucide-react";
import { TripWithPriceDetails } from "@/lib/shared/types/trip-service-type.type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTripOptions } from "@/components/public/trip/auxiliarComponents/TripOptionsContext";
import { toast } from "sonner";
import { createReservation } from "@/lib/api/reservation";
import { CreateReservationPayload } from "@/lib/api/reservation/reservation.types";
import { createCheckoutSession } from "@/lib/api/stripe";
import AuthRequiredModal from "@/components/public/trip/auxiliarComponents/AuthRequiredModal";

type BookingSidebar2Props = {
    trip: TripWithPriceDetails;
};

const BookingSidebar2 = ({ trip }: BookingSidebar2Props) => {
    const [showModal, setShowModal] = useState(false);
    const [showCashConfirm, setShowCashConfirm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cash">("cash");
    const [processing, setProcessing] = useState(false);
    const [companionNames, setCompanionNames] = useState<string[]>([]);
    
    const { data: session } = useSession();
    const router = useRouter();
    const IVA = 21;
    const EXTRA_BAG_PRICE = 5;
    const { extraBags } = useTripOptions();

    const capacity: number | undefined = (trip as TripWithPriceDetails & { capacity?: number }).capacity;
    const passengersCount: number =
        (trip as TripWithPriceDetails & { passengers?: unknown[]; passengerCount?: number }).passengers?.length ??
        (trip as TripWithPriceDetails & { passengers?: unknown[]; passengerCount?: number }).passengerCount ??
        0;
    const seatsAvailable = typeof capacity === "number" ? Math.max(capacity - passengersCount, 0) : undefined;
    const maxPassengers = seatsAvailable ?? 10;

    const [numPassengers, setNumPassengers] = useState(1);

    useEffect(() => {
        const companions = numPassengers - 1;
        setCompanionNames((prev) => {
            if (prev.length === companions) return prev;
            if (prev.length < companions) return [...prev, ...Array(companions - prev.length).fill("")];
            return prev.slice(0, companions);
        });
    }, [numPassengers]);

    useEffect(() => {
        const companions = companionNames.filter((n) => n.trim() !== "");
        sessionStorage.setItem("tripPassengers", JSON.stringify(companions));
        sessionStorage.setItem("tripNumPassengers", String(numPassengers));
    }, [companionNames, numPassengers]);

    const basePrice = trip.priceDetails?.finalPrice ?? trip.basePrice;

    const extraAmount = extraBags * EXTRA_BAG_PRICE;
    const subtotal = (basePrice + extraAmount) * numPassengers;
    const total = subtotal * (1 + IVA / 100);

    const handlePayment = async () => {
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

        if (paymentMethod === "cash") {
            setShowCashConfirm(true);
        } else {
            await handleStripePayment();
        }
    };

    const handleConfirmCash = async () => {
        setProcessing(true);
        try {
            const companions = companionNames.filter((n) => n.trim() !== "");
            const payload: CreateReservationPayload = {
                tripId: trip.id,
                price: subtotal,
                status: "PENDING",
                paymentMethod: "CASH",
                seatCode: `PASSENGERS:${numPassengers}`,
                passengers: companions,
            };

            await createReservation(payload);
            
            router.push(`/reservation/confirmed?id=${trip.id}`);
        } catch (error) {
            console.error("Error al crear la reserva:", error);
            toast.error("Error al procesar la reserva");
        } finally {
            setProcessing(false);
            setShowCashConfirm(false);
        }
    };

    const handleStripePayment = async () => {
        if (!session) {
            setShowModal(true);
            return;
        }

        setProcessing(true);
        try {
            const companions = companionNames.filter((n) => n.trim() !== "");
            const payload: CreateReservationPayload = {
                tripId: trip.id,
                price: total,
                status: "PENDING",
                paymentMethod: "STRIPE",
                seatCode: `PASSENGERS:${numPassengers}`,
                passengers: companions,
            };

            const data = await createCheckoutSession({
                amount: Math.round(total * 100),
                metadata: ({ ...payload, userId: String(session.user.id) } as unknown) as CreateReservationPayload,
            });

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            toast.error("Error al procesar el pago");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Passenger Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200"
            >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Número de pasajeros
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">Pasajeros</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setNumPassengers((p) => Math.max(1, p - 1))}
                            disabled={numPassengers <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl font-bold text-gray-900 w-8 text-center">
                            {numPassengers}
                        </span>
                        <button
                            onClick={() => setNumPassengers((p) => Math.min(maxPassengers, p + 1))}
                            disabled={numPassengers >= maxPassengers}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {seatsAvailable !== undefined && seatsAvailable <= 3 && (
                    <p className="text-sm text-amber-600 mt-3">
                        ¡Solo quedan {seatsAvailable} asientos!
                    </p>
                )}

                {/* Companion Names */}
                {companionNames.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-2">
                            Nombre de los acompañantes:
                        </p>
                        <div className="space-y-2">
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
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Payment Method */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200"
            >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Método de pago
                </h3>

                <div className="space-y-3">
                    <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === "cash"
                                ? "border-amber-500 bg-amber-50"
                                : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={() => setPaymentMethod("cash")}
                            className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "cash" ? "border-amber-500 bg-amber-500" : "border-gray-300"
                        }`}>
                            {paymentMethod === "cash" && (
                                <CheckCircle className="w-3 h-3 text-white" />
                            )}
                        </div>
                        <Banknote className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Efectivo</p>
                            <p className="text-xs text-gray-500">Pagar directamente al conductor</p>
                        </div>
                    </label>

                    <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === "stripe"
                                ? "border-amber-500 bg-amber-50"
                                : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="stripe"
                            checked={paymentMethod === "stripe"}
                            onChange={() => setPaymentMethod("stripe")}
                            className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "stripe" ? "border-amber-500 bg-amber-500" : "border-gray-300"
                        }`}>
                            {paymentMethod === "stripe" && (
                                <CheckCircle className="w-3 h-3 text-white" />
                            )}
                        </div>
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Tarjeta</p>
                            <p className="text-xs text-gray-500">Pagar con tarjeta de crédito/débito</p>
                        </div>
                    </label>
                </div>
            </motion.div>

            {/* Price Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200"
            >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Resumen del precio
                </h3>

                <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            {basePrice.toFixed(2).replace(".", ",")} € × {numPassengers} {numPassengers === 1 ? "pasajero" : "pasajeros"}
                        </span>
                        <span className="text-gray-900">{subtotal.toFixed(2).replace(".", ",")} €</span>
                    </div>
                    {extraAmount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Equipaje extra ({extraBags})</span>
                            <span className="text-gray-900">+{extraAmount.toFixed(2).replace(".", ",")} €</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-600">IVA ({IVA}%)</span>
                        <span className="text-gray-900">{(subtotal * IVA / 100).toFixed(2).replace(".", ",")} €</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-xl text-amber-600">{total.toFixed(2).replace(".", ",")} €</span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={processing || maxPassengers === 0}
                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        maxPassengers > 0
                            ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {processing ? (
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : paymentMethod === "cash" ? (
                        <>
                            <Banknote className="w-5 h-5" />
                            Confirmar y pagar en efectivo
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Pagar con tarjeta
                        </>
                    )}
                </button>

                {maxPassengers === 0 && (
                    <p className="text-sm text-red-500 text-center mt-3">
                        Este viaje no tiene asientos disponibles
                    </p>
                )}
            </motion.div>

            {/* Cash Confirmation Modal */}
            {showCashConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Confirmar pago en efectivo
                        </h2>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
                            <p className="text-sm text-yellow-800 font-medium mb-1">
                                ⚠️ Importante
                            </p>
                            <p className="text-sm text-yellow-700">
                                El conductor no dispone de cambio. Lleva el <strong>importe exacto: {total.toFixed(2).replace(".", ",")} €</strong>
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">
                            Tu plaza será reservada temporalmente hasta el día del viaje.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCashConfirm(false)}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmCash}
                                disabled={processing}
                                className="flex-1 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition disabled:opacity-50"
                            >
                                {processing ? "Procesando..." : "Confirmar"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Auth Modal */}
            {showModal && (
                <AuthRequiredModal 
                    show={showModal} 
                    onClose={() => setShowModal(false)}
                    onConfirm={() => router.push("/auth/login")}
                />
            )}
        </div>
    );
};

export default BookingSidebar2;
