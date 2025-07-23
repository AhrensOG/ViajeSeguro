"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/lib/api/reservation/reservation.types";
import { CreateVehicleDto, Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";
import { updateVehicle } from "@/lib/api/admin/vehicles";

interface Props {
    vehicle: Vehicle;
    owners: User[];
    onClose: () => void;
    onSuccess: (updated: Vehicle) => void;
}

const EditVehicleModal = ({ vehicle, owners, onClose, onSuccess }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CreateVehicleDto>();

    useEffect(() => {
        if (vehicle) {
            setValue("plate", vehicle.plate);
            setValue("capacity", vehicle.capacity);
            setValue("serviceType", vehicle.serviceType);
            setValue("provider", vehicle.provider);
            setValue("allowSeatSelection", vehicle.allowSeatSelection);
            setValue("ownerId", vehicle.ownerId);
        }
    }, [vehicle, setValue]);

    const onSubmit = async (data: CreateVehicleDto) => {
        try {
            const updated = await updateVehicle(vehicle.id, {
                ...data,
                capacity: Number(data.capacity),
                allowSeatSelection:
                    typeof data.allowSeatSelection === "string" ? data.allowSeatSelection === "true" : Boolean(data.allowSeatSelection),
            });
            onSuccess(updated);
            onClose();
            toast.success("Vehículo actualizado");
        } catch (error) {
            toast.info(error instanceof Error ? error.message : "Error al actualizar el vehículo");
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
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

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Editar vehículo</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm text-custom-black-800">
                    <div>
                        <label className="block mb-1 font-semibold">Placa</label>
                        <input {...register("plate", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2" />
                        {errors.plate && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Capacidad</label>
                        <input
                            type="number"
                            {...register("capacity", { required: true })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        />
                        {errors.capacity && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Tipo de servicio</label>
                        <select
                            {...register("serviceType", { required: true })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            {["SIMPLE_TRIP", "RENTAL_WITH_DRIVER", "RENTAL_WITHOUT_DRIVER"].map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Proveedor</label>
                        <select {...register("provider", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2">
                            {["VS", "PRIVATE"].map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Selección de asientos</label>
                        <select
                            {...register("allowSeatSelection", {
                                validate: (v) => v === true || v === false || v === "true" || v === "false" || "Este campo es obligatorio",
                            })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Propietario</label>
                        <select {...register("ownerId", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2">
                            {owners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name} {owner.lastName} - {owner.email}
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

export default EditVehicleModal;
