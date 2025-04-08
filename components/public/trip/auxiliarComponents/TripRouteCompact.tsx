import { TripRouteCompactType } from "@/lib/client/trip/types/trip.types";
import { MapIcon } from "lucide-react";

const TripRouteCompact = ({
  departureTime,
  duration,
  arrivalTime,
  originCity,
  originLocation,
  destinationCity,
  destinationLocation,
  size = "md",
}: TripRouteCompactType) => {
  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18,
  }[size];

  return (
    <div className="relative pb-6">
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-6 items-center justify-between min-w-[50px]">
          <span className={`font-bold text-custom-black-800 ${textSize}`}>
            {departureTime}
          </span>
          <span className={`text-custom-gray-600 text-xs`}>{duration}</span>
          <span className={`font-bold text-custom-black-800 ${textSize}`}>
            {arrivalTime}
          </span>
        </div>

        <div className="flex flex-col items-center justify-between py-1">
          <div className="h-3 w-3 rounded-full bg-custom-white-100 border-2 border-custom-golden-600" />
          <div className="w-1 grow bg-custom-golden-600" />
          <div className="h-3 w-3 rounded-full bg-custom-golden-600 border-2 border-custom-golden-600" />
        </div>

        <div className="flex flex-col w-full items-start justify-between">
          <div
            className={`font-medium text-custom-black-800 flex flex-col ${textSize}`}>
            <span className="flex items-center gap-1">
              {originCity}
              <MapIcon size={iconSize} className="text-custom-golden-600" />
            </span>
            {originLocation && (
              <span className="text-xs font-light text-custom-gray-600">
                {originLocation}
              </span>
            )}
          </div>

          <div
            className={`font-medium text-custom-black-800 flex flex-col ${textSize}`}>
            <span className="flex items-center gap-1">
              {destinationCity}
              <MapIcon size={iconSize} className="text-custom-golden-600" />
            </span>
            {destinationLocation && (
              <span className="text-xs font-light text-custom-gray-600">
                {destinationLocation}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripRouteCompact;
