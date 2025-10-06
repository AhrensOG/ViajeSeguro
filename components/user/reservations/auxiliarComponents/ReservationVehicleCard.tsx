import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Truck,
  Fuel,
  Settings,
  Users,
  MapIcon,
  X,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ResponseForProfilePage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { calculateTotalDays } from "@/lib/functions";
import { DateTime } from "luxon";
import { confirmBookingPickup, markAsReturned } from "@/lib/api/vehicle-booking";
import { toast } from "sonner";
import RenterCaptureModal from "./RenterCaptureModal";
const transmissionTypeMap = {
  MANUAL: "Manual",
  AUTOMATIC: "Automática",
} as const;
const fuelTypeMap = {
  DIESEL: "Diésel",
  GASOLINE: "Nafta",
  ELECTRIC: "Eléctrico",
  HYBRID: "Híbrido",
} as const;
const statusMap = {
  PENDING: "Pendiente",
  CANCELLED: "Cancelada",
  DECLINED: "Declinada",
  FINISHED: "Finalizada",
  APPROVED: "Aprobada",
  COMPLETED: "Completada",
  DELIVERED: "Entregada",
  ACTIVE: "Activa",
  RETURNED: "Devuelta",
} as const;

const getStatusColor = (status: keyof typeof statusMap) => {
  switch (status) {
    case "APPROVED":
    case "COMPLETED":
    case "ACTIVE":
      return "bg-green-50 border-green-200 text-green-800";
    case "DELIVERED":
      return "bg-blue-50 border-blue-200 text-blue-800";
    case "PENDING":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    case "FINISHED":
    case "RETURNED":
      return "bg-blue-50 border-blue-200 text-blue-800";
    case "DECLINED":
    case "CANCELLED":
      return "bg-red-50 border-red-200 text-red-800";
    default:
      return "bg-gray-50 border-gray-200 text-gray-800";
  }
};

