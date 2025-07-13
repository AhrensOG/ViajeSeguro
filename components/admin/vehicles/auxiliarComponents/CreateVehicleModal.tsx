"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/lib/api/reservation/reservation.types";
import { CreateVehicleDto, Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";
import { createVehicle } from "@/lib/api/admin/vehicles";

interface Props {
    onClose: () => void;
    owners: User[];
    onSuccess: (newVehicle: Vehicle) => void;
}

const CreateVehicleModal = ({ onClose, owners, onSuccess }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateVehicleDto>();

    const submit = async (data: CreateVehicleDto) => {
        try {
            const vehicle = await createVehicle({
                ...data,
                capacity: Number(data.capacity),
                allowSeatSelection:
                    typeof data.allowSeatSelection === "string" ? data.allowSeatSelection === "true" : Boolean(data.allowSeatSelection),
            });
            onSuccess(vehicle);
            onClose();
            toast.success("Vehículo creado exitosamente");
        } catch (error) {
            toast.info(error instanceof Error ? error.message : "Error al crear el vehículo");
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

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Crear nuevo vehículo</h2>

                <form onSubmit={handleSubmit(submit)} className="space-y-4 text-sm text-custom-black-800">
                    <div>
                        <label className="block mb-1 font-semibold">Placa</label>
                        <input
                            type="text"
                            {...register("plate", { required: true })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            placeholder="Ej: AA-123-AA"
                        />
                        {errors.plate && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Capacidad</label>
                        <input
                            type="number"
                            {...register("capacity", { required: true, min: 1 })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            placeholder="Ej: 12"
                        />
                        {errors.capacity && <p className="text-red-500 text-xs">Ingrese una capacidad válida</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Tipo de servicio</label>
                        <select
                            {...register("serviceType", { required: true })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            <option value="">Selecciona una opción</option>
                            {["SIMPLE_TRIP", "RENTAL_WITH_DRIVER", "RENTAL_WITHOUT_DRIVER"].map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        {errors.serviceType && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Proveedor</label>
                        <select {...register("provider", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2">
                            <option value="">Selecciona una opción</option>
                            {["VS", "PARTNER"].map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                        {errors.provider && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div>

                    {/* <div>
                        <label className="block mb-1 font-semibold">¿Permite selección de asientos?</label>
                        <select
                            {...register("allowSeatSelection", { required: true })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                        {errors.allowSeatSelection && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
                    </div> */}

                    <div>
                        <label className="block mb-1 font-semibold">Propietario</label>
                        <select {...register("ownerId", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2">
                            <option value="">Selecciona un propietario</option>
                            {owners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name} {owner.lastName} - {owner.email}
                                </option>
                            ))}
                        </select>
                        {errors.ownerId && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
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
                            Crear vehículo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVehicleModal;
