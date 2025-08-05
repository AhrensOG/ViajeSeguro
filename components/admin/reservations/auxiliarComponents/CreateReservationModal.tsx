import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X } from "lucide-react";
import { CreateReservationFormData, TripOption, UserOption, ReservationResponse } from "@/lib/api/admin/reservation/reservation.types";
import { toast } from "sonner";
import { createReservation } from "@/lib/api/admin/reservation/intex";

interface Props {
    users: UserOption[];
    trips: TripOption[];
    onClose: () => void;
    onSuccess: Dispatch<SetStateAction<ReservationResponse[]>>;
}

type FormState = {
    userId: string;
    tripId: string;
    // price: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    paymentMethod: "STRIPE" | "CASH";
    seatCode?: string;
    // discountId?: string;
};

const CreateReservationModal = ({ users, trips, onClose, onSuccess }: Props) => {
    const [form, setForm] = useState<FormState>({
        userId: "",
        tripId: "",
        // price: 0,
        status: "PENDING",
        paymentMethod: "STRIPE",
        seatCode: "",
        // discountId: "",
    });

    const formatDate = (str: string): string => {
        const [datePart, timePart] = str.split(" ");
        if (!datePart || !timePart) return "Fecha inválida";
        const [day, month] = datePart.split("/");
        const [hour, minute] = timePart.split(":");
        if (!day || !month || !hour || !minute) return "Fecha inválida";
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const onSubmit = async (data: CreateReservationFormData) => {
        try {
            const res = await createReservation(data, form.userId);
            toast.success("Reserva creada con éxito");
            onSuccess((prev) => [...prev, res as ReservationResponse]);
            onClose();
        } catch (error) {
            console.error(error);
            return toast.info(
                error instanceof Error
                    ? error.message === "Trip is already full"
                        ? "Viaje lleno"
                        : "Error al crear la reserva"
                    : "Error al crear la reserva"
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            tripId: form.tripId,
            // price: Number(form.price),
            status: form.status,
            paymentMethod: form.paymentMethod,
            seatCode: form.seatCode || undefined,
            // discountId: form.discountId || undefined,
        });
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
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Crear nueva reserva</h2>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm text-custom-black-800">
                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Seleccionar usuario</label>
                        <select
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            required
                        >
                            <option value="">-- Seleccionar --</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Seleccionar viaje</label>
                        <select
                            name="tripId"
                            value={form.tripId}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            required
                        >
                            <option value="">-- Seleccionar --</option>
                            {trips.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.label} ({formatDate(t.date)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Precio</label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            required
                        />
                    </div> */}

                    {/* {(["seatCode", "discountId"] as const).map((name) => (
                        <div key={name}>
                            <label className="block text-xs font-semibold text-custom-gray-500 mb-1">
                                {name === "seatCode" ? "Código de asiento (opcional)" : "ID de descuento (opcional)"}
                            </label>
                            <input
                                name={name}
                                type="text"
                                value={form[name] ?? ""}
                                onChange={handleChange}
                                className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            />
                        </div>
                    ))} */}

                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Estado</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            {["PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Método de pago</label>
                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            {["STRIPE", "CASH", "OTHER"].map((method) => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
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
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReservationModal;
