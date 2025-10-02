import {
  convertUTCToLocalDate,
  convertUTCToLocalTime,
  getDurationString,
} from "@/lib/functions";
import { TripCardType } from "@/lib/shared/types/trip-service-type.type";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const TripCard = ({
  trip,
  timeZone,
}: {
  trip: TripCardType;
  timeZone: string;
}) => {
  const departureTime = convertUTCToLocalTime(trip.departure, timeZone);
  const arrivalTime = convertUTCToLocalTime(trip.arrival, timeZone);
  const duration = getDurationString(trip.departure, trip.arrival);
  const localDate = convertUTCToLocalDate(trip.departure, timeZone);

  const [int, decimal] = trip.basePrice.toFixed(2).split(".");
  const discountedPrice = +(trip.basePrice * 0.6).toFixed(2);
  const [dInt, dDec] = discountedPrice.toFixed(2).split(".");
  return (
    <div className="bg-white rounded-lg shadow-md border border-custom-gray-300 overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center max-w-sm">
            <div className="flex gap-2 items-center">
              <span className="font-bold text-custom-black-700">
                {departureTime}
              </span>
              <div className="w-3 h-3 rounded-full border-2 border-custom-golden-600 bg-white" />
            </div>
            <div className="flex-1 relative">
              <div className="h-1 bg-custom-golden-600 w-full absolute top-1/2 -translate-y-1/2" />
              <div className="text-center text-xs text-custom-gray-600 relative bg-white inline-block px-2 left-1/2 -translate-x-1/2">
                {duration}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 rounded-full border-2 border-custom-golden-600 bg-custom-golden-600" />
              <span className="font-bold text-custom-black-700">
                {arrivalTime}
              </span>
            </div>
          </div>
          {/* City names row (above locations) */}
          <div className="max-w-sm flex justify-between text-custom-black-700 text-sm font-semibold mt-1">
            <div className="text-start">{trip.origin}</div>
            <div className="text-end">{trip.destination}</div>
          </div>
          <div className="max-w-sm flex justify-between text-custom-gray-800 font-semibold text-sm">
            <div className="text-start">{trip.originLocation}</div>
            <div className="text-end">{trip.destinationLocation}</div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="text-right">
            <span className="text-sm text-custom-gray-800 font-light">
              {localDate}
            </span>
            {/* Promotion label */}
            <div className="text-sm md:text-base font-semibold text-custom-golden-700 mt-1">
              Descuento promocional del 40 %
            </div>
            {/* Original price (struck-through) */}
            <div className="text-base text-custom-gray-500 line-through">
              {int}
              <span className="align-top"> ,{decimal}</span> €
            </div>
            {/* Discounted price (40% off) */}
            <div className="font-bold text-3xl text-custom-black-700">
              {dInt}
              <span className="text-sm align-top"> ,{dDec}</span> €
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-custom-gray-300 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-custom-gray-700">
            Viaje Seguro
          </span>
        </div>
        <Link
          href={`/trip?id=${trip.id}`}
          className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-medium rounded-lg px-4 py-2 flex items-center">
          Reservar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default TripCard;
