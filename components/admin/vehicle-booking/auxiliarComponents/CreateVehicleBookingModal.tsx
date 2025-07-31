"use client";

import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

interface Props {
    onClose: () => void;
    onSuccess: Dispatch<SetStateAction<VehicleBookingResponseAdmin[]>>;
    offers: SimpleOffer[];
    renters: SimpleUser[];
}

const inputClass =
    "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";
const labelClass = "block text-xs font-semibold text-custom-gray-500 mb-1 uppercase tracking-wide";

export default function CreateVehicleBookingModal({ onClose, onSuccess, offers, renters }: Props) {
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
    const startDate = watch("startDate");
    const endDate = watch("endDate");

    const selectedOffer = offers.find((o) => o.id === selectedOfferId);
    const selectedRenter = selectedOffer ? renters.find((u) => u.id === selectedOffer.ownerId) : undefined;

    const [calculatedTotal, setCalculatedTotal] = useState<number>(0);

    useEffect(() => {
        if (selectedOffer) {
            const start = new Date(selectedOffer.availableFrom).toISOString().slice(0, 10);
            const end = new Date(selectedOffer.availableTo).toISOString().slice(0, 10);
            setValue("startDate", new Date(start));
            setValue("endDate", new Date(end));
        }
    }, [selectedOffer, setValue]);

    useEffect(() => {
        if (startDate && endDate && selectedOffer) {
            const days = calculateTotalDays(String(startDate), String(endDate));
            const total = Math.round(days * selectedOffer.pricePerDay);
            setValue("totalPrice", total);
            setCalculatedTotal(days * selectedOffer.pricePerDay);
        } else {
            setCalculatedTotal(0);
        }
    }, [startDate, endDate, selectedOffer, setValue]);

    const submit = async (data: CreateVehicleBookingRequest) => {
        const toastId = toast.loading("Creando reserva...");
        try {
            const res = (await createVehicleBooking(data)) as VehicleBookingResponseAdmin;
            toast.success("Viaje creado con éxito", { id: toastId });
            onSuccess((prev) => [...prev, res]);
            onClose();
        } catch {
            toast.info("Error al crear el viaje intente nuevamente", { id: toastId });
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-8 my-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-2 text-custom-golden-700">Crear nueva reserva</h2>
                <p className="text-sm text-custom-gray-500 mb-6">Completa los datos para registrar una nueva reserva de vehículo.</p>

                <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800">
                    <div className="col-span-full">
                        <h3 className="text-base font-semibold text-custom-golden-600 mb-1">Datos de la reserva</h3>
                        <hr className="mb-4" />
                    </div>

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
                    {/* Selector de cliente */}
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

                    {selectedRenter && (
                        <div className="col-span-full bg-custom-gray-50 border border-custom-gray-300 rounded-lg p-4 text-sm">
                            <p>
                                <strong>Propietario:</strong> {selectedRenter.name} {selectedRenter.lastName} – {selectedRenter.email}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Fecha de inicio *</label>
                        <input type="date" {...register("startDate", { required: true })} className={inputClass} readOnly />
                        {errors.startDate && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Fecha de fin *</label>
                        <input type="date" {...register("endDate", { required: true })} className={inputClass} readOnly />
                        {errors.endDate && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Total estimado (€)</label>
                        <input type="text" value={calculatedTotal.toFixed(2)} readOnly className={`${inputClass} bg-gray-100`} />
                    </div>

                    <div>
                        <label className={labelClass}>Método de pago *</label>
                        <select {...register("paymentMethod", { required: true })} className={inputClass}>
                            <option value="">Selecciona...</option>
                            <option value="CASH">Efectivo</option>
                            <option value="STRIPE">Tarjeta</option>
                        </select>
                        {errors.paymentMethod && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div className="col-span-full flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-5 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-5 rounded-md"
                        >
                            Crear reserva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
