"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "sonner";
import { SimpleOffer, SimpleUser, VehicleBookingResponseAdmin } from "@/lib/api/admin/vehicle-bookings/vehicleBookings.types";
import { updateStatus } from "@/lib/api/admin/vehicle-bookings";

interface Props {
    onClose: () => void;
    onSuccess: Dispatch<SetStateAction<VehicleBookingResponseAdmin[]>>;
    booking: VehicleBookingResponseAdmin;
    renters: SimpleUser[];
    offers: SimpleOffer[];
}

interface FormData {
    id: string;
    renterId: string;
    offerId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: "PENDING" | "APPROVED" | "COMPLETED";
    referralId?: string;
    paymentMethod?: string;
}

const inputClass =
    "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";
const labelClass = "block text-xs font-semibold text-custom-gray-500 mb-1 uppercase tracking-wide";

const EditVehicleBookingModal = ({ onClose, onSuccess, booking }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>();

    useEffect(() => {
        setValue("id", booking.id);
        setValue("renterId", booking.renter.id);
        setValue("offerId", booking.offer.id);
        setValue("startDate", booking.startDate.slice(0, 10));
        setValue("endDate", booking.endDate.slice(0, 10));
        setValue("totalPrice", booking.totalPrice);
        setValue("status", booking.status as "PENDING" | "APPROVED" | "COMPLETED");
    }, [booking, setValue]);

    const submit: SubmitHandler<FormData> = async (data) => {
        try {
            const res = (await updateStatus(booking.id, data.status)) as VehicleBookingResponseAdmin;
            const updated = res;
            onSuccess((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
            onClose();
            toast.success("Reserva actualizada exitosamente");
        } catch {
            toast.info("Error al editar la reserva");
        }
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-8 my-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-2 text-custom-golden-700">Editar reserva</h2>
                <p className="text-sm text-custom-gray-500 mb-6">Modifica los datos de la reserva seleccionada.</p>

                <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800">
                    <input type="hidden" {...register("id", { required: true })} />

                    <div>
                        <label className={labelClass}>Arrendatario</label>
                        <p className="px-4 py-2 border border-custom-gray-300 rounded-md bg-gray-50">
                            {booking.renter.name} {booking.renter.lastName} - {booking.renter.email}
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>Oferta</label>
                        <p className="px-4 py-2 border border-custom-gray-300 rounded-md bg-gray-50">
                            {booking.offer.withdrawLocation} → {booking.offer.returnLocation} (€{booking.offer.pricePerDay}/día)
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>Fecha de inicio</label>
                        <input type="date" value={booking.startDate.slice(0, 10)} className={inputClass} readOnly />
                    </div>

                    <div>
                        <label className={labelClass}>Fecha de fin</label>
                        <input type="date" value={booking.endDate.slice(0, 10)} className={inputClass} readOnly />
                    </div>

                    <div>
                        <label className={labelClass}>Precio total (€)</label>
                        <input type="number" value={booking.totalPrice} className={inputClass} readOnly />
                    </div>

                    <div>
                        <label className={labelClass}>Estado</label>
                        <select {...register("status", { required: true })} className={inputClass}>
                            <option value="">Selecciona un estado</option>
                            <option value="PENDING">Pendiente</option>
                            <option value="APPROVED">Aprobado</option>
                            <option value="COMPLETED">Completado</option>
                            <option value="DECLINED">Rechazado</option>
                            <option value="FINISHED">Finalizado</option>
                            <option value="CANCELLED">Cancelado</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-xs">Campo obligatorio</p>}
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
                            className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-5 rounded-md"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVehicleBookingModal;
