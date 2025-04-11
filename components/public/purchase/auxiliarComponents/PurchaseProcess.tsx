import React, { useEffect, useState } from "react";
import PurchaseTripSummary from "./PurchaseTripSummary";
import PaymentOption from "./PaymentOption";
import PaymentTrustInfo from "./PaymentTrustInfo";
import {
  AlertCircle,
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trip } from "@/lib/shared/types/trip-service-type.type";
import { getTripForPurchase } from "@/lib/api/trip";
import NotFoundMessage from "@/lib/client/components/NotFoundMessage";
import { toast } from "sonner";
import { CreateReservationPayload } from "@/lib/api/reservation/reservation.types";
import { createReservation } from "@/lib/api/reservation";
import { getSummaryFromTrip } from "@/lib/client/purchase/functions";
import { useSession } from "next-auth/react";

const PurchaseProcess = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  console.log(session);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const tripData = await getTripForPurchase(id);
        setTrip(tripData as Trip);
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
    if (!trip || !id || !session) return;

    const payload: CreateReservationPayload = {
      tripId: trip.id,
      userId: session.user.id as string,
      price: trip.basePrice,
      status: "PENDING",
      paymentMethod: "CASH",
    };

    try {
      await createReservation(payload);
      toast.success("Reserva generada correctamente.", {
        description: "Puedes ver el estado de la misma en tu perfil.",
      });
    } catch (error) {
      console.info("Error al crear la reserva:", error);
      toast.error("Hubo un error al crear la reserva", {
        description: "Intenta nuevamente o contacta con el soporte",
      });
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Cargando viaje...</p>;
  }

  if (error) {
    return <NotFoundMessage />;
  }

  if (!trip) return null;

  const tripSummary = getSummaryFromTrip(trip);
  const priceFormatted = tripSummary.price.toFixed(2).replace(".", ",");

  return (
    <main className="container mx-auto p-8 grow">
      <h1 className="text-3xl font-bold text-custom-black-800 text-center mb-2">
        Elige tu método de pago
      </h1>
      <p className="text-custom-gray-600 text-center mb-8">
        Estás a un paso de asegurar tu viaje
      </p>

      <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-8 w-full">
        {/* Columna izquierda: Opciones de pago */}
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
            onClick={() => console.log("Pago online confirmado")}
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

        {/* Columna derecha: Resumen del viaje */}
        <div className="lg:w-lg mb-6 lg:mb-0">
          <PurchaseTripSummary {...tripSummary} />
        </div>
      </div>
    </main>
  );
};

export default PurchaseProcess;