const ReservationVehicleCard = ({
  vehicleBooking,
  onBookingUpdate,
}: {
  vehicleBooking: ResponseForProfilePage;
  onBookingUpdate?: () => void;
}) => {
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureOpenReturn, setCaptureOpenReturn] = useState(false);
  const IVA = process.env.NEXT_PUBLIC_IVA || 0;

  const {
    id,
    startDate,
    endDate,
    paymentMethod,
    offer,
    status,
  } = vehicleBooking || {};
  const { vehicle, returnLocation, pricePerDay, vehicleOfferType, originalTimeZone } =
    offer || {};
  const { model, brand, year, capacity, fuelType, transmissionType, images } =
    vehicle || {};
  // QR oculto en cards de alquiler de vehículos a pedido: no mostrar QR aquí

  // Estado local para feedback instantáneo en UI
  const [currentStatus, setCurrentStatus] = useState(status);

  const formattedStart = DateTime.fromISO(startDate, { zone: "utc" })
    .setZone(originalTimeZone || "Europe/Madrid")
    .toFormat("yyyy-MM-dd");

  const formattedEnd = DateTime.fromISO(endDate, { zone: "utc" })
    .setZone(originalTimeZone || "Europe/Madrid")
    .toFormat("yyyy-MM-dd");

  const days =
    formattedStart && formattedEnd
      ? Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      )
      : "-";
  // Cálculos correctos para mostrar al cliente
  const daysCount = calculateTotalDays(String(startDate), String(endDate));
  const subTotal = pricePerDay * daysCount;
  const ivaPercent = Number(IVA) || 0;
  const ivaAmount = Number(((subTotal * ivaPercent) / 100).toFixed(2));
  const totalWithIva = Number((subTotal + ivaAmount).toFixed(2));

  // Nota: subTotal/ivaAmount/totalWithIva calculados arriba

  // Flujo de confirmación con cámara implementado; función directa de confirmación eliminada por no uso

  // Flujo nuevo: abrir cámara y, tras subir fotos, guardar URLs (si backend disponible) y confirmar recogida
  const openCaptureFlow = () => {
    setCaptureOpen(true);
  };

  const handleCaptureComplete = async (urls: string[]) => {
    void urls;
    try {
      setLoadingPickup(true);
      await confirmBookingPickup(id.toString());
      toast.success("¡Vehículo recogido! Tu alquiler está ahora activo");
      setCurrentStatus("ACTIVE");
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error al confirmar recogida con fotos:', error);
      toast.error("Error al confirmar la recogida del vehículo");
    } finally {
      setLoadingPickup(false);
      setCaptureOpen(false);
    }
  };

  // Flujo de devolución se realiza vía captura con cámara; función directa eliminada por no uso

  // Flujo de devolución con cámara
  const openReturnCaptureFlow = () => {
    setCaptureOpenReturn(true);
  };

  const handleReturnCaptureComplete = async (urls: string[]) => {
    void urls;
    try {
      setLoadingReturn(true);
      await markAsReturned(id.toString());
      toast.success("¡Vehículo devuelto exitosamente!");
      setCurrentStatus("FINISHED");
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error al devolver vehículo con fotos:', error);
      toast.error("Error al devolver el vehículo");
    } finally {
      setLoadingReturn(false);
      setCaptureOpenReturn(false);
    }
  };

  return (
    <div
      onClick={() => setOpenCard(!openCard)}
      className="w-full rounded-2xl border border-custom-gray-200 shadow-md bg-custom-white-100 p-6 flex flex-col gap-4 cursor-pointer transition hover:shadow-lg">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 text-custom-golden-700">
          <Truck className="size-5" />
          <span className="font-semibold text-sm">Alquiler de Furgoneta</span>
        </div>
        <div className="flex items-center gap-2 text-custom-gray-500">
          <span className="text-sm font-medium">
            ID: <span className="text-custom-black-700">{id}</span>
          </span>
          <motion.div
            animate={{ rotate: openCard ? 180 : 0 }}
            transition={{ duration: 0.3 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </div>

      {/* Info principal */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center justify-center w-full h-[15rem] md:h-[10rem] md:w-[20rem] relative">
          <Image
            className="rounded-md"
            src={images?.[0] || "/main/img_placeholder.webp"}
            alt="placeholder"
            fill
          />
        </div>
        <div className="flex flex-col justify-between h-[15rem] md:h-[10rem] grow-1 ">
          <h3 className="text-2xl font-bold text-custom-black-800 w-full h-[4rem] md:h-[3rem]">
            {brand} {model} {year}
          </h3>
          <div className="flex gap-4 md:gap-0 flex-wrap grow-1 md:justify-between">
            <p className="text-sm text-custom-gray-700 flex items-center gap-1 md:w-[49%]">
              <CalendarDays className="size-4" /> {formattedStart} -{" "}
              {formattedEnd} ({days} días)
            </p>
            <p className="text-sm text-custom-gray-700 flex items-center gap-1 md:w-[49%]">
              <MapIcon className="size-4" /> Local {returnLocation}
            </p>
            <p className="text-sm text-custom-gray-700 flex items-center gap-1 md:w-[49%]">
              <Users className="size-4" /> {capacity} personas
            </p>
            <p className="text-sm text-custom-gray-700 flex items-center gap-1 md:w-[49%]">
              <Fuel className="size-4" /> {fuelTypeMap[fuelType]}
            </p>
            <p className="text-sm text-custom-gray-700 flex items-center gap-1 md:w-[49%]">
              <Settings className="size-4" />{" "}
              {transmissionTypeMap[transmissionType]}
            </p>
            <p className="text-sm text-custom-gray-700 flex items-center gap-1 md:w-[49%]">
              <Truck className="size-4" />{" "}
              {vehicleOfferType === "WITH_DRIVER"
                ? "Con conductor"
                : "Sin conductor"}
            </p>
          </div>
        </div>
        <div className="flex flex-row-reverse md:flex-col gap-4 md:gap-2 md:w-[10rem] md:h-full justify-center md:justify-end items-center md:items-start ">
          <h3 className="text-2xl font-bold text-custom-black-800">
            {totalWithIva.toFixed(2)}€
          </h3>
          <p className="text-sm text-custom-gray-600">Precio total</p>
        </div>
      </div>

      <p className="text-xs text-custom-gray-500 italic">
        Toca para ver más detalles de tu reserva
      </p>

      {/* Contenido expandido */}
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
            <div className={`rounded-xl border p-4 text-sm ${getStatusColor(currentStatus as keyof typeof statusMap)}`}>
              <p className="font-semibold mb-1">
                Estado de tu reserva
              </p>
              <p>
                Tu solicitud fue procesada correctamente y se encuentra en
                estado <strong>{statusMap[currentStatus as keyof typeof statusMap]}</strong>.
              </p>
            </div>

            {paymentMethod === "CASH" && (
              <div className="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800">
                <p className="font-bold mb-2 text-yellow-800">
                  Método de pago: Efectivo
                </p>
                <p className="mb-2">
                  El pago se ha procesado correctamente. Recuerda presentar tu
                  documento de identidad y licencia de conducir (si aplica) al
                  momento de recoger el vehículo.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-2">📍 Información de recogida</p>
              <p className="text-blue-800 mb-2">
                Debes recoger tu furgoneta en la siguiente dirección:
              </p>
              <p className="font-semibold text-blue-900 bg-blue-100 p-2 rounded-md">
                {returnLocation}
              </p>
              <p className="text-blue-700 text-xs mt-2">
                Recuerda llevar tu documento de identidad y licencia de conducir válida.
              </p>
            </div>

            {paymentMethod === "CASH" && (
              <div className="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800">
                <p className="font-bold mb-2 text-yellow-800">Método de pago: Efectivo</p>
                <p className="mb-2">
                  El pago se ha procesado correctamente. Recuerda presentar tu documento de identidad y licencia de conducir (si
                  aplica) al momento de recoger el vehículo.
                </p>
              </div>
            )}


            <div className="border-b border-custom-gray-200"></div>

            <div className="flex flex-col gap-2 space-y-4">
              <div className="flex justify-between text-sm text-custom-gray-700 w-full">
                <p>Importe Por día:</p>
                <p>{pricePerDay.toFixed(2)}€</p>
              </div>
              <div className="flex justify-between text-sm text-custom-gray-700 w-full">
                <p>Sub total:</p>
                <p>{subTotal.toFixed(2)}€</p>
              </div>
              <div className="flex justify-between text-sm text-custom-gray-700 w-full">
                <p>IVA ({ivaPercent}%):</p>
                <p>{ivaAmount.toFixed(2)}€</p>
              </div>
              <div className="flex justify-between text-custom-gray-700 w-full text-lg font-bold">
                <p>Importe Final:</p>
                <p>{totalWithIva.toFixed(2)}€</p>
              </div>
              {/* <p className="text-sm text-custom-golden-600 text-end w-full hover:underline cursor-pointer">Ver detalle de descuentos</p> */}
            </div>

            <div className="border-b border-custom-gray-200"></div>

            {/* QR intencionalmente no visible en esta card (alquiler de vehículos) */}

            <div className="border-b border-custom-gray-200"></div>

            <div className="flex flex-col justify-center items-end gap-4 relative">
              {/* Botón de confirmar recogida cuando estado es DELIVERED */}
              {currentStatus === "DELIVERED" && (
                <div className="w-full flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCaptureFlow();
                    }}
                    disabled={loadingPickup}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"
                  >
                    {loadingPickup ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    {loadingPickup ? "Confirmando..." : "Confirmar que recibí el vehículo"}
                  </button>
                </div>
              )}

              {/* Botón de devolver vehículo cuando estado es ACTIVE */}
              {currentStatus === "ACTIVE" && (
                <div className="w-full flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openReturnCaptureFlow();
                    }}
                    disabled={loadingReturn}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"
                  >
                    {loadingReturn ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Truck className="h-5 w-5" />
                    )}
                    {loadingReturn ? "Procesando..." : "Devolver vehículo"}
                  </button>
                </div>
              )}

              {/* Botón de cancelar para estados apropiados */}
              {(currentStatus === "COMPLETED" ||
                currentStatus === "PENDING" ||
                currentStatus === "APPROVED") && (
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
                          className="absolute top-0 left-0 max-w-52 text-red-500 cursor-pointer font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition mt-1.5">
                          <X className="size-4" />
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
                            disponibilidad es limitada y no garantizamos que
                            queden plazas más adelante.
                          </p>
                          <div className="flex flex-col gap-2 mt-3">
                            <button className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Modal de captura para confirmar recogida (usuario) */}
      <RenterCaptureModal
        isOpen={captureOpen}
        mode="pickup"
        bookingId={id ? id.toString() : null}
        onClose={() => setCaptureOpen(false)}
        onComplete={handleCaptureComplete}
      />
      <RenterCaptureModal
        isOpen={captureOpenReturn}
        mode="return"
        bookingId={id ? id.toString() : null}
        onClose={() => setCaptureOpenReturn(false)}
        onComplete={handleReturnCaptureComplete}
      />
    </div>
  );
};

export default ReservationVehicleCard;
