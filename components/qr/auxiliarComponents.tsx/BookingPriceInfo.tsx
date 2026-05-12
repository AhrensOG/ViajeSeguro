"use client";

import { ResponseForQrPage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { Wallet, CheckCircle2, AlertTriangle } from "lucide-react";

type Props = {
    booking: ResponseForQrPage;
};

const BookingPriceInfo = ({ booking }: Props) => {
    const IVA_PERCENT = parseFloat(process.env.NEXT_PUBLIC_IVA || "0");
    const { startDate, endDate, offer, paymentMethod } = booking;
    const isCash = paymentMethod === "CASH";

    const calculateDays = (start: string, end: string) => {
        const startDt = new Date(start);
        const endDt = new Date(end);
        const diffTime = Math.abs(endDt.getTime() - startDt.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const days = calculateDays(String(startDate), String(endDate));
    const dailyPrice = offer.pricePerDay;
    const basePrice = dailyPrice * days;
    const ivaAmount = basePrice * (IVA_PERCENT / 100);
    const total = basePrice + ivaAmount;

    if (!isCash) {
        return (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                    <CheckCircle2 className="size-6 text-emerald-600" />
                </div>
                <div>
                    <p className="font-semibold text-emerald-800">Pagado</p>
                    <p className="text-xs text-emerald-600">El cliente ya abonó todo por Stripe. No requiere cobro.</p>
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
                        <p className="text-base font-bold text-amber-900">Debes cobrar al cliente</p>
                        <p className="text-2xl font-black text-amber-600">€ {total.toFixed(2).replace(".", ",")}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 space-y-2 text-sm border border-amber-200">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Precio por día</span>
                        <span className="text-gray-900 font-medium">€ {dailyPrice.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal ({days} días)</span>
                        <span className="text-gray-900 font-medium">€ {basePrice.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">IVA ({IVA_PERCENT}%)</span>
                        <span className="text-gray-900 font-medium">€ {ivaAmount.toFixed(2).replace(".", ",")}</span>
                    </div>

                    <div className="border-t border-amber-200 pt-2" />

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-amber-700">€ {total.toFixed(2).replace(".", ",")}</span>
                    </div>
                </div>

                <p className="text-xs text-amber-700 text-center font-medium">
                    No confirmes la entrega hasta haber recibido el pago
                </p>
            </div>
        </section>
    );
};

export default BookingPriceInfo;
