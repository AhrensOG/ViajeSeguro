"use client";

import { ResponseForQrPage } from "@/lib/api/vehicle-booking/vehicleBooking.types";

type Props = {
    booking: ResponseForQrPage;
};

const BookingPriceInfo = ({ booking }: Props) => {
    const IVA_PERCENT = parseFloat(process.env.NEXT_PUBLIC_IVA || "0");

    const { startDate, endDate, offer } = booking;

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

    return (
        <section className="bg-custom-gray-100 p-4 rounded-lg text-sm flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-custom-gray-600">Precio por día:</span>
                <span className="text-custom-black-900 font-medium">€ {dailyPrice.toFixed(2).replace(".", ",")}</span>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-custom-gray-600">Subtotal ({days} días):</span>
                <span className="text-custom-black-900 font-medium">€ {basePrice.toFixed(2).replace(".", ",")}</span>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-custom-gray-600">IVA ({IVA_PERCENT}%):</span>
                <span className="text-custom-black-900 font-medium">€ {ivaAmount.toFixed(2).replace(".", ",")}</span>
            </div>

            <hr className="border-t border-custom-gray-300 my-2" />

            <div className="flex justify-between items-center">
                <span className="text-custom-gray-700">Total con IVA:</span>
                <span className="text-lg font-bold text-custom-black-900">€ {total.toFixed(2).replace(".", ",")}</span>
            </div>
        </section>
    );
};

export default BookingPriceInfo;
