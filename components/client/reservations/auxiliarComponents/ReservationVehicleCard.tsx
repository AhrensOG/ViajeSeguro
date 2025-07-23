import { useState } from "react";
import { CalendarDays, ChevronDown, QrCode, Truck, Fuel, Settings, Users, MapIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ReservationVehicleCard = () => {
    const [showCancelWarning, setShowCancelWarning] = useState(false);
    const [hideButton, setHideButton] = useState(false);
    const [openCard, setOpenCard] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);

    return (
        <div
            onClick={() => setOpenCard(!openCard)}
            className="w-full rounded-2xl border border-custom-gray-200 shadow-md bg-custom-white-100 p-6 flex flex-col gap-4 cursor-pointer transition hover:shadow-lg"
        >
            {/* Cabecera */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-custom-golden-700">
                    <Truck className="size-5" />
                    <span className="font-semibold text-sm">Alquiler de Furgoneta</span>
                </div>
                <div className="flex items-center gap-2 text-custom-gray-500">
                    <span className="text-sm font-medium">
                        ID: <span className="text-custom-black-700">01213</span>
                    </span>
                    <motion.div animate={{ rotate: openCard ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={18} />
                    </motion.div>
                </div>
            </div>

            {/* Info principal */}
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-[10rem] w-[20rem] relative">
                    <Image className="rounded-md" src="/main/img_placeholder.webp" alt="placeholder" fill />
                </div>
                <div className="flex flex-col justify-between h-[10rem] grow-1 ">
                    <h3 className="text-2xl font-bold text-custom-black-800 w-full h-[3rem]">Mercedes Sprinter 2024</h3>
                    <div className="flex flex-wrap grow-1 justify-between">
                        <p className="text-sm text-custom-gray-700 flex items-center gap-1 w-[49%]">
                            <span className="text-custom-gray-600">
                                <CalendarDays className="size-4" />
                            </span>{" "}
                            2025-07-12 - 2025-07-15 (3dias)
                        </p>
                        <p className="text-sm text-custom-gray-700 flex items-center gap-1 w-[49%]">
                            <span className="text-custom-gray-600">
                                <MapIcon className="size-4" />
                            </span>{" "}
                            Local Valencia Centro
                        </p>
                        <p className="text-sm text-custom-gray-700 flex items-center gap-1 w-[49%]">
                            <span className="text-custom-gray-600">
                                <Users className="size-4" />
                            </span>
                            9 personas
                        </p>
                        <p className="text-sm text-custom-gray-700 flex items-center gap-1 w-[49%]">
                            <span className="text-custom-gray-600">
                                <Fuel className="size-4" />
                            </span>
                            Diesel
                        </p>
                        <p className="text-sm text-custom-gray-700 flex items-center gap-1 w-[49%]">
                            <span className="text-custom-gray-600">
                                <Settings className="size-4" />
                            </span>
                            Manual
                        </p>
                        <p className="text-sm text-custom-gray-700 flex items-center gap-1 w-[49%]">
                            <span className="text-custom-gray-600">
                                <Truck className="size-4" />
                            </span>
                            Sin conductor
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-[10rem] h-full justify-end">
                    <h3 className="text-2xl font-bold text-custom-black-800">255.00€</h3>
                    <p className="text-sm text-custom-gray-600">Precio total</p>
                </div>
            </div>

            {/* Indicador de interacción */}
            <p className="text-xs text-custom-gray-500 italic">Toca para ver más detalles de tu reserva</p>

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
                        className="overflow-hidden flex flex-col gap-6 mt-2"
                    >
                        {/* Estado de la reserva */}
                        <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
                            <p className="font-semibold text-custom-black-900 mb-1">Estado de tu reserva</p>

                            {true && (
                                <p className="text-custom-gray-700">
                                    Tu solicitud fue enviada correctamente y está pendiente de aprobación por parte del conductor. Recibirás una
                                    notificación cuando sea aprobada.
                                </p>
                            )}

                            {/* {reservation.status === "CONFIRMED" && trip.status === "PENDING" && (
                                <p className="text-custom-gray-700">
                                    Tu reserva fue <strong>aprobada</strong> y tu lugar está asegurado. Sin embargo, el viaje aún no fue confirmado.
                                    Se confirmará automáticamente cuando se complete el mínimo de pasajeros.
                                </p>
                            )}

                            {reservation.status === "CONFIRMED" && trip.status === "CONFIRMED" && (
                                <div className="flex items-center gap-2 text-green-700 font-medium">
                                    <CheckCircle2 className="size-4" />
                                    <span>¡Reserva confirmada y viaje confirmado! Ya tienes todo listo para viajar.</span>
                                </div>
                            )}

                            {reservation.status === "CANCELLED" && <p className="text-gray-500">Has cancelado esta reserva.</p>} */}
                        </div>

                        {/* Método de pago en efectivo */}
                        {true && (
                            <div className="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800">
                                <p className="font-bold mb-2 text-yellow-800">Método de pago: Efectivo</p>
                                <p className="mb-2">
                                    El pago se ha procesado correctamente. Recuerda presentar tu documento de identidad y licencia de conducir (si
                                    aplica) al momento de recoger el vehículo.
                                </p>
                            </div>
                        )}

                        {/* Estado del viaje */}
                        <div className="rounded-xl border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
                            <p className="font-semibold text-custom-black-900 mb-3">Extras incluidos</p>
                            {true && (
                                <ul className="list-disc pl-10 space-y-1">
                                    <li className="text-custom-gray-700">Seguro de vida</li>
                                    <li className="text-custom-gray-700">Silla de Niños 5.00€</li>
                                </ul>
                            )}
                            {/* {trip.status === "CONFIRMED" && (
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
                            )} */}
                        </div>

                        <div className="border-b border-custom-gray-200"></div>

                        {/* Precio + Info de referidos */}
                        {/* <ReservationPriceInfo reservation={reservation} /> */}
                        <div className="flex flex-col gap-2 space-y-4">
                            <div className="flex justify-between text-sm text-custom-gray-700 w-full">
                                <p>Importe Base:</p>
                                <p>210.74€</p>
                            </div>
                            <div className="flex justify-between text-sm text-custom-gray-700 w-full">
                                <p>IVA (21%):</p>
                                <p>44.26€</p>
                            </div>
                            <div className="flex justify-between text-custom-gray-700 w-full text-lg font-bold">
                                <p>Importe Final:</p>
                                <p>255.00€</p>
                            </div>
                            <p className="text-sm text-custom-golden-600 text-end w-full hover:underline cursor-pointer">Ver detalle de descuentos</p>
                        </div>

                        <div className="border-b border-custom-gray-200"></div>

                        <div className="flex flex-col justify-center items-end gap-4 relative">
                            {/* <button className="cursor-pointer text-sm font-semibold text-red-400 hover:underline transition flex justify-center items-center gap-2">
                                <X className="size-5" />
                                Cancelar reserva
                            </button> */}
                            {true && (
                                <button
                                    onClick={() => setShowQrModal(true)}
                                    className="cursor-pointer text-sm font-medium text-custom-golden-700 hover:underline transition flex justify-center items-center gap-2"
                                >
                                    <QrCode className="size-6" />
                                    Ver QR del viaje
                                </button>
                            )}

                            {true && (
                                <div className="flex flex-col gap-2 items-center">
                                    {true ? (
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
                                                    className="absolute top-0 left-0 max-w-52 text-red-500 cursor-pointer font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition mt-1.5"
                                                >
                                                    <X className="size-4" />
                                                    Cancelar reserva
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    ) : (
                                        <p className="text-sm text-custom-gray-500 italic">
                                            No se puede cancelar la reserva porque falta menos de 24 horas para el viaje.
                                        </p>
                                    )}

                                    <AnimatePresence>
                                        {showCancelWarning && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-[#f3f4f6] border border-gray-300 p-4 rounded-xl text-sm text-gray-700"
                                            >
                                                <p className="mb-2">
                                                    Al cancelar tu reserva podrías perder tu lugar. La disponibilidad es limitada y no garantizamos
                                                    que queden plazas más adelante.
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
                                                        className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-sm font-medium py-2 px-4 rounded-lg transition"
                                                    >
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

            {/* {reservation.qr && (
                <QrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} qrUrl={reservation.qr.imageUrl} reservationId={reservation.id} />
            )} */}
        </div>
    );
};

export default ReservationVehicleCard;
