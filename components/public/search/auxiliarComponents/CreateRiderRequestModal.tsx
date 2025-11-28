"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { createRiderRequest } from "@/lib/api/rider-requests";
import { toast } from "sonner";
import Script from "next/script";

type Props = {
  open: boolean;
  onClose: () => void;
};

interface GoogleWindow extends Window {
  google: {
    maps: {
      Geocoder: new () => unknown;
      places: {
        AutocompleteService: new () => { getPlacePredictions: (req: unknown, cb: (res: { description: string; place_id: string }[], status: string) => void) => void };
        PlacesService: new (node: Node) => { getDetails: (req: unknown, cb: (place: { geometry: { location: unknown }; formatted_address: string; place_id: string }, status: string) => void) => void };
        AutocompleteSessionToken: new () => unknown;
        PlacesServiceStatus: { OK: string };
      };
    };
  };
}

export default function CreateRiderRequestModal({ open, onClose }: Props) {
  const [origin, setOrigin] = useState("");
  const [originLocation, setOriginLocation] = useState(""); // place_id:... o "lat,lng"
  const [destination, setDestination] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [companions, setCompanions] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [additionalPassengers, setAdditionalPassengers] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<{ description: string; place_id: string }[]>([]);

  // Refs para Autocomplete y Mapa
  const originPlaceId = useRef<string | null>(null);
  const destinationPlaceId = useRef<string | null>(null);
  const geocoderRef = useRef<unknown>(null);
  const autoServiceRef = useRef<unknown>(null);
  const placesServiceRef = useRef<unknown>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTokenRef = useRef<unknown>(null);

  const companionsNum = Math.max(0, parseInt(companions || "0", 10) || 0);
  const additionalPassengersNum = Math.max(0, parseInt(additionalPassengers || "0", 10) || 0);
  const seatsRequested = 1 + companionsNum;
  const { status } = useSession();
  const router = useRouter();

  const reset = () => {
    setOrigin("");
    setOriginLocation("");
    setDestination("");
    setDestinationLocation("");
    setDepartureAt("");
    setCompanions("");
    setAdditionalPassengers("");
  };

  const submit = async () => {
    // Requiere autenticación: si no hay sesión, redirigir a login con callback
    if (status !== "authenticated") {
      try {
        const draft = {
          origin,
          originLocation,
          destination,
          destinationLocation,
          departureAt,
          companions: companionsNum,
          maxPassengers: Math.max(seatsRequested + additionalPassengersNum, seatsRequested),
        };
        sessionStorage.setItem("riderRequestDraft", JSON.stringify(draft));
      } catch { }
      const callbackUrl = typeof window !== 'undefined' ? window.location.href : '/search';
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    if (!origin || !destination || !originLocation || !destinationLocation || !departureAt) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    // asegurar que capacidad total sea coherente con acompañantes y adicionales
    const computedMax = Math.max(seatsRequested + additionalPassengersNum, seatsRequested);
    if (computedMax < seatsRequested) {
      toast.error("La capacidad total debe ser mayor o igual a las plazas que necesitas");
      return;
    }
    setLoading(true);
    try {
      await createRiderRequest({
        origin,
        originLocation,
        destination,
        destinationLocation,
        departureAt: new Date(departureAt).toISOString(),
        seatsRequested,
        maxPassengers: computedMax,
      });
      toast.success("Solicitud publicada. Los conductores podrán postularse.");
      reset();
      onClose();
    } catch {
      toast.error("No se pudo publicar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  // Evitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  // Inicializar servicios de Google Places cuando la librería esté lista (sin mapa)
  useEffect(() => {
    if (!open || !mapsReady) return;
    const g = (window as unknown as GoogleWindow).google;
    if (!g?.maps) return;
    geocoderRef.current = new g.maps.Geocoder();
    autoServiceRef.current = new g.maps.places.AutocompleteService();
    // PlacesService puede inicializarse con un div dummy si no hay mapa
    placesServiceRef.current = new g.maps.places.PlacesService(document.createElement('div'));
    sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();

    // No usamos widget Autocomplete ni mapa; solo sugerencias + detalles
  }, [open, mapsReady]);

  const selectPrediction = (pred: { description: string; place_id: string }, type: "origin" | "destination") => {
    const g = (window as unknown as GoogleWindow).google;
    if (!placesServiceRef.current) return;
    const request = { placeId: pred.place_id, fields: ["place_id", "formatted_address", "geometry"], sessionToken: sessionTokenRef.current };
    (placesServiceRef.current as { getDetails: (req: unknown, cb: (place: { geometry: { location: unknown }; formatted_address: string; place_id: string }, status: string) => void) => void }).getDetails(request, (place, status: string) => {
      if (status !== g.maps.places.PlacesServiceStatus.OK || !place?.geometry) return;
      if (status !== g.maps.places.PlacesServiceStatus.OK || !place?.geometry) return;
      if (type === "origin") {
        originPlaceId.current = place.place_id;
        setOrigin(place.formatted_address || searchQuery);
        setOriginLocation(`place_id:${place.place_id}`);
        // auto avanzar a destino
        if (step === 1) {
          setStep(2);
        }
      } else {
        destinationPlaceId.current = place.place_id;
        setDestination(place.formatted_address || searchQuery);
        setDestinationLocation(`place_id:${place.place_id}`);
        // auto avanzar a detalles
        if (step === 2) {
          setStep(3);
        }
      }
      setPredictions([]);
      setSearchQuery("");
      // Nueva sesión para próximas búsquedas
      sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();
    });
  };

  const handleQueryChange = (v: string) => {
    setSearchQuery(v);
    if (!v || !autoServiceRef.current) { setPredictions([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const g = (window as unknown as GoogleWindow).google;
      const req = {
        input: v,
        sessionToken: sessionTokenRef.current,
        types: ["address"],
        componentRestrictions: { country: ["ES"] },
      };
      (autoServiceRef.current as { getPlacePredictions: (req: unknown, cb: (res: { description: string; place_id: string }[], status: string) => void) => void }).getPlacePredictions(req, (res, status: string) => {
        if ((status === g.maps.places.PlacesServiceStatus.OK || status === "OK") && Array.isArray(res)) {
          setPredictions(res);
        } else {
          setPredictions([]);
        }
      });
    }, 200);
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="w-[92vw] sm:w-[85vw] md:w-[900px] max-w-[95vw] rounded-2xl bg-white p-6 shadow-2xl">
        {/* Carga Google Maps JS con Places */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
          onLoad={() => setMapsReady(true)}
        />
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Arma tu propio viaje</h2>
          <p className="mt-1 text-sm text-gray-600">
            Paso {step} de 5 · {step === 1 && "Seleccioná el origen exacto"}
            {step === 2 && "Seleccioná el destino exacto"}
            {step === 3 && "Elegí la fecha y hora de tu viaje"}
            {step === 4 && "Indicá si viajás con acompañantes"}
            {step === 5 && "Definí si querés sumar más personas a tu viaje"}
          </p>
          {step === 1 && (
            <p className="mt-2 text-sm text-gray-700">
              Si no encontraste un pasaje o no te convence el horario, publicá tu viaje. Indicá desde dónde salís; los
              conductores se postularán y vos elegís con quién ir. Si viajás con acompañantes, otros viajeros podrán
              sumarse hasta completar las plazas.
            </p>
          )}
          {step === 3 && (
            <p className="mt-2 text-sm text-gray-700">
              Elegí la fecha y hora en la que querés viajar. Los conductores disponibles para ese momento podrán
              postularse a tu solicitud.
            </p>
          )}
          {step === 4 && (
            <p className="mt-2 text-sm text-gray-700">
              Indicá si viajás acompañado. Tus acompañantes comparten tu reserva y ocupan plazas junto contigo.
            </p>
          )}
          {step === 5 && (
            <p className="mt-2 text-sm text-gray-700">
              Podés permitir que otras personas se sumen a tu viaje para compartir gastos. Ejemplo: si el viaje cuesta
              100€ y viajás con 1 acompañante (2 personas) y agregás 2 cupos para que se sumen, serían 4 personas en total.
              Cada persona pagaría 25€ + IVA (tus 2 plazas: 50€ + IVA; quienes se sumen: 25€ + IVA cada uno).
            </p>
          )}
        </div>

        {/* Paso 1: Origen */}
        {step === 1 && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-base md:text-lg font-semibold text-gray-900">Buscar origen</label>
              <input value={searchQuery} onChange={(e) => handleQueryChange(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Calle y número, lugar o comercio" />
              <p className="mt-1 text-xs text-gray-500">Elegí una opción o hacé click en el mapa.</p>
              {predictions.length > 0 && (
                <div className="mt-2 max-h-56 overflow-auto rounded-lg border bg-white shadow">
                  {predictions.map((p) => (
                    <button key={p.place_id} type="button" onClick={() => selectPrediction(p, "origin")} className="block w-full text-left px-3 py-2 hover:bg-gray-50">
                      {p.description}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500 break-all">Guardaremos: {originLocation || "(sin seleccionar)"}</p>
            </div>
          </div>
        )}

        {/* Paso 2: Destino */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              {origin && (
                <div className="mb-3 rounded-lg border border-custom-golden-200 bg-custom-golden-50 px-3 py-2">
                  <p className="text-sm md:text-base font-semibold text-gray-900">
                    Origen seleccionado
                  </p>
                  <p className="text-sm md:text-base font-bold text-gray-800 break-words">{origin}</p>
                </div>
              )}
              <label className="block text-base md:text-lg font-semibold text-gray-900">Buscar destino</label>
              <input value={searchQuery} onChange={(e) => handleQueryChange(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Calle y número, lugar o comercio" />
              <p className="mt-1 text-xs text-gray-500">Elegí una opción o hacé click en el mapa.</p>
              {predictions.length > 0 && (
                <div className="mt-2 max-h-56 overflow-auto rounded-lg border bg-white shadow">
                  {predictions.map((p) => (
                    <button key={p.place_id} type="button" onClick={() => selectPrediction(p, "destination")} className="block w-full text-left px-3 py-2 hover:bg-gray-50">
                      {p.description}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500 break-all">Guardaremos: {destinationLocation || "(sin seleccionar)"}</p>
            </div>
          </div>
        )}

        {/* Paso 3: Fecha */}
        {step === 3 && (
          <div className="grid grid-cols-1 gap-4">
            {(origin || destination) && (
              <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {origin && (
                  <div className="rounded-lg border border-custom-golden-200 bg-custom-golden-50 px-3 py-2">
                    <p className="text-sm md:text-base font-semibold text-gray-900">Origen seleccionado</p>
                    <p className="text-sm md:text-base font-bold text-gray-800 break-words">{origin}</p>
                  </div>
                )}
                {destination && (
                  <div className="rounded-lg border border-custom-golden-200 bg-custom-golden-50 px-3 py-2">
                    <p className="text-sm md:text-base font-semibold text-gray-900">Destino seleccionado</p>
                    <p className="text-sm md:text-base font-bold text-gray-800 break-words">{destination}</p>
                  </div>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha y hora de salida</label>
              <input type="datetime-local" value={departureAt} onChange={(e) => setDepartureAt(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
        )}

        {/* Paso 4: Acompañantes */}
        {step === 4 && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">¿Viajás con acompañantes? ¿Cuántos?</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={companions}
                onChange={(e) => setCompanions(e.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500">Plazas que ocupan juntos (vos + acompañantes): {seatsRequested}</p>
            </div>
          </div>
        )}

        {/* Paso 5: Pasajeros adicionales */}
        {step === 5 && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">¿Cuántas personas más querés permitir que se sumen?</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={additionalPassengers}
                onChange={(e) => setAdditionalPassengers(e.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Total de plazas del viaje: {seatsRequested + additionalPassengersNum}. Otros viajeros podrán postularse hasta completar este número.
              </p>
            </div>
          </div>
        )}

        {/* Mapa eliminado: solo buscador con sugerencias */}

        {/* Navegación del wizard */}
        <div className="mt-6 flex justify-between gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Cancelar</button>
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() =>
                  setStep((s) => {
                    if (s === 2) return 1;
                    if (s === 3) return 2;
                    if (s === 4) return 3;
                    if (s === 5) return 4;
                    return s;
                  })
                }
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Atrás
              </button>
            )}
            {step < 5 && (
              <button
                onClick={() => {
                  if (step === 1) {
                    if (!originLocation) return toast.error("Seleccioná el origen exacto");
                    setStep(2);
                  } else if (step === 2) {
                    if (!destinationLocation) return toast.error("Seleccioná el destino exacto");
                    setStep(3);
                  } else if (step === 3) {
                    if (!departureAt) return toast.error("Seleccioná la fecha y hora de salida");
                    setStep(4);
                  } else if (step === 4) {
                    if (companionsNum < 0) return toast.error("Cantidad inválida de acompañantes");
                    setStep(5);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-custom-golden-600 text-white hover:bg-custom-golden-700"
              >
                Continuar
              </button>
            )}
            {step === 5 && (
              <button onClick={submit} disabled={loading} className="px-4 py-2 rounded-lg bg-custom-golden-600 text-white hover:bg-custom-golden-700 disabled:opacity-60">
                {loading ? "Publicando..." : "Publicar solicitud"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
