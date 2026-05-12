import { useState } from "react";
import { DateTime } from "luxon";
import { CalendarDays, Clock, AlertTriangle, CheckCircle2, XCircle, ChevronDown, Users, User, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import ReservationPriceInfo from "./ReservationPriceInfo";
import { cancellReservation } from "@/lib/api/reservation";
import { toast } from "sonner";
import Image from "next/image";
type Props = {
    reservation: ReservationResponse;
};

const ReservationCard = ({ reservation }: Props) => {
  const { trip } = reservation;
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  // Nueva: motivo obligatorio para cancelar
  const [cancelReason, setCancelReason] = useState("");
  const MIN_REASON_LEN = 40;

    const departure = DateTime.fromISO(trip.departure).setZone(trip.originalTimeZone);
    const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);
    const formattedDate = departure.setLocale("es").toFormat("cccc, d 'de' LLLL");
    const departureTime = departure.toFormat("HH:mm");
    const arrivalTime = arrival.toFormat("HH:mm");

    const now = DateTime.utc();
    const departureDate = DateTime.fromISO(trip.departure, { zone: "utc" });

    const hoursLeft = departureDate.diff(now, "hours").hours;
    const canCancel = hoursLeft >= 24;

    const handleCancell = async () => {
      const reason = cancelReason.trim();
      if (reason.length < MIN_REASON_LEN) {
          toast.error(`Por favor, explica el motivo de la cancelaciÃ³n (mÃ­nimo ${MIN_REASON_LEN} caracteres).`);
          return;
      }
      const toastId = toast.loading("Cancelando reserva.");
      try {
          await cancellReservation(reservation.id, reason);
          toast.success("Reserva cancelada con Ã©xito", { id: toastId });
          setShowCancelWarning(false);
          reservation.status = "CANCELLED"; // actualizaciÃ³n temporal si no usÃ¡s refetch
          setCancelReason("");
      } catch (error) {
          console.error(error);
          toast.info("Error al cancelar la reserva", { id: toastId });
      }
  };

    return (
        <div
            onClick={() => setOpenCard(!openCard)}
            className="w-full rounded-2xl border border-gray-200 shadow-sm bg-white p-6 flex flex-col gap-4 cursor-pointer transition hover:shadow-md"
        >
            {/* Cabecera */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-600">
                    <CalendarDays className="size-5" />
                    <span className="font-semibold text-sm">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-sm font-medium">
                        ID: <span className="text-gray-700">{reservation.id.slice(-6)}</span>
                    </span>
                    <motion.div animate={{ rotate: openCard ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={18} />
                    </motion.div>
                </div>
            </div>

            {/* Info principal */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 capitalize mb-1">
                    {trip.origin} â†’ {trip.destination}
                </h2>
                <div className="flex items-center gap-1 flex-wrap">
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.originLocation)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 underline cursor-pointer capitalize"
                    >
                        <MapPin className="size-3" />
                        {trip.originLocation}
                    </a>
                    <span className="text-gray-400 mx-1">â€”</span>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.destinationLocation)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 underline cursor-pointer capitalize"
                    >
                        <MapPin className="size-3" />
                        {trip.destinationLocation}
                    </a>
                </div>
                <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                    <Clock className="size-4" />
                    <span>
                        {departureTime} â€” {arrivalTime}
                    </span>
                </div>
            </div>

            {/* Pasajeros â€” visible siempre en la cabecera */}
            {(() => {
                const companions = reservation.passengers ?? [];
                const total = 1 + companions.length;
                return (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                            <Users className="size-3.5" />
                            {total} {total === 1 ? "pasajero" : "pasajeros"}
                        </span>
                        {companions.map((name, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200">
                                <User className="size-3" />
                                {name || `AcompaÃ±ante ${idx + 1}`}
                            </span>
                        ))}
                    </div>
                );
            })()}

            {/* Indicador de interacciÃ³n */}
            <p className="text-xs text-gray-500 italic">Toca para ver mÃ¡s detalles de tu reserva</p>

            {/* Contenido expandido con animaciÃ³n */}
            <AnimatePresence>
                {openCard && (
                    <motion.div
                        key="details"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden flex flex-col gap-6 mt-2"
                    >
                        {/* Estado de la reserva */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
                            <p className="font-semibold text-gray-900 mb-1">Estado de tu reserva</p>

                            {reservation.status === "PENDING" && (
                                <p className="text-gray-700">
                                    Tu solicitud fue enviada correctamente y estÃ¡ pendiente de aprobaciÃ³n por parte del conductor. RecibirÃ¡s una
                                    notificaciÃ³n cuando sea aprobada.
                                </p>
                            )}

                            {reservation.status === "CONFIRMED" && trip.status === "PENDING" && (
                                <p className="text-gray-700">
                                    Tu reserva fue <strong>aprobada</strong> y tu lugar estÃ¡ asegurado. Sin embargo, el viaje aÃºn no fue confirmado.
                                    Se confirmarÃ¡ automÃ¡ticamente cuando se complete el mÃ­nimo de pasajeros.
                                </p>
                            )}

                            {reservation.status === "CONFIRMED" && trip.status === "CONFIRMED" && (
                                <div className="flex items-center gap-2 text-green-700 font-medium">
                                    <CheckCircle2 className="size-4" />
                                    <span>Â¡Reserva confirmada y viaje confirmado! Ya tienes todo listo para viajar.</span>
                                </div>
                            )}

                            {reservation.status === "CANCELLED" && (
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p>Has cancelado esta reserva.</p>
                                    {String(reservation.paymentMethod).toUpperCase() === "STRIPE" && (
                                        <p className="text-gray-600">
                                            Si pagaste con tarjeta, verÃ¡s reflejado el reembolso en tu cuenta bancaria entre <strong>2 y 5 dÃ­as hÃ¡biles</strong>.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Estado del viaje */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
                            <p className="font-semibold text-gray-900 mb-1">Estado del viaje</p>
                            {trip.status === "PENDING" && (
                                <p className="text-gray-700">
                                    Este viaje se confirmarÃ¡ automÃ¡ticamente al alcanzar al menos <strong>{trip.minPassengers}</strong> pasajeros. Te
                                    avisaremos cuando eso ocurra.
                                </p>
                            )}
                            {trip.status === "CONFIRMED" && (
                                <div className="flex items-center gap-2 text-green-700 font-medium">
                                    <CheckCircle2 className="size-4" />
                                    <span>Viaje confirmado</span>
                                </div>
                            )}
                            {trip.status === "CANCELLED" && (
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <AlertTriangle className="size-4" />
                                    <span>El viaje fue cancelado por el organizador</span>
                                </div>
                            )}
                        </div>

                        {/* MÃ©todo de pago en efectivo */}
                        {reservation.paymentMethod === "CASH" && (
                            <div className="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800">
                                <p className="font-bold mb-2 text-yellow-800">MÃ©todo de pago: Efectivo</p>
                                <p className="mb-2">
                                    DeberÃ¡s abonar el <strong>dÃ­a del viaje</strong> el monto exacto. No se aceptan pagos con cambio, y de no
                                    presentarte con el importe correcto, <strong>la reserva podrÃ¡ ser cancelada</strong>.
                                </p>
                            </div>
                        )}

                        {/* Precio + Info de referidos */}
                        <ReservationPriceInfo reservation={reservation} />
                        {reservation.qr && (
                            <div className="flex flex-col justify-center items-center w-full">
                                <h2 className="text-lg font-semibold mb-4 text-center text-gray-900">CÃ³digo QR de tu viaje</h2>

                                <p className="text-sm text-center text-gray-600">Muestra este cÃ³digo al conductor al momento del embarque.</p>
                                <Image src={reservation.qr[0].imageUrl} alt="QR Code" width={200} height={200} className="w-48 h-48" />
                                <p className="text-xs text-center text-gray-400 mt-1">
                                    Si el QR falla, proporciona este ID al conductor:{" "}
                                    <span className="font-semibold text-gray-700">{reservation.id}</span>
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col justify-center items-end gap-4 relative">
                            {/* Cancelar reserva */}
                            {reservation.status !== "CANCELLED" && (
                                <div className="flex flex-col gap-2 items-center">
                                    {canCancel ? (
                                        <AnimatePresence>
                                            <div className="w-full flex items-stretch justify-end gap-2">
                                                {/* Textos: regla + horas */}
                                                <div className="h-10 flex flex-col justify-center gap-0.5 text-xs text-gray-500">
                                                    <p>Puedes cancelar tu reserva hasta 24 horas antes del horario de salida.</p>
                                                    <p>Horas hasta la salida: {Math.max(0, Math.floor(hoursLeft))}</p>
                                                </div>
                                                {!hideButton && (
                                                    <motion.button
                                                        key="cancel-btn"
                                                        initial={{ opacity: 1 }}
                                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        onClick={() => {
                                                            setHideButton(true);
                                                            setTimeout(() => setShowCancelWarning(true), 300);
                                                        }}
                                                        type="button"
                                                        className="inline-flex items-center gap-2 px-4 py-2 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium text-sm shadow-sm"
                                                    >
                                                        <XCircle className="size-4" />
                                                        Cancelar reserva
                                                    </motion.button>
                                                )}
                                            </div>
                                        </AnimatePresence>
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            <p className="italic">No se puede cancelar la reserva porque falta menos de 24 horas para el viaje.</p>
                                            <p className="text-xs mt-1">Solo puedes cancelar hasta 24 horas antes del horario de salida.</p>
                                        </div>
                                    )}

                                    {/* Horas ahora se muestra junto al texto de regla arriba */}

                                    <AnimatePresence>
                                        {showCancelWarning && (
                                            <motion.div
                                                key="cancel-panel"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-[#f3f4f6] border border-gray-300 p-4 rounded-xl text-sm text-gray-700 w-full max-w-lg"
                                            >
                                                <p className="mb-3">
                                                    Para continuar, cuÃ©ntanos el motivo de tu cancelaciÃ³n. Esta informaciÃ³n nos ayuda a mejorar el servicio.
                                                </p>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                    Motivo de cancelaciÃ³n (mÃ­nimo 40 caracteres)
                                                </label>
                                                <textarea
                                                    value={cancelReason}
                                                    onChange={(e) => setCancelReason(e.target.value)}
                                                    rows={4}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                                                    placeholder="Escribe aquÃ­ el motivo..."
                                                />
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className={`text-xs ${cancelReason.trim().length < 40 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {cancelReason.trim().length}/40
                                                    </span>
                                                    {cancelReason.trim().length < 40 && (
                                                        <span className="text-xs text-red-500">Faltan {40 - cancelReason.trim().length} caracteres</span>
                                                    )}
                                                </div>
                                                <p className="mt-3 text-xs text-gray-600">
                                                    Al cancelar tu reserva podrÃ­as perder tu lugar. La disponibilidad es limitada y no garantizamos que queden plazas mÃ¡s adelante.
                                                </p>
                                                <div className="flex flex-col gap-2 mt-4">
                                                    <button
                                                        onClick={handleCancell}
                                                        disabled={cancelReason.trim().length < 40}
                                                        className={`w-full text-white text-sm font-semibold py-2 px-4 rounded-lg transition ${cancelReason.trim().length < 40 ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 cursor-pointer'}`}
                                                    >
                                                        Confirmar cancelaciÃ³n
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowCancelWarning(false);
                                                            setTimeout(() => setHideButton(false), 300);
                                                            setCancelReason("");
                                                        }}
                                                        className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-sm font-medium py-2 px-4 rounded-lg transition"
                                                    >
                                                        Volver atrÃ¡s
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReservationCard;
