"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { CreatePaymentFormData, PaymentResponse, UsersWithReservations } from "@/lib/api/admin/payments/payments.type";
import { toast } from "sonner";
import { createPayment } from "@/lib/api/admin/payments/intex";

interface Props {
    onClose: () => void;
    userOptions: UsersWithReservations[];
    onSuccess: Dispatch<SetStateAction<PaymentResponse[]>>;
}

const statusMap = {
    COMPLETED: "Pagado",
    PENDING: "Pendiente",
    FAILED: "Fallido",
} as const;

const paymentMethodMap: Record<string, string> = {
    CASH: "Efectivo",
    STRIPE: "Tarjeta",
} as const;

const CreatePaymentModal = ({ onClose, userOptions, onSuccess }: Props) => {
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreatePaymentFormData>();

    const filteredReservations = userOptions.find((u) => u.id === selectedUserId)?.reservations ?? [];

    const onCreate = async (data: CreatePaymentFormData) => {
        try {
            const res = await createPayment({
                ...data,
                amount: Number(data.amount),
            });
            onSuccess((prev) => [...prev, res as PaymentResponse]);
            onClose();
            return toast.success("Pago creado con éxito");
        } catch (error) {
            console.log(error);
            return toast.info("Error al crear el pago");
        }
    };

    const submit = (data: CreatePaymentFormData) => {
        onCreate(data);
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
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black">
                    <X className="size-5" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Crear nuevo pago</h2>

                <form onSubmit={handleSubmit(submit)} className="space-y-4 text-sm text-custom-black-800">
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
                            type="text"
                            inputMode="decimal"
                            placeholder="Ej: 25.00"
                            {...register("amount", {
                                required: "Ingrese un monto",
                                validate: (value) => {
                                    const normalized = String(value).replace(",", ".");
                                    return /^[0-9]+([.,][0-9]{1,2})?$/.test(String(value)) && Number(normalized) > 0
                                        ? true
                                        : "Ingrese un número válido mayor a 0 (hasta 2 decimales)";
                                },
                            })}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value
                                    .replace(",", ".") // Coma a punto
                                    .replace(/[^0-9.]/g, "") // Elimina letras y símbolos raros
                                    .replace(/(\..*?)\..*/g, "$1"); // Solo un punto decimal
                            }}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        />
                        {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Método de pago</label>
                        <select {...register("method", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2">
                            <option value="">Selecciona un método</option>
                            {(["STRIPE", "CASH"] as const).map((m) => (
                                <option key={m} value={m}>
                                    {paymentMethodMap[m]}
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
                                    {statusMap[s]}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Crear pago
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePaymentModal;
