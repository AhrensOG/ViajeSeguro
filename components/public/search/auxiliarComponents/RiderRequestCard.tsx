import { convertUTCToLocalDate, convertUTCToLocalTime } from "@/lib/functions";
import { ArrowRight, Users, Car, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export type RiderRequestCardType = {
  id: string;
  origin: string;
  originLocation: string;
  destination: string;
  destinationLocation: string;
  departureAt: string; // ISO
  seatsRequested: number;
  maxPassengers: number;
  finalPrice?: number;
  passengers?: Array<{ status: string }>;
  chosenBid?: unknown;
};

export default function RiderRequestCard({
  request,
  timeZone,
}: {
  request: RiderRequestCardType;
  timeZone: string;
}) {
  const localDate = convertUTCToLocalDate(request.departureAt, timeZone);
  const localTime = convertUTCToLocalTime(request.departureAt, timeZone);
  const maskLocation = (loc?: string) => {
    if (!loc) return "";
    const isPlaceId = loc.startsWith("place_id:");
    const isCoords = /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(loc);
    return isPlaceId || isCoords ? "Ubicación precisa seleccionada" : loc;
  };
  const IVA = 21;
  const base = typeof request.finalPrice === "number" ? request.finalPrice : undefined;
  const totalWithIVA = typeof base === "number" ? base * (1 + IVA / 100) : undefined;

  const joinedCount = Array.isArray(request.passengers)
    ? request.passengers.filter((p) => p.status === "JOINED").length
    : undefined;
  const available = typeof joinedCount === "number" ? Math.max(request.maxPassengers - joinedCount, 0) : undefined;
  const driverAssigned = Boolean(request.chosenBid);

  return (
    <div className="relative z-0 bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden">
      <div className="p-4 md:p-5 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold">
              Armar tu viaje
            </span>
            <span className="text-xs text-custom-gray-600">Solicitud de pasajero</span>
          </div>

          <div className="text-custom-black-800 text-sm md:text-base font-semibold flex items-center gap-2">
            <span className="truncate max-w-[180px] md:max-w-[240px]">{request.origin}</span>
            <span className="opacity-60">→</span>
            <span className="truncate max-w-[180px] md:max-w-[240px]">{request.destination}</span>
          </div>
          <div className="text-xs md:text-sm text-custom-gray-700 flex justify-between max-w-lg">
            <span className="truncate">{maskLocation(request.originLocation)}</span>
            <span className="truncate">{maskLocation(request.destinationLocation)}</span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 text-custom-gray-800">
              <Users className="h-4 w-4 text-blue-700" />
              <span>
                <span className="font-semibold">Postulados:</span> {typeof joinedCount === "number" ? joinedCount : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-custom-gray-800">
              <Car className="h-4 w-4 text-blue-700" />
              <span>
                <span className="font-semibold">Plazas:</span> {request.maxPassengers}
                {typeof available === "number" && <span className="ml-2 text-xs text-custom-gray-600">({available} disp.)</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {driverAssigned ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Conductor asignado</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-700 font-medium">Sin conductor aún</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-2 text-sm text-custom-gray-700">
            <span className="font-semibold">Salida:</span> {localDate} · {localTime}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="text-right">
            {typeof totalWithIVA === "number" && (
              <div className="font-bold text-2xl text-custom-black-800">
                {totalWithIVA.toFixed(2).replace(".", ",")} <span className="text-sm align-top">€</span>
              </div>
            )}
            <div className="text-xs text-custom-gray-700">Total con IVA</div>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-200 px-4 py-3 md:px-5 flex items-center justify-between bg-blue-50/50">
        <div className="flex items-center gap-2 text-blue-800 text-sm font-semibold">
          Solicitud abierta
        </div>
        <Link
          href={`/rider-request?id=${request.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 flex items-center"
        >
          Unirme al viaje
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
