import { useState } from "react";
import { CalendarDays, AlertTriangle, CheckCircle2, ChevronDown, Download, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentCardData } from "@/lib/api/payments/payments.type";
import { toast } from "sonner";

type Props = {
    payment: PaymentCardData;
};

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
};

const PaymentCard = ({ payment }: Props) => {
    const [openCard, setOpenCard] = useState(false);

    const formattedDate = formatDate(payment.createdAt);
    const createdTime = formatTime(payment.createdAt);

    return (
        <div
            onClick={() => setOpenCard(!openCard)}
            className="w-full rounded-2xl border border-custom-gray-200 shadow-md bg-custom-white-100 p-6 flex flex-col gap-4 cursor-pointer transition hover:shadow-lg"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-custom-golden-700">
                    <CalendarDays className="size-5" />
                    <span className="font-semibold text-sm">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-custom-gray-500">
                    <span className="text-sm font-medium">
                        ID: <span className="text-custom-black-700">{payment.id.slice(-6)}</span>
                    </span>
                    <motion.div animate={{ rotate: openCard ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={18} />
                    </motion.div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-custom-black-900 capitalize mb-1">{payment.subscriptionName || "Pago de servicio"}</h2>
                <p className="text-sm text-custom-gray-600 capitalize">Método: {payment.method || payment.paymentMethod || "No especificado"}</p>
                <div className="flex items-center mt-2 text-custom-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Importe</h4>
                        <ChevronRight className="size-4" />
                    </div>
                    <span className="font-bold p-2">€{payment.amount.toFixed(2)}</span>
                </div>
            </div>

            <p className="text-xs text-custom-gray-500 italic">Toca para ver más detalles de tu pago</p>

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
                        <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
                            <p className="font-semibold text-custom-black-900 mb-1">Estado del pago</p>

                            {payment.status === "PENDING" && (
                                <p className="text-custom-gray-700">
                                    Este pago está pendiente. Por favor, completa el proceso para validar tu suscripción o servicio.
                                </p>
                            )}
                            {payment.status === "PAID" && (
                                <div className="flex items-center gap-2 text-green-700 font-medium">
                                    <CheckCircle2 className="size-4" />
                                    <span>Pago realizado exitosamente</span>
                                </div>
                            )}
                            {payment.status === "FAILED" && (
                                <div className="flex items-center gap-2 text-red-500 font-medium">
                                    <AlertTriangle className="size-4" />
                                    <span>Error en el pago. Intenta nuevamente.</span>
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 text-sm">
                            <p className="font-semibold text-custom-black-900 mb-1">Fecha del pago</p>
                            <p className="text-custom-gray-700">
                                {formattedDate} a las {createdTime}
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={(e) => {
                                    toast.info("Pronto estara disponible la descarga de tu comprobante.");
                                }}
                                className="flex items-center gap-2 bg-custom-golden-500 hover:bg-custom-golden-600 text-white font-medium py-2 px-4 rounded-xl transition"
                            >
                                <Download className="size-5" />
                                Descargar comprobante
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PaymentCard;
