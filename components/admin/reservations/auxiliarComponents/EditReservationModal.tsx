import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { CreateReservationFormData, TripOption, UserOption, ReservationResponse } from "@/lib/api/admin/reservation/reservation.types";
import { updateReservation } from "@/lib/api/admin/reservation/intex";

interface Props {
    users: UserOption[];
    trips: TripOption[];
    initialData: CreateReservationFormData;
    onClose: () => void;
    onSuccess: Dispatch<SetStateAction<ReservationResponse[]>>;
}

const EditReservationModal = ({ users, trips, initialData, onClose, onSuccess }: Props) => {
    const [form, setForm] = useState({ ...initialData });

    useEffect(() => {
        setForm({ ...initialData });
    }, [initialData]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await updateReservation({
                tripId: form.tripId,
                price: Number(form.price),
                status: form.status,
                paymentMethod: form.paymentMethod,
                seatCode: form.seatCode || undefined,
                discountId: form.discountId || undefined,
                userId: form.userId,
                id: form.id,
            });
            console.log("Reserva actualizada:", res);

            onSuccess((prev) => prev.filter((r) => r.id !== res.id).concat(res));
            toast.success("Reserva actualizada con éxito");
            onClose();
        } catch (error) {
            console.error(error);
            return toast.error("Error al actualizar la reserva");
        }
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Editar reserva</h2>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm text-custom-black-800">
                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Usuario</label>
                        <select
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            required
                        >
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Viaje</label>
                        <select
                            name="tripId"
                            value={form.tripId}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            required
                        >
                            {trips.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.label} ({formatDate(t.date)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Precio</label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            required
                        />
                    </div>

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

export default EditReservationModal;
