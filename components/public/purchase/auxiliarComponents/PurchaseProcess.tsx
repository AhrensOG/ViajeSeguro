// PurchaseProcess.tsx
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
import { createReservation } from "@/lib/api/reservation";
import { getSummaryFromTrip } from "@/lib/client/purchase/functions";
import { useSession } from "next-auth/react";
import { BASE_URL } from "@/lib/constants";
import { createCheckoutSession } from "@/lib/api/stripe";
import PurchaseProcessFallback from "@/lib/client/components/fallbacks/purchase/PurchaseProcessFallback";
import CashConfirmationModal from "./CashConfirmationModal";

const PurchaseProcess = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const IVA = process.env.NEXT_PUBLIC_IVA || 0;
    const referralId = searchParams.get("referral");

    const id = searchParams.get("id");
    const [trip, setTrip] = useState<TripWithPriceDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const [showCashModal, setShowCashModal] = useState(false);

    useEffect(() => {
        const fetchTrip = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const tripData = await getTripForPurchase(id);
                setTrip(tripData as TripWithPriceDetails);
            } catch (err) {
                console.log("Error al cargar el viaje:", err);
                setError("Error al obtener el viaje");
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const handleCashPayment = async () => {
         if (!session) {
      const current = `${BASE_URL}${pathname}?${searchParams.toString()}`;
      const encoded = encodeURIComponent(current);
      toast.info("Debes iniciar sesión para realizar la reserva");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`/auth/login?callbackUrl=${encoded}`);
      return;
    }
    setShowCashModal(true);
    };

    const confirmCashPayment = async () => {
        if (!trip || !session) return;

        const payload: CreateReservationPayload = {
            tripId: trip.id,
            price: trip.priceDetails?.finalPrice ?? trip.basePrice,
            status: "PENDING",
            paymentMethod: "CASH",
            referralId: referralId || undefined,
        };

        try {
            await createReservation(payload);
            toast.success("Reserva generada correctamente.", {
                description: "Puedes ver el estado de la misma en tu perfil.",
            });
            router.push("/dashboard/client/reservations");
        } catch (error) {
            console.log("Error al crear la reserva:", error);
            toast.info("Hubo un error al crear la reserva", {
                description: "Intenta nuevamente o contacta con el soporte",
            });
        } finally {
            setShowCashModal(false);
        }
    };

    const handleStripeRedirect = async () => {
        if (!trip || !id) return;
        if (!session) {
            const current = `${BASE_URL}${pathname}?${searchParams.toString()}`;
            const encoded = encodeURIComponent(current);
            toast.info("Debes iniciar sesión para realizar la reserva");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            router.push(`/auth/login?callbackUrl=${encoded}`);
            return;
        }

        const payload: CreateReservationPayload = {
            tripId: trip.id,
            price: (trip.priceDetails?.finalPrice ?? trip.basePrice) * (1 + Number(IVA) / 100),
            status: "PENDING",
            paymentMethod: "STRIPE",
            referralId: referralId || undefined,
        };
        try {
            const data = await createCheckoutSession({
                amount: Math.round((trip.priceDetails?.finalPrice ?? trip.basePrice) * (1 + Number(IVA) / 100) * 100),
                metadata: payload,
            });
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.log("Error al iniciar el checkout:", err);
            toast.info("No se pudo redirigir al pago");
        }
    };

    if (loading) return <PurchaseProcessFallback />;
    if (error) return <NotFoundMessage />;
    if (!trip) return null;

    const tripSummary = getSummaryFromTrip(trip);
    const priceFormatted = ((trip.priceDetails?.finalPrice ?? trip.basePrice) * (1 + Number(IVA) / 100)).toFixed(2).replace(".", ",");

    return (
        <main className="container mx-auto p-8 grow">
            <h1 className="text-3xl font-bold text-custom-black-800 text-center mb-2">Elige tu método de pago</h1>
            <p className="text-custom-gray-600 text-center mb-8">Estás a un paso de asegurar tu viaje</p>

            <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-8 w-full">
                <div className="flex-1 space-y-6">
                    <PaymentOption
                        icon={<CreditCard className="h-6 w-6 text-custom-golden-700" />}
                        title="Pagar ahora"
                        description="Asegura tu plaza al instante y viaja con total tranquilidad"
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
                        buttonLabel={`Pagar ${priceFormatted} €`}
                        secure
                        onClick={handleStripeRedirect}
                    />

                    <PaymentOption
                        icon={<Banknote className="h-6 w-6 text-custom-gray-600" />}
                        title="Pagar en efectivo"
                        description="Paga directamente al conductor el día del viaje"
                        features={[
                            <>
                                <Clock className="h-5 w-5 text-custom-gray-500" />
                                <span>Tu plaza queda reservada temporalmente</span>
                            </>,
                            <>
                                <AlertCircle className="h-5 w-5 text-custom-gray-500" />
                                <span>El conductor puede rechazar tu solicitud</span>
                            </>,
                        ]}
                        buttonLabel="Pagar con efectivo"
                        secure
                        onClick={handleCashPayment}
                    />

                    <PaymentTrustInfo />
                </div>

                <div className="lg:w-lg mb-6 lg:mb-0">
                    <PurchaseTripSummary {...tripSummary} priceDetails={trip.priceDetails} />
                </div>
            </div>
            <CashConfirmationModal show={showCashModal} onClose={() => setShowCashModal(false)} onConfirm={confirmCashPayment} />
        </main>
    );
};

export default PurchaseProcess;
