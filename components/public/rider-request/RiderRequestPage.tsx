"use client";

import NavBar from "@/components/public/navigation/NavBar";
import Footer from "@/components/public/navigation/Footer";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getRiderRequestById, RiderRequestDetail, joinRiderRequest, leaveRiderRequest, selectDriverBid, DriverBid } from "@/lib/api/rider-requests";
import { convertUTCToLocalDate, convertUTCToLocalTime } from "@/lib/functions";
import TripRouteCompact from "@/lib/client/components/TripRouteCompact";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function RiderRequestPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [req, setReq] = useState<RiderRequestDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<DriverBid | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRiderRequestById(id);
        setReq(data);
      } catch {
        setError("No se encontró la solicitud");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const localDate = req?.departureAt ? convertUTCToLocalDate(req.departureAt, timeZone) : "";
  const localTime = req?.departureAt ? convertUTCToLocalTime(req.departureAt, timeZone) : "";
  const maskLocation = (loc?: string) => {
    if (!loc) return "";
    const isPlaceId = loc.startsWith("place_id:");
    const isCoords = /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(loc);
    return isPlaceId || isCoords ? "Ubicación precisa seleccionada" : loc;
  };

  const IVA = 21;
  const base = typeof req?.finalPrice === "number" ? req.finalPrice : undefined;
  const ivaAmount = typeof base === "number" ? (base * IVA) / 100 : undefined;
  const totalWithIVA = typeof base === "number" ? base * (1 + IVA / 100) : undefined;

  const seatsRequested = req?.seatsRequested ?? 0;
  const capacity = req?.maxPassengers ?? 0;
  const seatsAvailable = Math.max(capacity - seatsRequested, 0);

  const organizer = `${req?.user?.name ?? ""} ${req?.user?.lastName ?? ""}`.trim() || "Usuario";

  // Logic for driver display:
  // If there is a chosenBid, show that driver.
  // Otherwise, show "Aún no hay conductor asignado".
  const chosenDriverName = req?.chosenBid?.driver
    ? `${req.chosenBid.driver.name ?? ""} ${req.chosenBid.driver.lastName ?? ""}`.trim()
    : null;
  const driverStatus = chosenDriverName || "Aún no hay conductor asignado";

  // Ejemplos progresivos usando totalWithIVA cuando esté disponible
  const share2 = typeof totalWithIVA === "number" ? +(totalWithIVA / 2).toFixed(2) : undefined;
  const share3 = typeof totalWithIVA === "number" ? +(totalWithIVA / 3).toFixed(2) : undefined;
  const share4 = typeof totalWithIVA === "number" ? +(totalWithIVA / 4).toFixed(2) : undefined;

  const userId = session?.user?.id;
  const isJoined = !!(req?.passengers?.some((p) => p.userId === userId && p.status === "JOINED"));
  const isOwner = session?.user?.id === req?.userId;

  // Check if current user has a bid (for drivers)
  const myBid = req?.bids?.find(b => b.driverId === userId);

  const router = useRouter(); // Add router hook if not already present (it is imported in line 6? No, line 6 is useSearchParams. Need to import useRouter from next/navigation)

  const openJoinModal = () => {
    if (!session) {
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }
    setShowJoinModal(true);
  };
  const closeJoinModal = () => setShowJoinModal(false);
  const openBidModal = (bid: DriverBid) => {
    setSelectedBid(bid);
    setShowBidModal(true);
    setCarouselIndex(0);
  };
  const closeBidModal = () => {
    setShowBidModal(false);
    setSelectedBid(null);
  };

  const refresh = async () => {
    if (!id) return;
    try {
      const data = await getRiderRequestById(id);
      setReq(data);
    } catch { }
  };

  const handleConfirm = async () => {
    if (!id) return;
    if (!session) {
      toast.info("Inicia sesión para unirte al viaje");
      return;
    }
    try {
      setSubmitting(true);
      if (isJoined) {
        if (isOwner) {
          toast.error("Eres el creador de esta solicitud y no puedes salir");
          return;
        }
        await leaveRiderRequest(id);
        toast.success("Has salido del viaje");
      } else {
        await joinRiderRequest(id);
        toast.success("Te has unido al viaje");
      }
      await refresh();
      closeJoinModal();
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "No se pudo completar la acción");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
        {loading && <div className="text-sm text-custom-gray-700">Cargando...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && req && (
          <div>
            <h1 className="text-3xl font-bold text-custom-black-800 mb-6">Unirme al viaje</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Columna izquierda: 3 cards apiladas */}
              <div className="space-y-4 lg:col-span-2">
                {/* Card: Detalle del viaje */}
                <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
                  <div className="mb-4">
                    <div className="text-sm text-custom-gray-600">Salida</div>
                    <div className="text-lg font-semibold text-custom-black-900">{localDate} · {localTime}</div>
                  </div>
                  <TripRouteCompact
                    departureTime={localTime}
                    duration={""}
                    arrivalTime={""}
                    originCity={req.origin}
                    originLocation={maskLocation(req.originLocation)}
                    destinationCity={req.destination}
                    destinationLocation={maskLocation(req.destinationLocation)}
                    size="md"
                  />
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-custom-gray-600">Organizador</div>
                      <div className="font-medium text-custom-black-800">{organizer}</div>
                    </div>
                    <div>
                      <div className="text-xs text-custom-gray-600">Conductor</div>
                      <div className="font-medium text-custom-black-800">{driverStatus}</div>
                    </div>
                    <div>
                      <div className="text-xs text-custom-gray-600">Asientos disponibles</div>
                      <div className="font-medium text-custom-black-800">{seatsAvailable}</div>
                    </div>
                  </div>
                </div>

                {/* Card: Mi Postulación (Solo si soy conductor y me postulé) */}
                {myBid && !isOwner && (
                  <div className={`p-6 shadow-sm rounded-lg border ${myBid.status === 'ACCEPTED' ? 'bg-emerald-50 border-emerald-200' : myBid.status === 'REJECTED' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                    <h3 className={`text-lg font-semibold mb-2 ${myBid.status === 'ACCEPTED' ? 'text-emerald-800' : myBid.status === 'REJECTED' ? 'text-rose-800' : 'text-amber-800'}`}>
                      Mi Postulación
                    </h3>
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">Estado:</span>{' '}
                        {myBid.status === 'PENDING' && 'Pendiente - Esperando respuesta del organizador'}
                        {myBid.status === 'ACCEPTED' && '¡Aceptada! Eres el conductor de este viaje.'}
                        {myBid.status === 'REJECTED' && 'No seleccionada - El organizador ha elegido otro conductor.'}
                      </p>
                      {myBid.message && (
                        <p className="mt-1 text-xs opacity-80">Tu mensaje: {myBid.message}</p>
                      )}
                      {req.chosenBid && req.chosenBid.id !== myBid.id && (
                        <p className="mt-2 text-xs font-medium">
                          Se ha asignado otro conductor: {req.chosenBid.driver?.name} {req.chosenBid.driver?.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Card: Postulaciones de conductores (solo owner) */}
                {isOwner && (
                  <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
                    <h3 className="text-lg font-semibold text-custom-black-900 mb-3">Postulaciones de conductores</h3>
                    {!req.bids || req.bids.length === 0 ? (
                      <div className="text-sm text-custom-gray-700">Aún no hay postulaciones.</div>
                    ) : (
                      <div className="space-y-3">
                        {req.bids.map((bid) => {
                          const vehicleImg = bid.vehicle?.images && bid.vehicle.images[0]?.url;
                          const vehicleLabel = `${bid.vehicle?.brand ?? ''} ${bid.vehicle?.model ?? ''}`.trim();
                          const plate = bid.vehicle?.plate;
                          const driverName = `${bid.driver?.name ?? ''} ${bid.driver?.lastName ?? ''}`.trim() || 'Conductor';
                          return (
                            <div key={bid.id} className="flex items-center justify-between p-3 rounded-md border border-custom-gray-300 cursor-pointer" onClick={() => openBidModal({ ...bid, requestId: req.id })}>
                              <div className="flex items-center gap-3 min-w-0">
                                {vehicleImg ? (
                                  <div className="relative w-16 h-12 rounded-md overflow-hidden border border-custom-gray-300 bg-white">
                                    <Image src={vehicleImg} alt="Vehículo" fill className="object-cover object-center" />
                                  </div>
                                ) : (
                                  <div className="w-16 h-12 rounded-md border border-dashed border-custom-gray-300 bg-white" />
                                )}
                                <div className="text-sm min-w-0">
                                  <div className="font-medium text-custom-black-800 truncate">{vehicleLabel || 'Vehículo'}</div>
                                  <div className="text-custom-gray-700">Matrícula: {plate || '—'}</div>
                                  <div className="text-xs text-custom-gray-600">Conductor: {driverName} · Estado: {bid.status}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  disabled={submitting || bid.status !== "PENDING"}
                                  onClick={(e) => { e.stopPropagation(); openBidModal({ ...bid, requestId: req.id }); }}
                                  className={`px-3 py-2 rounded-md text-sm text-white ${bid.status === "PENDING" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-custom-gray-400"}`}
                                >
                                  {bid.status === 'ACCEPTED' ? 'Aceptado' : 'Aceptar'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Card: Organizador */}
                <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
                  <div className="flex items-center gap-4">
                    {req.user?.avatarUrl && (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden">
                        <Image src={req.user.avatarUrl} alt="Avatar" fill className="object-cover object-center" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-custom-gray-600">Creó el viaje</div>
                      <div className="text-lg font-medium text-custom-black-800">{organizer}</div>
                    </div>
                  </div>
                </div>

                {/* Card: Explicación */}
                <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
                  <h3 className="text-lg font-semibold text-custom-black-900 mb-2">¿Cómo funciona el pago?</h3>
                  <p className="text-sm text-custom-gray-800 mb-2">
                    Al reservar, se realiza una retención temporal por el importe total con IVA para asegurar tu plaza. A medida que más
                    personas se unan al viaje, el coste se reparte de forma equitativa y tu retención se ajusta automáticamente.
                  </p>
                  {typeof totalWithIVA === "number" ? (
                    <ul className="text-sm text-custom-gray-800 space-y-1">
                      <li><span className="font-medium">1 persona:</span> se retiene el 100% ({totalWithIVA.toFixed(2).replace('.', ',')} €)</li>
                      <li><span className="font-medium">2 personas:</span> cada una paga {share2?.toFixed(2).replace('.', ',')} €, se devuelve la diferencia a la primera.</li>
                      <li><span className="font-medium">3 personas:</span> cada una paga {share3?.toFixed(2).replace('.', ',')} €, ajustando retenciones previas.</li>
                      <li><span className="font-medium">4 personas:</span> cada una paga {share4?.toFixed(2).replace('.', ',')} €, devoluciones correspondientes.</li>
                    </ul>
                  ) : (
                    <p className="text-xs text-custom-gray-700">Los importes se mostrarán cuando esté disponible el precio estimado.</p>
                  )}
                  <p className="mt-2 text-xs text-custom-gray-600">Importes orientativos sujetos al precio final y pasajeros confirmados.</p>
                </div>
              </div>

              {/* Columna derecha: Card de precio */}
              <div className="lg:col-span-1">
                <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300 sticky top-6">
                  <h2 className="text-xl font-bold text-custom-black-900 mb-4">Resumen de pago</h2>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-custom-gray-700">Total con IVA</span>
                    <span className="text-2xl font-bold text-custom-black-900">{typeof totalWithIVA === 'number' ? `${totalWithIVA.toFixed(2).replace('.', ',')} €` : '—'}</span>
                  </div>
                  {typeof ivaAmount === 'number' && (
                    <div className="text-xs text-custom-gray-600 text-right mb-4">Incluye IVA ({IVA}%): {ivaAmount.toFixed(2).replace('.', ',')} €</div>
                  )}
                  {!isOwner && (
                    <button onClick={openJoinModal} className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-white py-3 rounded-lg font-medium">
                      {isJoined ? "Salir del viaje" : "Unirme al viaje"}
                    </button>
                  )}
                  <p className="mt-3 text-xs text-custom-gray-600">La reserva queda pendiente hasta aprobación del organizador.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {showJoinModal && req && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeJoinModal} />
          <div className="relative bg-white w-full max-w-md mx-auto rounded-lg shadow-lg border border-custom-gray-300 p-6">
            <h3 className="text-lg font-semibold text-custom-black-900 mb-2">{isJoined ? "Salir del viaje" : "Unirme al viaje"}</h3>
            <p className="text-sm text-custom-gray-800 mb-3">
              {isJoined
                ? "Puedes salir de este viaje cuando quieras y luego postularte para unirte a otro."
                : "Te estás postulando para unirte a este viaje. Podrás salir más adelante y unirte a otros si cambias de plan."}
            </p>
            <div className="text-xs text-custom-gray-600 mb-4">Origen: {req.origin} · Destino: {req.destination} · Salida: {convertUTCToLocalDate(req.departureAt, timeZone)} · {convertUTCToLocalTime(req.departureAt, timeZone)}</div>
            {isOwner && (
              <div className="mb-3 text-xs text-red-600">Eres el creador de esta solicitud y no puedes salir.</div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button onClick={closeJoinModal} className="px-3 py-2 text-sm rounded-md border border-custom-gray-300 text-custom-gray-800">Cancelar</button>
              <button
                onClick={handleConfirm}
                disabled={submitting || (isOwner && isJoined)}
                className="px-3 py-2 text-sm rounded-md bg-custom-golden-600 hover:bg-custom-golden-700 text-white disabled:opacity-60"
              >
                {submitting ? "Procesando..." : isJoined ? "Confirmar salida" : "Confirmar unión"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBidModal && selectedBid && req && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={closeBidModal} />
          <div className="relative bg-white w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                  {selectedBid.driver?.avatarUrl && (
                    <Image src={selectedBid.driver.avatarUrl} alt="Avatar" fill className="object-cover object-center" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{`${selectedBid.driver?.name ?? ''} ${selectedBid.driver?.lastName ?? ''}`.trim() || 'Conductor'}</div>
                  <div className="text-xs text-slate-600 truncate">{req.origin} → {req.destination}</div>
                </div>
              </div>
              <button onClick={closeBidModal} className="text-xs px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50">Cerrar</button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Info */}
              <div className="order-2 md:order-1">
                <div className="text-[11px] uppercase tracking-wide text-blue-700 font-semibold">Postulación</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Detalles del conductor y vehículo</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="text-sm text-slate-600">Estado</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${selectedBid.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : selectedBid.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{selectedBid.status}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-500">Vehículo</div>
                    <div className="text-sm font-medium text-slate-900">{`${selectedBid.vehicle?.brand ?? ''} ${selectedBid.vehicle?.model ?? ''}`.trim() || 'Vehículo'}</div>
                    <div className="text-xs text-slate-600">Matrícula: {selectedBid.vehicle?.plate || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Media / Carousel */}
              <div className="order-1 md:order-2">
                {(() => {
                  const imgs = selectedBid.vehicle?.images || [];
                  const hasImgs = imgs.length > 0;
                  const current = hasImgs ? imgs[Math.min(carouselIndex, imgs.length - 1)] : null;
                  return (
                    <div>
                      <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                        {current?.url ? (
                          <Image src={current.url} alt={`Vehículo`} fill className="object-cover object-center" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">Sin imágenes disponibles.</div>
                        )}
                        {/* Gradient overlay */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                        {imgs.length > 1 && (
                          <>
                            <button
                              onClick={() => setCarouselIndex((i) => (i - 1 + imgs.length) % imgs.length)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center shadow"
                              aria-label="Anterior"
                            >
                              ‹
                            </button>
                            <button
                              onClick={() => setCarouselIndex((i) => (i + 1) % imgs.length)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center shadow"
                              aria-label="Siguiente"
                            >
                              ›
                            </button>
                            {/* Dots */}
                            <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1">
                              {imgs.map((_, idx) => (
                                <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === carouselIndex ? 'w-4 bg-white' : 'w-2 bg-white/70'}`} />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      {imgs.length > 1 && (
                        <div className="mt-3 grid grid-cols-6 gap-2">
                          {imgs.map((img, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setCarouselIndex(idx)}
                              className={`relative w-full h-16 rounded-lg overflow-hidden border ${idx === carouselIndex ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'} bg-white`}
                              aria-label={`Imagen ${idx + 1}`}
                            >
                              {img?.url ? (
                                <Image src={img.url} alt={`Thumb ${idx + 1}`} fill className="object-cover object-center" />
                              ) : (
                                <div className="w-full h-full bg-slate-100" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-end gap-2">
              <button onClick={closeBidModal} className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-800 hover:bg-slate-50">Cancelar</button>
              <button
                disabled={submitting || selectedBid.status !== 'PENDING'}
                onClick={async () => {
                  try {
                    setSubmitting(true);
                    await selectDriverBid(req.id, selectedBid.id);
                    toast.success('Conductor aceptado');
                    await refresh();
                    closeBidModal();
                  } catch (e: unknown) {
                    toast.error((e as Error)?.message || 'No se pudo aceptar al conductor');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className={`px-4 py-2 rounded-md text-sm text-white shadow ${selectedBid.status === 'PENDING' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 cursor-not-allowed'}`}
              >
                Aceptar conductor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
