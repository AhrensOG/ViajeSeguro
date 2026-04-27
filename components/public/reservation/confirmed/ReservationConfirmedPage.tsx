"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle, Banknote, MapPin } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/public/navigation/NavBar";
import Footer from "@/components/public/navigation/Footer";
import { fetcher } from "@/lib/functions";
import { BACKEND_URL } from "@/lib/constants";
import { DateTime } from "luxon";

interface ReservationData {
  id: string;
  status: string;
  price: number;
  paymentMethod: string;
  seatCode: string;
  trip?: {
    origin: string;
    destination: string;
    originLocation: string;
    destinationLocation: string;
    departure: string;
    arrival: string;
  };
}

function ReservationConfirmedContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("id");

  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetcher<ReservationData>(
          `${BACKEND_URL}/reservation/${reservationId}`
        );
        setReservation(data);
      } catch (error) {
        console.error("Error fetching reservation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",");
  };

  const formatDate = (dateStr: string) => {
    try {
      return DateTime.fromISO(dateStr).setLocale("es").toFormat("cccc, d 'de' LLLL 'a las' HH:mm");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <NavBar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Reserva confirmada!
            </h1>

            <p className="text-gray-600 mb-6">
              Tu plaza ha sido reservada. Recuerda que el pago se realizará directamente al conductor.
            </p>

            {/* Price to Pay */}
            {reservation?.price && (
              <div className="bg-amber-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-amber-700 mb-1 font-medium">Importe a pagar al conductor</p>
                <p className="text-4xl font-bold text-amber-600">
                  {formatPrice(reservation.price)} €
                </p>
              </div>
            )}

            {/* Warning */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left rounded-r-lg">
              <div className="flex gap-3">
                <Banknote className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    Importante
                  </p>
                  <p className="text-sm text-yellow-700">
                    El conductor no dispone de cambio. Lleva el <strong>importe exacto</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            {reservation?.trip && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Detalles del viaje
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origen:</span>
                    <span className="font-medium text-gray-900">{reservation.trip.origin}</span>
                  </div>
                  {reservation.trip.originLocation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Punto de encuentro:</span>
                      <span className="font-medium text-gray-900 text-right max-w-[60%]">{reservation.trip.originLocation}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destino:</span>
                    <span className="font-medium text-gray-900">{reservation.trip.destination}</span>
                  </div>
                  {reservation.trip.departure && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium text-gray-900 text-right">
                        {formatDate(reservation.trip.departure)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/dashboard/user/reservations"
                className="block w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Ver mis reservas
              </Link>
              
              <Link
                href="/home2"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Recibirás un email de confirmación con los detalles de tu viaje.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ReservationConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    }>
      <ReservationConfirmedContent />
    </Suspense>
  );
}
