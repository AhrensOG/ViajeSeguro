"use client";

import React, { useEffect, useState } from "react";
import PurchaseTripSummary from "./PurchaseTripSummary";
import PaymentOption from "./PaymentOption";
import PaymentTrustInfo from "./PaymentTrustInfo";
import { AlertCircle, Banknote, CheckCircle, Clock, CreditCard } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TripWithPriceDetails } from "@/lib/shared/types/trip-service-type.type";
import { getTripForPurchase } from "@/lib/api/trip";
import NotFoundMessage from "@/lib/client/components/NotFoundMessage";
import { toast } from "sonner";
import { CreateReservationPayload } from "@/lib/api/reservation/reservation.types";
import { createReservation, addReservationExtras } from "@/lib/api/reservation";
import { getSummaryFromTrip } from "@/lib/client/purchase/functions";
import { useSession } from "next-auth/react";
import { BASE_URL } from "@/lib/constants";
import { createCheckoutSession } from "@/lib/api/stripe";
import PurchaseProcessFallback from "@/lib/client/components/fallbacks/purchase/PurchaseProcessFallback";
import CashConfirmationModal from "./CashConfirmationModal";
import { VehicleOfferWithVehicle, CreateVehicleBookingPayload } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { createVehicleBooking } from "@/lib/api/vehicle-booking";
import { fetchVehicleOffer } from "@/lib/api/vehicleOffer";
import { calculateTotalDays } from "@/lib/functions";
import PurchaseVehicleSummary from "./PurchaseVehicleSummary";
import TermsAndConditionsModal from "./TermsAndConditionsModal";

