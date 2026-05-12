"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { Wallet, CheckCircle2, AlertTriangle } from "lucide-react";

type Props = {
  reservation: ReservationResponse;
};

const PriceInfo = ({ reservation }: Props) => {
  const { priceDetails, price, paymentMethod } = reservation;
  const isCash = paymentMethod === "CASH";

  const pricePerBag = 5;
  const extraBagsMatch = reservation.seatCode?.match(/EXTRA_BAGS:(\d+)/);
  const extraBags = extraBagsMatch ? Number(extraBagsMatch[1]) : 0;
  const extrasAmount = extraBags * pricePerBag;
  const IVA = Number(process.env.NEXT_PUBLIC_IVA || 21);
  const ivaAmount = (price * IVA) / 100;
  const totalWithIva = price + ivaAmount;

  if (!isCash) {
    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-full">
          <CheckCircle2 className="size-6 text-emerald-600" />
        </div>
        <div>
          <p className="font-semibold text-emerald-800">Pagado</p>
          <p className="text-xs text-emerald-600">El pasajero ya abonó todo por Stripe. No requiere cobro.</p>
        </div>
        <span className="ml-auto text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Stripe</span>
      </section>
    );
  }

  return (
    <section className="rounded-xl border-2 border-amber-400 overflow-hidden bg-amber-50">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Wallet className="size-5" />
          <span className="font-bold text-sm uppercase tracking-wide">Pendiente de cobro</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 px-3 py-3 bg-white border border-amber-300 rounded-xl">
          <AlertTriangle className="size-6 text-amber-600 shrink-0" />
          <div>
            <p className="text-base font-bold text-amber-900">Debes cobrar al pasajero</p>
            <p className="text-2xl font-black text-amber-600">€ {totalWithIva.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 space-y-2 text-sm border border-amber-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Precio base</span>
            <span className="text-gray-900 font-medium">
              € {priceDetails.basePrice.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {priceDetails.discounts.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Descuentos:</p>
              {priceDetails.discounts.map((discount, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">- {discount.description}</span>
                  <span className="text-red-500">–€ {discount.amount.toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
            </div>
          )}

          {extraBags > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Equipaje adicional ({extraBags} × €5)</span>
              <span className="text-gray-900">€ {extrasAmount.toFixed(2).replace(".", ",")}</span>
            </div>
          )}

          <div className="border-t border-amber-200 pt-2 mt-2" />

          <div className="flex justify-between items-center">
            <span className="text-gray-600">IVA ({IVA}%)</span>
            <span className="text-gray-900">€ {ivaAmount.toFixed(2).replace(".", ",")}</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-amber-700">
              € {totalWithIva.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <p className="text-xs text-amber-700 text-center font-medium">
          No confirmes el abordaje hasta haber recibido el pago
        </p>
      </div>
    </section>
  );
};

export default PriceInfo;
