import { useState } from "react";
import { DateTime } from "luxon";
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import ReservationPriceInfo from "./ReservationPriceInfo";

type Props = {
  reservation: ReservationResponse;
};

const ReservationCard = ({ reservation }: Props) => {
  const { trip } = reservation;
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [openCard, setOpenCard] = useState(false);

  const departure = DateTime.fromISO(trip.departure).setZone(
    trip.originalTimeZone
  );
  const arrival = DateTime.fromISO(trip.arrival).setZone(trip.originalTimeZone);
  const formattedDate = departure.setLocale("es").toFormat("cccc, d 'de' LLLL");
  const departureTime = departure.toFormat("HH:mm");
  const arrivalTime = arrival.toFormat("HH:mm");

  return (
    <div
      onClick={() => setOpenCard(!openCard)}
      className="w-full rounded-2xl border border-custom-gray-200 shadow-md bg-custom-white-100 p-6 flex flex-col gap-4 cursor-pointer transition hover:shadow-lg">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-custom-golden-700">
          <CalendarDays className="size-5" />
          <span className="font-semibold text-sm">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-custom-gray-500">
          <span className="text-sm font-medium">
            ID:{" "}
            <span className="text-custom-black-700">
              {reservation.id.slice(-6)}
            </span>
          </span>
          <motion.div
            animate={{ rotate: openCard ? 180 : 0 }}
            transition={{ duration: 0.3 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </div>

      {/* Info principal */}
      <div>
        <h2 className="text-xl font-bold text-custom-black-900 capitalize mb-1">
          {trip.origin} → {trip.destination}
        </h2>
        <p className="text-sm text-custom-gray-600 capitalize">
          {trip.originLocation} — {trip.destinationLocation}
        </p>
        <div className="flex items-center gap-2 mt-2 text-custom-gray-600 text-sm">
          <Clock className="size-4" />
          <span>
            {departureTime} — {arrivalTime}
          </span>
        </div>
      </div>

      {/* Indicador de interacción */}
      <p className="text-xs text-custom-gray-500 italic">
        Toca para ver más detalles de tu reserva
      </p>

      {/* Contenido expandido con animación */}
      <AnimatePresence>
        {openCard && (
          <motion.div
            key="details"
            onClick={(e) => e.stopPropagation()}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-6 mt-2">
            {/* Estado de la reserva */}
            <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
              <p className="font-semibold text-custom-black-900 mb-1">
                Estado de tu reserva
              </p>

              {reservation.status === "PENDING" && (
                <p className="text-custom-gray-700">
                  Tu solicitud fue enviada correctamente y está pendiente de
                  aprobación por parte del conductor. Recibirás una notificación
                  cuando sea aprobada.
                </p>
              )}

              {reservation.status === "CONFIRMED" &&
                trip.status === "PENDING" && (
                  <p className="text-custom-gray-700">
                    Tu reserva fue <strong>aprobada</strong> y tu lugar está
                    asegurado. Sin embargo, el viaje aún no fue confirmado. Se
                    confirmará automáticamente cuando se complete el mínimo de
                    pasajeros.
                  </p>
                )}

              {reservation.status === "CONFIRMED" &&
                trip.status === "CONFIRMED" && (
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <CheckCircle2 className="size-4" />
                    <span>
                      ¡Reserva confirmada y viaje confirmado! Ya tienes todo
                      listo para viajar.
                    </span>
                  </div>
                )}

              {reservation.status === "CANCELLED" && (
                <p className="text-gray-500">Has cancelado esta reserva.</p>
              )}
            </div>

            {/* Estado del viaje */}
            <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
              <p className="font-semibold text-custom-black-900 mb-1">
                Estado del viaje
              </p>
              {trip.status === "PENDING" && (
                <p className="text-custom-gray-700">
                  Este viaje se confirmará automáticamente al alcanzar al menos{" "}
                  <strong>{trip.minPassengers}</strong> pasajeros. Te avisaremos
                  cuando eso ocurra.
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

            {/* Precio + Info de referidos */}
            <ReservationPriceInfo reservation={reservation} />

            {/* Cancelar reserva */}
            {reservation.status !== "CANCELLED" && (
              <div className="flex flex-col gap-2 items-center">
                <AnimatePresence>
                  {!hideButton && (
                    <motion.button
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        setHideButton(true);
                        setTimeout(() => setShowCancelWarning(true), 300);
                      }}
                      className="max-w-52 text-gray-700 cursor-pointer font-medium rounded-lg px-4 py-2 text-sm flex items-center justify-center gap-2 transition">
                      <XCircle className="size-4" />
                      Cancelar reserva
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showCancelWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#f3f4f6] border border-gray-300 p-4 rounded-xl text-sm text-gray-700">
                      <p className="mb-2">
                        Al cancelar tu reserva podrías perder tu lugar. La
                        disponibilidad es limitada y no garantizamos que queden
                        plazas más adelante.
                      </p>
                      <div className="flex flex-col gap-2 mt-3">
                        <button
                          onClick={() =>
                            alert("Aquí se confirmaría la cancelación")
                          }
                          className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition">
                          Confirmar cancelación
                        </button>
                        <button
                          onClick={() => {
                            setShowCancelWarning(false);
                            setTimeout(() => setHideButton(false), 300);
                          }}
                          className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-sm font-medium py-2 px-4 rounded-lg transition">
                          Volver atrás
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationCard;
