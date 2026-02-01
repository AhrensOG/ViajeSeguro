import { CardReservationVehicleOfferProps } from "@/lib/api/vehicleOffer/vehicleOffers.types";
import { calculateTotalDays } from "@/lib/functions";
import { ArrowRight, Fuel, MapPin, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CardProps extends CardReservationVehicleOfferProps {
  onClick: () => void;
}

// Traducciones de enums
const fuelTypeMap = {
  DIESEL: "Diésel",
  GASOLINE: "Nafta",
  ELECTRIC: "Eléctrico",
  HYBRID: "Híbrido",
} as const;

const transmissionTypeMap = {
  MANUAL: "Manual",
  AUTOMATIC: "Automática",
} as const;

const featuresMap = {
  GPS: "GPS incluido",
  AIR_CONDITIONING: "Aire acondicionado",
  BLUETOOTH: "Bluetooth",
  REAR_CAMERA: "Cámara trasera",
  USB: "Puerto USB",
  PARKING_SENSORS: "Sensores de aparcamiento",
  CRUISE_CONTROL: "Control de crucero",
} as const;

type FuelKey = keyof typeof fuelTypeMap;
type TransmissionKey = keyof typeof transmissionTypeMap;
type FeatureKey = keyof typeof featuresMap;

export default function CardReservation(props: CardProps) {
  const {
    imageUrl,
    title,
    capacity,
    fuelType,
    transmissionType,
    features,
    whitdrawLocation,
    dateStart,
    dateEnd,
    pricePerDay,
    requestedStartDate,
    requestedEndDate,
    requestedOfferType,
    requestedCapacity,
  } = props;
  const formatDate = (input: string): string => {
    const date = new Date(input);
    const yyyy = date.getFullYear();
    const mm = `${date.getMonth() + 1}`.padStart(2, "0");
    const dd = `${date.getDate()}`.padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <article
      className="flex flex-col md:flex-row gap-6 w-full p-5 border border-custom-gray-300 rounded-xl shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group"
      onClick={props.onClick}
    >
      {/* Sección Imagen */}
      <div className="relative w-full md:w-72 h-52 md:h-auto shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          className="object-cover transition-transform group-hover:scale-105 duration-500"
          src={imageUrl.length > 0 ? imageUrl[0] : "/main/img_placeholder.webp"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 300px, 300px"
        />
      </div>

      {/* Sección Información Principal */}
      <div className="flex flex-col justify-between grow gap-4 py-1">
        <div>
          <h3 className="text-custom-gray-800 font-bold text-xl mb-3">{title}</h3>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
            <p className="flex gap-2 items-center text-sm text-custom-gray-700">
              <Users className="size-4 text-custom-gray-500" />
              <span className="font-medium">{capacity} personas</span>
            </p>
            <p className="flex gap-2 items-center text-sm text-custom-gray-700">
              <Fuel className="size-4 text-custom-gray-500" />
              <span className="font-medium">
                {fuelTypeMap[fuelType as FuelKey] ?? fuelType}
              </span>
            </p>
            <p className="flex gap-2 items-center text-sm text-custom-gray-700">
              <Settings className="size-4 text-custom-gray-500" />
              <span className="font-medium">
                {transmissionTypeMap[transmissionType as TransmissionKey] ?? transmissionType}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {features.slice(0, 5).map((featureKey, idx) => (
              <span
                key={idx}
                className="text-xs font-medium bg-custom-gray-100 text-custom-gray-600 px-2.5 py-1 rounded-full border border-custom-gray-200"
              >
                {featuresMap[featureKey as FeatureKey] ?? featureKey}
              </span>
            ))}
            {features.length > 5 && (
              <span className="text-xs font-medium bg-custom-gray-100 text-custom-gray-600 px-2.5 py-1 rounded-full border border-custom-gray-200">
                +{features.length - 5}
              </span>
            )}
          </div>
        </div>

        <p className="flex items-center gap-2 text-sm font-medium text-custom-gray-600 mt-auto">
          <MapPin className="size-4 text-custom-golden-600" />
          {whitdrawLocation}
        </p>
      </div>

      {/* Sección Precio y Acción */}
      <div className="flex flex-col w-full md:w-auto md:min-w-[15rem] justify-between border-t md:border-t-0 md:border-l border-custom-gray-200 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0 gap-4">
        <div className="flex flex-col items-start md:items-end">
          <p className="text-xs text-custom-gray-500 mb-1 font-medium bg-custom-gray-100 px-2 py-1 rounded">
            {formatDate(dateStart)} - {formatDate(dateEnd)}
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-custom-gray-900">
              {pricePerDay}€
            </span>
            <span className="text-sm text-custom-gray-500 font-medium">/ día</span>
          </div>
          <p className="text-[10px] text-custom-gray-500 text-right mt-1 max-w-[150px] leading-3">
            Incluye 200km/día.<br />Exceso 0,50€/km
          </p>
          <p className="text-sm text-custom-gray-500 text-right mt-1">
            Total aprox:{" "}
            <span className="font-semibold text-custom-gray-700">
              {(Number(pricePerDay) * calculateTotalDays(dateStart, dateEnd)).toFixed(2)}€
            </span>
            {" "}x {calculateTotalDays(dateStart, dateEnd)} días
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <Link
            href={`/vehicle-booking?id=${props.id}&dateStart=${requestedStartDate}&dateEnd=${requestedEndDate}&capacity=${requestedCapacity}&vehicleOfferType=${requestedOfferType}`}
            className="w-full py-3 px-4 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            Reservar
            <ArrowRight className="size-4" />
          </Link>
          <p className="text-xs text-center text-custom-green-600 font-medium flex items-center justify-center gap-1">
            <span className="size-1.5 rounded-full bg-custom-green-600"></span>
            Cancelación gratuita
          </p>
        </div>
      </div>
    </article>
  );
}
