"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

type PaymentType = 'trip' | 'vehicle';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') || 'trip') as PaymentType;

  const getRetryLink = () => {
    if (type === 'vehicle') return "/vehicle-booking";
    return "/search";
  };

  const getRetryText = () => {
    if (type === 'vehicle') return "Buscar vehículos";
    return "Buscar viajes";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <AlertTriangle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pago cancelado
        </h1>
        
        <p className="text-gray-600 mb-6">
          No se ha completado el pago. Tu {type === 'vehicle' ? 'alquiler' : 'reserva'} no ha sido confirmada.
        </p>

        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800">
            Puedes intentar realizar el pago nuevamente cuando estés listo.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href={getRetryLink()}
            className="block w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {getRetryText()}
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
