"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/lib/api/reservation/reservation.types";
import { CreateVehicleDto, FeatureEnum, Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";
import { updateVehicle } from "@/lib/api/admin/vehicles";

interface Props {
    vehicle: Vehicle;
    owners: User[];
    onClose: () => void;
    onSuccess: (updated: Vehicle) => void;
}

const FEATURES: { value: string; label: string }[] = [
    { value: "GPS", label: "GPS" },
    { value: "AIR_CONDITIONING", label: "Aire acondicionado" },
    { value: "BLUETOOTH", label: "Bluetooth" },
    { value: "REAR_CAMERA", label: "Cámara trasera" },
];

const inputClass =
    "w-full border border-custom-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-golden-400 shadow-sm transition";
const labelClass = "block text-[0.75rem] font-semibold text-custom-gray-600 mb-1 uppercase tracking-wide";

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
            setValue("brand", vehicle.brand);
            setValue("model", vehicle.model);
            setValue("year", vehicle.year);
            setValue("fuelType", vehicle.fuelType);
            setValue("transmissionType", vehicle.transmissionType);
            setValue("features", vehicle.features as FeatureEnum[]);
            setValue("images", vehicle.images);
        }
    }, [vehicle, setValue]);

    const onSubmit = async (data: CreateVehicleDto) => {
        try {
            const updated = await updateVehicle(vehicle.id, {
                ...data,
                year: Number(data.year),
                capacity: Number(data.capacity),
                features: data.features?.map((f) => f as FeatureEnum),
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
                className="bg-white rounded-2xl shadow-xl ring-1 ring-custom-gray-200 p-8 my-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-1 text-custom-golden-700 tracking-tight">Editar vehículo</h2>
                <p className="text-sm text-custom-gray-500 mb-6 leading-relaxed">Modifica los datos del vehículo y guarda los cambios realizados.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800">
                    <div className="col-span-full">
                        <h3 className="text-base font-semibold text-custom-golden-600 mb-1">Datos del vehículo</h3>
                        <hr className="mb-4" />
                    </div>

                    <div>
                        <label className={labelClass}>Marca</label>
                        <input type="text" {...register("brand", { required: true })} className={inputClass} />
                        {errors.brand && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Modelo</label>
                        <input type="text" {...register("model", { required: true })} className={inputClass} />
                        {errors.model && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Año</label>
                        <input type="number" {...register("year", { required: true, min: 1950, max: 2099 })} className={inputClass} />
                        {errors.year && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Transmisión</label>
                        <select {...register("transmissionType", { required: true })} className={inputClass}>
                            <option value="">Selecciona una opción</option>
                            <option value="MANUAL">Manual</option>
                            <option value="AUTOMATIC">Automática</option>
                        </select>
                        {errors.transmissionType && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Combustible</label>
                        <select {...register("fuelType", { required: true })} className={inputClass}>
                            <option value="">Selecciona una opción</option>
                            <option value="GASOLINE">Gasolina</option>
                            <option value="DIESEL">Diesel</option>
                            <option value="ELECTRIC">Eléctrico</option>
                            <option value="HYBRID">Híbrido</option>
                        </select>
                        {errors.fuelType && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Capacidad</label>
                        <input type="number" {...register("capacity", { required: true, min: 1 })} className={inputClass} />
                        {errors.capacity && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Patente</label>
                        <input type="text" {...register("plate", { required: true })} className={inputClass} />
                        {errors.plate && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Proveedor</label>
                        <select {...register("provider", { required: true })} className={inputClass}>
                            <option value="">Selecciona una opción</option>
                            <option value="PARTNER">Particular</option>
                            <option value="VS">Viaje Seguro</option>
                        </select>
                        {errors.provider && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Tipo de servicio</label>
                        <select {...register("serviceType", { required: true })} className={inputClass}>
                            <option value="">Selecciona una opción</option>
                            <option value="SIMPLE_TRIP">Viaje simple</option>
                            <option value="RENTAL_WITH_DRIVER">Viaje con conductor</option>
                            <option value="RENTAL_WITHOUT_DRIVER">Viaje sin conductor</option>
                        </select>
                        {errors.serviceType && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Selección de asientos</label>
                        <select
                            {...register("allowSeatSelection", {
                                validate: (v) => v === true || v === false || v === "true" || v === "false" || "Este campo es obligatorio",
                            })}
                            className={inputClass}
                        >
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Dueño del vehículo</label>
                        <select {...register("ownerId", { required: true })} className={inputClass}>
                            <option value="">Selecciona un dueño</option>
                            {owners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name} {owner.lastName} - {owner.email}
                                </option>
                            ))}
                        </select>
                        {errors.ownerId && <p className="text-red-500 text-xs">Campo obligatorio</p>}
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Características</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {FEATURES.map((feature) => (
                                <label
                                    key={feature.value}
                                    className="flex items-center gap-2 bg-custom-gray-100 px-3 py-2 rounded-md shadow-inner text-sm"
                                >
                                    <input type="checkbox" value={feature.value} {...register("features")} className="accent-custom-golden-600" />
                                    <span>{feature.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-full flex justify-end gap-3 mt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2.5 px-6 rounded-md transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2.5 px-6 rounded-md transition shadow"
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
