"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle, Car, Bus, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/functions";
import { BACKEND_URL } from "@/lib/constants";

type PaymentType = 'trip' | 'vehicle' | 'extra_bags';

interface SessionData {
  amount_total: number;
  metadata: {
    type?: string;
    tripId?: string;
    offerId?: string;
    reservationId?: string;
  };
}

interface TripResponse {
  id: string;
  origin: string;
  destination: string;
  departure: string;
}

interface VehicleOfferResponse {
  id: string;
  pricePerDay: number;
  vehicle: {
    model: string;
    brand: string;
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const type = (searchParams.get('type') || 'trip') as PaymentType;

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [tripData, setTripData] = useState<TripResponse | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleOfferResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching session from:', `${BACKEND_URL}/stripe/session/${sessionId}`);
        const session = await fetcher<SessionData>(
          `${BACKEND_URL}/stripe/session/${sessionId}`
        );
        console.log('Session data:', session);
        setSessionData(session);

        if (session.metadata?.tripId && type === 'trip') {
          const trip = await fetcher<TripResponse>(
            `${BACKEND_URL}/trip/${session.metadata.tripId}`
          );
          setTripData(trip);
        }

        if (session.metadata?.offerId && type === 'vehicle') {
          const offer = await fetcher<VehicleOfferResponse>(
            `${BACKEND_URL}/vehicle-offer/${session.metadata.offerId}`
          );
          setVehicleData(offer);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, type]);

  const getTitle = () => {
    if (type === 'vehicle') return "¡Alquiler confirmado!";
    if (type === 'extra_bags') return "¡Equipaje extra añadido!";
    return "¡Viaje reservado con éxito!";
  };

  const getDescription = () => {
    if (type === 'vehicle') return "Tu alquiler de vehículo ha sido confirmado. Puedes gestionar tu reserva desde tu panel.";
    if (type === 'extra_bags') return "El equipaje extra ha sido añadido a tu reserva.";
    return "Tu viaje ha sido reservado y pagado correctamente. Puedes ver los detalles en tu panel.";
  };

  const getDestinationLink = () => {
    if (type === 'vehicle') return "/dashboard/user/vehicle-bookings";
    return "/dashboard/user/reservations";
  };

  const getDestinationLabel = () => {
    if (type === 'vehicle') return "Ver mis alquileres";
    return "Ver mis reservas";
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {getTitle()}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {getDescription()}
        </p>

        {sessionData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">Importe pagado</p>
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(sessionData.amount_total || 0)} €
            </p>
          </div>
        )}

        {tripData && type === 'trip' && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Bus className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Detalles del viaje</span>
            </div>
            <p className="text-gray-700">
              <strong>Origen:</strong> {tripData.origin}
            </p>
            <p className="text-gray-700">
              <strong>Destino:</strong> {tripData.destination}
            </p>
            {tripData.departure && (
              <p className="text-gray-600 text-sm mt-1">
                {new Date(tripData.departure).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        )}

        {vehicleData && type === 'vehicle' && (
          <div className="bg-purple-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Vehículo alquilado</span>
            </div>
            <p className="text-gray-700">
              {vehicleData.vehicle?.brand} {vehicleData.vehicle?.model}
            </p>
            <p className="text-gray-600 text-sm">
              {vehicleData.pricePerDay} €/día
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href={getDestinationLink()}
            className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {getDestinationLabel()}
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
