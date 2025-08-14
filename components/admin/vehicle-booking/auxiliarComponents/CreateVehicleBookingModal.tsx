"use client";

import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
    CreateVehicleBookingRequest,
    SimpleOffer,
    SimpleUser,
    VehicleBookingResponseAdmin,
} from "@/lib/api/admin/vehicle-bookings/vehicleBookings.types";
import { calculateTotalDays } from "@/lib/functions";
import { createVehicleBooking } from "@/lib/api/admin/vehicle-bookings";
import { toast } from "sonner";
import CustomDatePickerVehicle from "@/lib/client/components/CustomDatePickerVehicle";
import { Matcher } from "react-day-picker";

interface Props {
    onClose: () => void;
    onSuccess: Dispatch<SetStateAction<VehicleBookingResponseAdmin[]>>;
    offers: SimpleOffer[];
    renters: SimpleUser[];
    bookings: VehicleBookingResponseAdmin[];
}

const inputClass =
    "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";
const labelClass = "block text-xs font-semibold text-custom-gray-500 mb-1 uppercase tracking-wide";

// ===== Helpers en hora LOCAL (no UTC) =====
const toLocalDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const clampToLocalDay = (iso: string | Date) => {
    const d = new Date(iso);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const ACTIVE_BOOKING_STATUSES = new Set([
    "PENDING",
    "APPROVED",
    "COMPLETED",
    // si no querés bloquear FINISHED, quítalo:
    "FINISHED",
]);
type DateRange = { from: Date; to: Date };

export default function CreateVehicleBookingModal({ onClose, onSuccess, offers, renters, bookings }: Props) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CreateVehicleBookingRequest>({
        defaultValues: {
            status: "PENDING",
        },
    });

    const selectedOfferId = watch("offerId");
    const selectedOffer = useMemo(() => offers.find((o) => o.id === selectedOfferId), [offers, selectedOfferId]);

    const selectedRenter = selectedOffer ? renters.find((u) => u.id === selectedOffer.ownerId) : undefined;

    // estados locales para los pickers
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
    const IVA = Number(process.env.NEXT_PUBLIC_IVA || 21);

    // Bordes de la oferta (LOCAL)
    const offerFromDate = useMemo(() => (selectedOffer ? clampToLocalDay(selectedOffer.availableFrom) : undefined), [selectedOffer]);
    const offerToDate = useMemo(() => (selectedOffer ? clampToLocalDay(selectedOffer.availableTo) : undefined), [selectedOffer]);

    // RANGOS OCUPADOS por reservas de ESTA oferta (LOCAL)
    const occupiedRanges: DateRange[] = useMemo(() => {
        if (!selectedOffer) return [];
        const related = bookings.filter((b) => b.offer.id === selectedOffer.id && ACTIVE_BOOKING_STATUSES.has(b.status));
        return related.map((b) => ({
            from: clampToLocalDay(b.startDate),
            to: clampToLocalDay(b.endDate), // inclusivo
        }));
    }, [bookings, selectedOffer]);

    // Disabled base por bordes de oferta
    const borderDisabled: Matcher[] = useMemo(() => {
        const out: Matcher[] = [];
        if (offerFromDate) out.push({ before: offerFromDate });
        if (offerToDate) out.push({ after: offerToDate });
        return out;
    }, [offerFromDate, offerToDate]);

    // ===== Buffers de 1 día para evitar back-to-back =====
    // Si una booking termina el 21, el próximo inicio permitido será el 22 (no 20/21).
    const disabledForStart: Matcher[] = useMemo(() => {
        const buffers: DateRange[] = occupiedRanges.map((r) => {
            const dayBeforeEnd = addDays(r.to, -1);
            return { from: dayBeforeEnd, to: dayBeforeEnd };
        });
        const result: Matcher[] = [...occupiedRanges, ...buffers, ...borderDisabled];
        return result;
    }, [occupiedRanges, borderDisabled]);

    const disabledForEnd: Matcher[] = useMemo(() => {
        const buffers: DateRange[] = occupiedRanges.map((r) => {
            const dayBeforeStart = addDays(r.from, -1);
            return { from: dayBeforeStart, to: dayBeforeStart };
        });
        const out: Matcher[] = [...occupiedRanges, ...buffers, ...borderDisabled];
        if (startDate) out.push({ before: toLocalDay(startDate) }); // fin >= inicio
        return out;
    }, [occupiedRanges, borderDisabled, startDate]);

    // Reset al cambiar oferta
    useEffect(() => {
        setStartDate(undefined);
        setEndDate(undefined);
        setCalculatedTotal(0);
        setValue("startDate", undefined as unknown as Date);
        setValue("endDate", undefined as unknown as Date);
        setValue("totalPrice", undefined as unknown as number);
    }, [selectedOfferId, setValue]);

    // Si FIN queda inválida, limpiarla (comparaciones en LOCAL)
    useEffect(() => {
        if (!endDate) return;

        if (startDate && toLocalDay(endDate) < toLocalDay(startDate)) {
            setEndDate(undefined);
            setValue("endDate", undefined as unknown as Date);
            return;
        }
        if ((offerFromDate && toLocalDay(endDate) < offerFromDate) || (offerToDate && toLocalDay(endDate) > offerToDate)) {
            setEndDate(undefined);
            setValue("endDate", undefined as unknown as Date);
            return;
        }
        // cae dentro de un rango ocupado (inclusive)
        const hitDisabled = occupiedRanges.some((r: DateRange) => {
            const ed = toLocalDay(endDate);
            return ed >= toLocalDay(r.from) && ed <= toLocalDay(r.to);
        });
        if (hitDisabled) {
            setEndDate(undefined);
            setValue("endDate", undefined as unknown as Date);
        }
    }, [startDate, endDate, offerFromDate, offerToDate, occupiedRanges, setValue]);

    // Recalcular total (usar las fechas locales)
    useEffect(() => {
        if (startDate && endDate && selectedOffer) {
            const days = calculateTotalDays(String(startDate), String(endDate));
            const total = Math.round(days * selectedOffer.pricePerDay);
            setValue("totalPrice", total);
            setCalculatedTotal(days * selectedOffer.pricePerDay);
            setValue("startDate", startDate);
            setValue("endDate", endDate);
        } else {
            setCalculatedTotal(0);
            setValue("totalPrice", undefined as unknown as number);
        }
    }, [startDate, endDate, selectedOffer, setValue]);

    const canSubmit = Boolean(selectedOfferId && startDate && endDate);

    const submit = async (data: CreateVehicleBookingRequest) => {
        const toastId = toast.loading("Creando reserva...");
        try {
            const res = (await createVehicleBooking(data)) as VehicleBookingResponseAdmin;
            toast.success("Reserva creada con éxito", { id: toastId });
            onSuccess((prev) => [...prev, res]);
            onClose();
        } catch {
            toast.info("Error al crear la reserva, intenta nuevamente", { id: toastId });
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-8 my-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-2 text-custom-golden-700">Crear nueva reserva</h2>
                <p className="text-sm text-custom-gray-500 mb-6">Completa los datos para registrar una nueva reserva de vehículo.</p>

                <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800">
                    <div className="col-span-full">
                        <h3 className="text-base font-semibold text-custom-golden-600 mb-1">Datos de la reserva</h3>
                        <hr className="mb-4" />
                    </div>

                    {/* Oferta */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>Oferta *</label>
                        <select {...register("offerId", { required: true })} className={inputClass}>
                            <option value="">Selecciona una oferta</option>
                            {offers.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.vehicle.brand} {o.vehicle.model} ({o.vehicle.year}) – {o.withdrawLocation}
                                </option>
                            ))}
                        </select>
                        {errors.offerId && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    {/* Cliente */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>Cliente *</label>
                        <select {...register("renterId", { required: true })} className={inputClass}>
                            <option value="">Selecciona un cliente</option>
                            {renters.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name} {r.lastName} – {r.email}
                                </option>
                            ))}
                        </select>
                        {errors.renterId && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    {/* INFO de oferta */}
                    {selectedOffer && (
                        <div className="col-span-full bg-custom-gray-50 border border-custom-gray-300 rounded-lg p-4 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <p>
                                    <strong>Vehículo:</strong> {selectedOffer.vehicle.brand} {selectedOffer.vehicle.model} (
                                    {selectedOffer.vehicle.year})
                                </p>
                                <p>
                                    <strong>Capacidad:</strong> {selectedOffer.vehicle.capacity} pasajeros
                                </p>
                                <p>
                                    <strong>Precio por día:</strong> €{selectedOffer.pricePerDay}
                                </p>
                                <p>
                                    <strong>Tipo de oferta:</strong>{" "}
                                    {selectedOffer.vehicleOfferType === "WITH_DRIVER" ? "Con conductor" : "Sin conductor"}
                                </p>
                                <p>
                                    <strong>Disponible desde:</strong> {new Date(selectedOffer.availableFrom).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Disponible hasta:</strong> {new Date(selectedOffer.availableTo).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Ubicación retiro:</strong> {selectedOffer.withdrawLocation}
                                </p>
                                <p>
                                    <strong>Ubicación devolución:</strong> {selectedOffer.returnLocation}
                                </p>
                                <p className="md:col-span-2">
                                    <strong>Condiciones:</strong> {selectedOffer.conditions}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* (Opcional) info propietario */}
                    {selectedRenter && (
                        <div className="col-span-full bg-custom-gray-50 border border-custom-gray-300 rounded-lg p-4 text-sm">
                            <p>
                                <strong>Propietario:</strong> {selectedRenter.name} {selectedRenter.lastName} – {selectedRenter.email}
                            </p>
                        </div>
                    )}

                    {/* DatePickers */}
                    <div>
                        <label className={labelClass}>Fecha de inicio *</label>
                        <CustomDatePickerVehicle
                            value={startDate}
                            onSelect={(d) => setStartDate(d ? toLocalDay(d) : undefined)}
                            fromDate={offerFromDate}
                            toDate={offerToDate}
                            disabled={disabledForStart}
                            placeholder="Elige fecha de inicio"
                        />
                        {errors.startDate && <p className="text-red-500 text-xs mt-1">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Fecha de fin *</label>
                        <CustomDatePickerVehicle
                            value={endDate}
                            onSelect={(d) => setEndDate(d ? toLocalDay(d) : undefined)}
                            fromDate={offerFromDate}
                            toDate={offerToDate}
                            disabled={disabledForEnd}
                            placeholder="Elige fecha de fin"
                        />
                        {errors.endDate && <p className="text-red-500 text-xs mt-1">Campo obligatorio</p>}
                    </div>

                    {/* Totales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Total sin IVA (€)</label>
                            <input type="text" value={calculatedTotal.toFixed(2)} readOnly className={`${inputClass} bg-gray-100`} />
                        </div>

                        <div>
                            <label className={labelClass}>Total con IVA ({IVA}%) (€)</label>
                            <input
                                type="text"
                                value={(calculatedTotal * (1 + IVA / 100)).toFixed(2)}
                                readOnly
                                className={`${inputClass} bg-gray-100`}
                            />
                        </div>
                    </div>

                    {/* Método de pago */}
                    <div>
                        <label className={labelClass}>Método de pago *</label>
                        <select {...register("paymentMethod", { required: true })} className={inputClass}>
                            <option value="">Selecciona...</option>
                            <option value="STRIPE">Tarjeta</option>
                        </select>
                        {errors.paymentMethod && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div className="col-span-full flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-5 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`cursor-pointer font-semibold py-2 px-5 rounded-md ${
                                canSubmit
                                    ? "bg-custom-golden-600 hover:bg-custom-golden-700 text-white"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                        >
                            Crear reserva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
