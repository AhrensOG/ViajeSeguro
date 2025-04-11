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
import { useSearchParams } from "next/navigation";
import { Trip } from "@/lib/shared/types/trip-service-type.type";
import { getTripForPurchase } from "@/lib/api/trip";
import { DateTime } from "luxon";
import NotFoundMessage from "@/lib/client/components/NotFoundMessage";

const getSummaryFromTrip = (trip: Trip) => {
  const departure = DateTime.fromISO(trip.departure).setZone(
    trip.originalTimeZone
  );
  const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);
  const durationInMinutes = arrival.diff(departure, "minutes").minutes;
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = Math.round(durationInMinutes % 60);

  return {
    dateLabel: departure.setLocale("es").toFormat("ccc, dd 'de' LLLL"),
    departureTime: departure.toFormat("HH:mm"),
    arrivalTime: arrival.toFormat("HH:mm"),
    duration: `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`,
    originCity: trip.origin,
    originLocation: trip.originLocation,
    destinationCity: trip.destination,
    destinationLocation: trip.destinationLocation,
    price: trip.basePrice,
    size: "md" as const,
  };
};

const PurchaseProcess = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const tripData = await getTripForPurchase(id);
        setTrip(tripData as Trip);
      } catch (err) {
        console.error("Error al cargar el viaje:", err);
        setError("Error al obtener el viaje");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

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
            onClick={() => console.log("Pago en efectivo seleccionado")}
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
