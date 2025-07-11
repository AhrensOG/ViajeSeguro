"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { CreatePaymentFormData, PaymentResponse, UsersWithReservations } from "@/lib/api/admin/payments/payments.type";
import { toast } from "sonner";
import { updatePayment } from "@/lib/api/admin/payments/intex";

interface Props {
    onClose: () => void;
    userOptions: UsersWithReservations[];
    initialData: CreatePaymentFormData;
    onSuccess: Dispatch<SetStateAction<PaymentResponse[]>>;
}

const UpdatePaymentModal = ({ onClose, userOptions, initialData, onSuccess }: Props) => {
    const [selectedUserId, setSelectedUserId] = useState<string>(initialData.userId);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreatePaymentFormData>({
        defaultValues: initialData,
    });

    useEffect(() => {
        setValue("userId", initialData.userId);
        setValue("reservationId", initialData.reservationId);
        setValue("amount", initialData.amount);
        setValue("method", initialData.method);
        setValue("status", initialData.status);
    }, [initialData, setValue]);

    const filteredReservations = userOptions.find((u) => u.id === selectedUserId)?.reservations ?? [];

    const onUpdate = async (data: CreatePaymentFormData) => {
        if (!initialData.id) {
            toast.error("ID de pago no válido");
            return;
        }
        try {
            const res = await updatePayment(initialData.id, data);
            console.log(res);

            onSuccess((prev) => prev.map((p) => (p.id === initialData.id ? { ...p, ...res } : p) as PaymentResponse));
            onClose();
            return toast.success("Pago actualizado con éxito");
        } catch (error) {
            console.log(error);
            return toast.error("Error al actualizar el pago");
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose(); // función que cierra el modal
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
                    <X className="size-5" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Editar pago</h2>

                <form onSubmit={handleSubmit(onUpdate)} className="space-y-4 text-sm text-custom-black-800">
                    <div>
                        <label className="block mb-1 font-semibold">Usuario</label>
                        <select
                            {...register("userId", { required: true })}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            <option value="">Selecciona un usuario</option>
                            {userOptions.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.email}
                                </option>
                            ))}
                        </select>
                        {errors.userId && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Reserva</label>
                        <select
                            {...register("reservationId", { required: true })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            disabled={!selectedUserId || filteredReservations.length === 0}
                        >
                            <option value="">Selecciona una reserva</option>
                            {filteredReservations.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {`€ ${r.price.toFixed(2)} -- ${new Date(r.createdAt).toLocaleDateString("es-ES")}`}
                                </option>
                            ))}
                        </select>
                        {errors.reservationId && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Monto</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("amount", { required: true, min: 0.01 })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            placeholder="Ej: 25.00"
                        />
                        {errors.amount && <p className="text-red-500 text-xs">Ingrese un monto válido</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Método de pago</label>
                        <select {...register("method", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2">
                            <option value="">Selecciona un método</option>
                            {(["STRIPE", "CASH"] as const).map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        {errors.method && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Estado</label>
                        <select {...register("status", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2">
                            <option value="">Selecciona un estado</option>
                            {(["PENDING", "COMPLETED", "FAILED"] as const).map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePaymentModal;
