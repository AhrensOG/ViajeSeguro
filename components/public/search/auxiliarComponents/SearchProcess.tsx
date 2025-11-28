"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  SearchTrip,
  SearchTripResult,
  TripServiceType,
} from "@/lib/shared/types/trip-service-type.type";
import { toast } from "sonner";
import TripCard from "./TripCard";
import RiderRequestCard, { RiderRequestCardType } from "./RiderRequestCard";
import { searchRiderRequests } from "@/lib/api/rider-requests";
// Client-side date normalization not needed; backend already returns exact day groups
import TripCardFallback from "@/lib/client/components/fallbacks/shared/TripCardFallback";
import { searchTrips } from "@/lib/api/trip";
import RiderRequestCTA from "./RiderRequestCTA";
import CalendarMonth from "./CalendarMonth";

const EMPTY_RESULT: SearchTripResult = {
  exact: [],
  previous: [],
  next: [],
  futureAll: [],
};

const SearchProcess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [trips, setTrips] = useState<SearchTripResult>(EMPTY_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [riderRequests, setRiderRequests] = useState<RiderRequestCardType[]>([]);
  const [nearbyRiderRequests, setNearbyRiderRequests] = useState<RiderRequestCardType[]>([]);
  const [invalidParams, setInvalidParams] = useState(false);

  const departureParam = searchParams.get("departure");
  // Calendar state based on current departure
  const initialDate = departureParam ? new Date(departureParam) : new Date();
  const [calYear, setCalYear] = useState(initialDate.getFullYear());
  const [calMonth, setCalMonth] = useState(initialDate.getMonth()); // 0-11
  const yyyyMmDd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const selectedDate = departureParam ? yyyyMmDd(new Date(departureParam)) : yyyyMmDd(new Date());
  // Backend groups results; no need to compute local target day here

  useEffect(() => {
    const fetchTrips = async () => {
      const origin = searchParams.get("origin");
      const destination = searchParams.get("destination");
      const serviceType =
        (searchParams.get("serviceType") as TripServiceType) || "SIMPLE_TRIP";
      const departure = departureParam || "";

      if (!origin || !destination || !departure) {
        setTrips(EMPTY_RESULT);
        setInvalidParams(true);
        return;
      }

      setInvalidParams(false);
      setIsLoading(true);

      const query: SearchTrip = { origin, destination, serviceType, departure };

      try {
        const data = await searchTrips(query);
        setTrips(data); // <-- ahora data es SearchTripResult
        // Rider Requests con rango +/- 3 días
        try {
          const d = new Date(departure);
          const dateFrom = new Date(d);
          dateFrom.setDate(d.getDate() - 3);
          const dateTo = new Date(d);
          dateTo.setDate(d.getDate() + 3);

          const rr = await searchRiderRequests({
            origin,
            destination,
            dateFrom: dateFrom.toISOString(),
            dateTo: dateTo.toISOString()
          });

          const allRequests = Array.isArray(rr) ? rr : [];

          // Filtrar exactas vs cercanas
          const targetYMD = yyyyMmDd(d);
          const exact: RiderRequestCardType[] = [];
          const nearby: RiderRequestCardType[] = [];

          allRequests.forEach(req => {
            const reqDate = new Date(req.departureAt);
            // Comparar solo fecha (YYYY-MM-DD) ignorando hora/timezone estricto
            // Usamos la fecha local del usuario para comparar
            const reqYMD = yyyyMmDd(reqDate);

            if (reqYMD === targetYMD) {
              exact.push(req);
            } else {
              nearby.push(req);
            }
          });

          setRiderRequests(exact);
          setNearbyRiderRequests(nearby);
        } catch {
          setRiderRequests([]);
          setNearbyRiderRequests([]);
        }
      } catch (error) {
        console.log(error);
        toast.info("¡Ups! Ocurrió un error inesperado.", {
          description: "Intenta nuevamente o contacta con nuestro soporte",
        });
        setTrips(EMPTY_RESULT);
        setRiderRequests([]);
        setNearbyRiderRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [searchParams, departureParam]);

  // Build counts per day for current month from trips and rider requests
  const allTrips = [
    ...(trips.exact || []),
    ...(trips.previous || []),
    ...(trips.next || []),
    ...(trips.futureAll || []),
  ];
  const counts: Record<string, number> = {};
  // Count normal trips
  for (const t of allTrips) {
    const d = new Date(t.departure);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const key = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  // Count rider requests (exact + nearby)
  for (const r of [...riderRequests, ...nearbyRiderRequests]) {
    const d = new Date(r.departureAt);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const key = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  const goPrevMonth = () => {
    const m = calMonth - 1;
    if (m < 0) {
      setCalYear(calYear - 1);
      setCalMonth(11);
    } else {
      setCalMonth(m);
    }
  };
  const goNextMonth = () => {
    const m = calMonth + 1;
    if (m > 11) {
      setCalYear(calYear + 1);
      setCalMonth(0);
    } else {
      setCalMonth(m);
    }
  };

  const onSelectDay = (yyyyMmDd: string) => {
    // Build a safe ISO at midday local time to avoid timezone boundary issues
    const [y, m, d] = yyyyMmDd.split("-").map((v) => parseInt(v, 10));
    const localMidday = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
    const iso = localMidday.toISOString();
    const params = new URLSearchParams(searchParams.toString());
    params.set("departure", iso);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ============================
  // Adaptación mínima a la nueva respuesta
  // ============================

  // El backend ya devuelve "exact" acotado a la fecha buscada; no re-filtramos en cliente
  const tripsOnSameDay = trips.exact || [];

  const nearbyTrips = [...(trips.previous || []), ...(trips.next || [])];

  // Opcional: más opciones a futuro (lo mantenemos separado para no romper tu UX actual)
  const futureTrips = trips.futureAll || [];

  const noResults =
    tripsOnSameDay.length === 0 &&
    nearbyTrips.length === 0 &&
    futureTrips.length === 0;

  let resultsContent: React.ReactNode;
  if (isLoading) {
    resultsContent = (
      <>
        {[...Array(4)].map((_, i) => (
          <TripCardFallback key={i} />
        ))}
      </>
    );
  } else if (invalidParams) {
    resultsContent = (
      <div className="text-center py-12">
        <p className="text-lg font-semibold text-custom-gray-700">
          Faltan datos para buscar viajes.
        </p>
        <p className="text-sm text-custom-gray-500 mt-2">
          Asegúrate de completar el origen, destino y fecha para poder
          mostrar los resultados.
        </p>
      </div>
    );
  } else {
    resultsContent = (
      <>
        {(riderRequests.length > 0 || nearbyRiderRequests.length > 0) && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-center">
              <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold shadow-sm">
                Solicitudes &quot;Armar tu viaje&quot; de otros usuarios
              </span>
            </div>
            <div className="space-y-4">
              {riderRequests.map((req) => (
                <RiderRequestCard key={req.id} request={req} timeZone={userTimeZone} />
              ))}
              {/* Mostrar también las cercanas si no hay exactas, o siempre? 
                  Mejor mostrar las cercanas en su sección, pero si el usuario busca X fecha y hay una el día anterior, debería verla.
                  Por ahora, mantengamos las exactas aquí y las cercanas abajo, pero aseguremos que se vean.
              */}
            </div>
          </div>
        )}

        {noResults && riderRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-custom-gray-700">
              No se encontraron viajes disponibles para esta fecha.
            </p>
            <p className="text-sm text-custom-gray-500 mt-2">
              Estamos creciendo para ofrecerte cada vez más opciones. Prueba
              buscar otra fecha cercana o contáctanos si necesitas ayuda.
            </p>
          </div>
        )}

        {tripsOnSameDay.length === 0 &&
          (nearbyTrips.length > 0 || futureTrips.length > 0) && (
            <p className="text-sm text-center text-custom-gray-600">
              No hay viajes exactos para la fecha seleccionada, pero
              encontramos estas opciones:
            </p>
          )}

        {tripsOnSameDay.length > 0 && (
          <>
            {tripsOnSameDay.map((trip) => (
              <TripCard key={trip.id} trip={trip} timeZone={userTimeZone} />
            ))}
          </>
        )}

        {(nearbyTrips.length > 0 || nearbyRiderRequests.length > 0) && (
          <div className="mt-10 text-center">
            <h2 className="text-base font-semibold text-custom-gray-800 mb-4">
              Otras opciones en fechas cercanas:
            </h2>
            <div className="space-y-4">
              {nearbyTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} timeZone={userTimeZone} />
              ))}
              {nearbyRiderRequests.map((req) => (
                <RiderRequestCard key={req.id} request={req} timeZone={userTimeZone} />
              ))}
            </div>
          </div>
        )}

        {futureTrips.length > 0 && (
          <div className="mt-10 text-center">
            <h2 className="text-base font-semibold text-custom-gray-800 mb-4">
              Más opciones a futuro:
            </h2>
            <div className="space-y-4">
              {futureTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} timeZone={userTimeZone} />
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Left: Results list */}
          <div className="lg:col-span-3 space-y-4 relative z-0">
            {/* CTA fija al nivel de los resultados */}
            <div className="sticky top-4 z-[60] bg-white pt-2 pb-3 shadow-sm border-b border-custom-gray-200">
              <RiderRequestCTA />
            </div>
            {resultsContent}
          </div>
          {/* Right: Sticky Calendar (wider) */}
          <div className="lg:col-span-2">
            <div className="sticky top-4">
              <CalendarMonth
                year={calYear}
                month={calMonth}
                selectedDate={selectedDate}
                counts={counts}
                onPrevMonth={goPrevMonth}
                onNextMonth={goNextMonth}
                onSelectDay={onSelectDay}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProcess;