const PurchaseProcess = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const type = searchParams.get("type");
    const isVehicle = type === "vehicle";
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const extraBagsParam = searchParams.get("extraBags");
    const extraBags = extraBagsParam ? Number(extraBagsParam) : 0;
    const EXTRA_BAG_PRICE = 5;
    const extrasOnly = searchParams.get("extrasOnly") === "1";
    const reservationId = searchParams.get("reservationId");

    const IVA = 21;
    const referralId = searchParams.get("referral");
    const id = searchParams.get("id");

    const [trip, setTrip] = useState<TripWithPriceDetails | null>(null);
    const [vehicleOffer, setVehicleOffer] = useState<VehicleOfferWithVehicle | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const [showCashModal, setShowCashModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<"stripe" | "cash" | null>(null);

    useEffect(() => {
        const fetchTrip = async () => {
            if (!id) return;
            try {
                setLoading(true);

                if (type === "trip") {
                    const tripData = await getTripForPurchase(id);
                    setTrip(tripData as TripWithPriceDetails);
                }
                if (type === "vehicle") {
                    const vehicleOfferData = await fetchVehicleOffer(id);

                    setVehicleOffer(vehicleOfferData as VehicleOfferWithVehicle);
                }
            } catch (err) {
                console.log("Error al cargar el viaje:", err);
                setError("Error al obtener la información");
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id, type]);

    const handleCashPayment = async () => {
        if (!session) {
            const current = `${BASE_URL}${pathname}?${searchParams.toString()}`;
            const encoded = encodeURIComponent(current);
            toast.info("Debes iniciar sesión para realizar la reserva");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            router.push(`/auth/login?callbackUrl=${encoded}`);
            return;
        }
        // Requiere aceptación de T&C antes de abrir el modal de efectivo
        setPendingAction("cash");
        setShowTermsModal(true);
    };

    const confirmCashPayment = async () => {
        if ((!trip && !vehicleOffer) || !session) return;

        if (trip) {
            // Flujo SOLO equipaje en efectivo: actualizar reserva existente sin validar capacidad
            if (extrasOnly && reservationId) {
                try {
                    await addReservationExtras(reservationId, extraBags);
                    toast.success("Equipaje agregado correctamente.", {
                        description: "Se actualizó tu reserva con las maletas adicionales.",
                    });
                    router.push("/dashboard/user/reservations");
                } catch (error) {
                    console.log("Error al agregar equipaje en efectivo:", error);
                    toast.info("No se pudo agregar el equipaje", {
                        description: "Intenta nuevamente o contacta con el soporte",
                    });
                } finally {
                    setShowCashModal(false);
                }
                return;
            }
            const payload: CreateReservationPayload = {
                tripId: trip.id,
                // Mantiene la lógica actual (sin IVA en cash) pero suma equipaje adicional
                price: (trip.priceDetails?.finalPrice ?? trip.basePrice) + extraBags * EXTRA_BAG_PRICE,
                status: "PENDING",
                paymentMethod: "CASH",
                referralId: referralId || undefined,
                seatCode: `EXTRA_BAGS:${extraBags}`,
            };

            try {
                await createReservation(payload);
                toast.success("Reserva generada correctamente.", {
                    description: "Puedes ver el estado de la misma en tu perfil.",
                });
                router.push("/dashboard/user/reservations");
            } catch (error) {
                console.log("Error al crear la reserva:", error);
                toast.info("Hubo un error al crear la reserva", {
                    description: "Intenta nuevamente o contacta con el soporte",
                });
            } finally {
                setShowCashModal(false);
            }
        }
        if (vehicleOffer) {
            const totalPrice = vehicleOffer.pricePerDay * calculateTotalDays(start || vehicleOffer.availableFrom, end || vehicleOffer.availableTo);
            const createVehicleBookingPayload = {
                renterId: session.user.id,
                offerId: vehicleOffer.id,
                startDate: new Date(start || vehicleOffer.availableFrom),
                endDate: new Date(end || vehicleOffer.availableTo),
                status: "PENDING",
                paymentMethod: "CASH",
                referrerId: referralId || undefined,
                totalPrice: totalPrice,
            };

            try {
                await createVehicleBooking(createVehicleBookingPayload);
                toast.success("Reserva generada correctamente.", {
                    description: "Puedes ver el estado de la misma en tu perfil.",
                });
                router.push("/dashboard/user/reservations");
            } catch (error) {
                console.log("Error al crear la reserva:", error);
                toast.info("Hubo un error al crear la reserva", {
                    description: "Intenta nuevamente o contacta con el soporte",
                });
            } finally {
                setShowCashModal(false);
            }
        }
    };

    const handleStripeRedirect = async () => {
        if ((!trip && !vehicleOffer) || !id) return;
        if (!session) {
            const current = `${BASE_URL}${pathname}?${searchParams.toString()}`;
            const encoded = encodeURIComponent(current);
            toast.info("Debes iniciar sesión para realizar la reserva");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            router.push(`/auth/login?callbackUrl=${encoded}`);
            return;
        }

        if (trip) {
            // Si es flujo de solo equipaje, crear sesión por solo las maletas y salir
            if (extrasOnly && reservationId) {
                try {
                    const data = await createCheckoutSession({
                        amount: Math.round(extraBags * EXTRA_BAG_PRICE * (1 + Number(IVA) / 100) * 100),
                        metadata: ({
                            // Se usa el tipo de reserva para facilitar conciliación en backend
                            type: "EXTRA_BAGS",
                            reservationId,
                            tripId: trip.id,
                            userId: String(session.user.id),
                            seatCode: `EXTRA_BAGS:${extraBags}`,
                        } as unknown) as CreateReservationPayload,
                    });
                    if (data.url) {
                        window.location.href = data.url;
                        return;
                    }
                } catch (err) {
                    console.log("Error al iniciar el checkout de equipaje:", err);
                    toast.info("No se pudo redirigir al pago de equipaje");
                    return;
                }
            }
            const payload: CreateReservationPayload = {
                tripId: trip.id,
                // Para Stripe, la app ya enviaba precio con IVA: ahora sumamos equipaje y luego IVA
                price: ((trip.priceDetails?.finalPrice ?? trip.basePrice) + extraBags * EXTRA_BAG_PRICE) * (1 + Number(IVA) / 100),
                status: "PENDING",
                paymentMethod: "STRIPE",
                referralId: referralId || undefined,
                seatCode: `EXTRA_BAGS:${extraBags}`,
            };
            try {
                const data = await createCheckoutSession({
                    amount: Math.round(((trip.priceDetails?.finalPrice ?? trip.basePrice) + extraBags * EXTRA_BAG_PRICE) * (1 + Number(IVA) / 100) * 100),
                    metadata: ({ ...payload, userId: String(session.user.id) } as unknown) as CreateReservationPayload,
                });
                if (data.url) {
                    window.location.href = data.url;
                }
            } catch (err) {
                console.log("Error al iniciar el checkout:", err);
                toast.info("No se pudo redirigir al pago");
            }
        }
        if (vehicleOffer) {
            const finalPrice = vehicleOffer.pricePerDay * calculateTotalDays(start || vehicleOffer.availableFrom, end || vehicleOffer.availableTo);
            const deposit = typeof vehicleOffer.depositAmount === 'number' ? vehicleOffer.depositAmount : 600;
            try {
                const vehicleMetadataStrings: Record<string, string> = {
                    type: 'VEHICLE_BOOKING',
                    renterId: String(session.user.id),
                    offerId: String(vehicleOffer.id),
                    startDate: new Date(start || vehicleOffer.availableFrom).toISOString(),
                    endDate: new Date(end || vehicleOffer.availableTo).toISOString(),
                    status: 'PENDING',
                    paymentMethod: 'STRIPE',
                    totalPrice: String(finalPrice),
                };
                if (referralId) vehicleMetadataStrings.referrerId = String(referralId);

                const data = await createCheckoutSession({
                    amount: Math.round(((finalPrice * (1 + Number(IVA) / 100)) + deposit) * 100),
                    metadata: (vehicleMetadataStrings as unknown) as CreateVehicleBookingPayload,
                });

                if (data.url) {
                    window.location.href = data.url;
                }
            } catch (err) {
                console.log("Error al iniciar el checkout:", err);
                toast.info("No se pudo redirigir al pago");
            }
        }
    };

    if (loading) return <PurchaseProcessFallback />;
    if (error) return <NotFoundMessage />;
    if (!trip && !vehicleOffer) return null;

    const tripSummary = trip ? getSummaryFromTrip(trip) : null;

    const priceFormatted = (finalPrice: number | undefined, basePrice: number, IVA: number, extra: number) => {
        const price = (finalPrice !== undefined ? finalPrice : basePrice) + extra;
        return (price * (1 + Number(IVA) / 100)).toFixed(2).replace(".", ",");
    };

    let price: string = "0,00";

    if (trip) {
        const extraAmount = extraBags * EXTRA_BAG_PRICE;
        // Si es flujo de solo equipaje, mostrar solo el total de equipaje en el botón
        if (extrasOnly) {
            price = ((extraAmount) * (1 + Number(IVA) / 100)).toFixed(2).replace(".", ",");
        } else {
            const isAdmin = trip.user?.role === "ADMIN";
            let finalPrice = trip.priceDetails?.finalPrice;

            if (isAdmin) {
                const adminDiscountAmount = +(trip.basePrice * 0.4).toFixed(2);
                if (!finalPrice || finalPrice === trip.basePrice) {
                    finalPrice = +(trip.basePrice - adminDiscountAmount).toFixed(2);
                    // Inject discount into priceDetails for summary
                    if (!trip.priceDetails) {
                        trip.priceDetails = {
                            basePrice: trip.basePrice,
                            finalPrice: finalPrice,
                            discounts: []
                        };
                    }
                    if (!trip.priceDetails.discounts.some(d => d.key === 'PREFERENCIAL')) {
                        trip.priceDetails.discounts.push({
                            key: 'PREFERENCIAL',
                            description: 'Descuento Promocional',
                            amount: adminDiscountAmount
                        });
                    }
                    trip.priceDetails.finalPrice = finalPrice;
                }
            }

            price = priceFormatted(finalPrice, trip.basePrice, Number(IVA), extraAmount);
        }
    } else if (vehicleOffer?.pricePerDay !== undefined && (start || vehicleOffer.availableFrom) && (end || vehicleOffer.availableTo)) {
        const totalDays = calculateTotalDays(start || vehicleOffer.availableFrom, end || vehicleOffer.availableTo);
        const totalPrice = vehicleOffer.pricePerDay * totalDays;
        const deposit = typeof vehicleOffer.depositAmount === 'number' ? vehicleOffer.depositAmount : 600;
        const priceWithIvaAndDeposit = (totalPrice * (1 + Number(IVA) / 100)) + deposit;
        price = priceWithIvaAndDeposit.toFixed(2).replace('.', ',');
    }

    //Logica para vehicle

    return (
        <main className="container mx-auto p-8 grow">
            <h1 className="text-3xl font-bold text-custom-black-800 text-center mb-2">Elige tu método de pago</h1>
            <p className="text-custom-gray-600 text-center mb-8">
                {isVehicle ? "Estás a un paso de asegurar tu reserva" : "Estás a un paso de asegurar tu viaje"}
            </p>

            <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-8 w-full">
                <div className="flex-1 space-y-6">
                    <PaymentOption
                        icon={<CreditCard className="h-6 w-6 text-custom-golden-700" />}
                        title="Pagar ahora"
                        description={
                            type === "trip"
                                ? "Asegura tu plaza al instante y viaja con total tranquilidad"
                                : "Asegura tu reserva al instante y viaja con total tranquilidad"
                        }
                        features={[
                            <>
                                <CheckCircle className="h-5 w-5 text-custom-golden-600" />
                                <span>Pago seguro con protección al viajero</span>
                            </>,
                            <>
                                <CheckCircle className="h-5 w-5 text-custom-golden-600" />
                                <span>Múltiples métodos de pago disponibles</span>
                            </>,
                        ]}
                        highlighted
                        recommended
                        badgeLabel="Recomendado"
                        buttonLabel={`Pagar ${price} €`}
                        secure
                        onClick={() => {
                            setPendingAction("stripe");
                            setShowTermsModal(true);
                        }}
                    />

                    {type === "trip" && (
                        <PaymentOption
                            icon={<Banknote className="h-6 w-6 text-custom-gray-600" />}
                            title="Pagar en efectivo"
                            description={
                                type === "trip"
                                    ? "Paga directamente al conductor el día del viaje"
                                    : "Paga directamente al encargado el dia del viaje"
                            }
                            features={[
                                <>
                                    <Clock className="h-5 w-5 text-custom-gray-500" />
                                    <span>
                                        {type === "trip" ? "Tu plaza queda reservada temporalmente" : "El vehículo queda reservado temporalmente"}
                                    </span>
                                </>,
                                <>
                                    <AlertCircle className="h-5 w-5 text-custom-gray-500" />
                                    <span>
                                        {type === "trip" ? "El conductor puede rechazar tu solicitud" : "El conductor puede rechazar tu solicitud"}
                                    </span>
                                </>,
                            ]}
                            buttonLabel="Pagar con efectivo"
                            secure
                            onClick={handleCashPayment}
                        />
                    )}

                    <PaymentTrustInfo />
                </div>

                <div className="lg:w-lg mb-6 lg:mb-0">
                    {trip && tripSummary && (
                        <PurchaseTripSummary
                            {...tripSummary}
                            priceDetails={trip.priceDetails}
                            extraBags={extraBags}
                            pricePerBag={EXTRA_BAG_PRICE}
                        // title={isVehicle ? "Resumen de tu reserva" : "Resumen de tu viaje"}
                        />
                    )}
                    {vehicleOffer && (
                        <PurchaseVehicleSummary
                            vehicleOffer={vehicleOffer}
                            start={start || vehicleOffer.availableFrom}
                            end={end || vehicleOffer.availableTo}
                            originalTimeZone={vehicleOffer.originalTimeZone}
                        />
                    )}
                </div>
            </div>

            <CashConfirmationModal show={showCashModal} onClose={() => setShowCashModal(false)} onConfirm={confirmCashPayment} />
            <TermsAndConditionsModal
                show={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                onAccept={() => {
                    setShowTermsModal(false);
                    if (pendingAction === "stripe") {
                        setPendingAction(null);
                        void handleStripeRedirect();
                    } else if (pendingAction === "cash") {
                        setPendingAction(null);
                        setShowCashModal(true);
                    }
                }}
            />
        </main>
    );
};

export default PurchaseProcess;
