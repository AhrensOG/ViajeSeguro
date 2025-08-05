"use client";

import { ResponseForQrPage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { CalendarDays, Clock } from "lucide-react";
import { DateTime } from "luxon";

type Props = {
    booking: ResponseForQrPage;
};

const OfferInfo = ({ booking }: Props) => {
    const { offer } = booking;
    const departure = DateTime.fromISO(String(booking.startDate)).setZone(offer.originalTimeZone);
    const arrival = DateTime.fromISO(String(booking.endDate)).setZone(offer.originalTimeZone);

    return (
        <section>
            <div className="flex items-center gap-2 text-custom-golden-700 mb-1">
                <CalendarDays className="size-5" />
                <span className="font-medium">{departure.setLocale("es").toFormat("cccc, d 'de' LLLL")}</span>
            </div>

            <h2 className="text-lg font-semibold text-custom-black-800 capitalize">
                {offer.withdrawLocation} → {offer.returnLocation}
            </h2>

            <p className="text-sm text-custom-gray-600 capitalize">
                Tipo de servicio: {offer.vehicleOfferType === "WITH_DRIVER" ? "Con conductor" : "Sin conductor"}
            </p>

            <div className="flex items-center gap-2 mt-1 text-sm text-custom-gray-700">
                <Clock className="size-4" />
                <span>
                    {departure.toFormat("HH:mm")} — {arrival.toFormat("HH:mm")}
                </span>
            </div>
        </section>
    );
};

export default OfferInfo;
