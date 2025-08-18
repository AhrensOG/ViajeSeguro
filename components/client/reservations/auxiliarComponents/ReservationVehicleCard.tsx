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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ResponseForProfilePage } from "@/lib/api/vehicle-booking/vehicleBooking.types";
import { calculateTotalDays } from "@/lib/functions";
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
  APPROVED: "Aprobada", // agregado
  COMPLETED: "Completada", // agregado
} as const;

const ReservationVehicleCard = ({
  vehicleBooking,
}: {
  vehicleBooking: ResponseForProfilePage;
}) => {
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const IVA = process.env.NEXT_PUBLIC_IVA || 0;

  const {
    id,
    startDate,
    endDate,
    totalPrice,
    paymentMethod,
    offer,
    qrCode,
    status,
  } = vehicleBooking || {};
  const { vehicle, returnLocation, pricePerDay, vehicleOfferType } =
    offer || {};
  const { model, brand, year, capacity, fuelType, transmissionType, images } =
    vehicle || {};
  const { imageUrl } = qrCode?.[0] || {};

  const formattedStart = String(startDate).split("T")[0];
  const formattedEnd = String(endDate).split("T")[0];
  const days =
    formattedStart && formattedEnd
      ? Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : "-";
  const formattedTotal = `${totalPrice.toFixed(2)}€`;

  const subTotal =
    pricePerDay * calculateTotalDays(String(startDate), String(endDate));
  // const total = subTotal * (1 + Number(IVA) / 100);

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
            {formattedTotal}
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
            <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
              <p className="font-semibold text-custom-black-900 mb-1">
                Estado de tu reserva
              </p>
              <p className="text-custom-gray-700">
                Tu solicitud fue procesada correctamente y se encuentra en
                estado <strong>{statusMap[status]}</strong>.
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

            {/* <div className="rounded-xl border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
                            <p className="font-semibold text-custom-black-900 mb-3">Extras incluidos</p>
                            <ul className="list-disc pl-10 space-y-1">
                                <li className="text-custom-gray-700">Seguro de vida</li>
                                <li className="text-custom-gray-700">Silla de Niños 5.00€</li>
                            </ul>
                        </div> */}

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
                <p>IVA ({IVA}%):</p>
                <p>{formattedTotal}</p>
              </div>
              <div className="flex justify-between text-custom-gray-700 w-full text-lg font-bold">
                <p>Importe Final:</p>
                <p>{formattedTotal}</p>
              </div>
              {/* <p className="text-sm text-custom-golden-600 text-end w-full hover:underline cursor-pointer">Ver detalle de descuentos</p> */}
            </div>

            <div className="border-b border-custom-gray-200"></div>

            {imageUrl && (
              <div className="flex flex-col justify-center items-center w-full">
                <h2 className="text-lg font-semibold mb-4 text-center text-custom-black-900">
                  Código QR de tu viaje
                </h2>

                <p className="text-sm text-center text-custom-gray-600">
                  Muestra este código al conductor al momento del embarque.
                </p>
                <Image
                  src={imageUrl}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="w-48 h-48"
                />
                <p className="text-xs text-center text-custom-gray-400 mt-1">
                  Si el QR falla, proporciona este ID al conductor:{" "}
                  <span className="font-semibold text-custom-black-700">
                    {vehicleBooking.id}
                  </span>
                </p>
              </div>
            )}

            <div className="border-b border-custom-gray-200"></div>

            <div className="flex flex-col justify-center items-end gap-4 relative">
              {status === "COMPLETED" ||
                status === "PENDING" ||
                (status === "APPROVED" && (
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
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationVehicleCard;
