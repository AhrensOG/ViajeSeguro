"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CreateVehicleOfferRequest, VehicleOffersAdminResponse } from "@/lib/api/admin/vehicle-offers/vehicleOffers.types";
import { updateVehicleOffer } from "@/lib/api/admin/vehicle-offers";
import { toast } from "sonner";

interface Props {
    onClose: () => void;
    offer: VehicleOffersAdminResponse;
    afterEdit: (updatedOffer: VehicleOffersAdminResponse) => void;
    vehicles: {
        id: string;
        brand: string;
        model: string;
        fuelType: string;
        transmissionType: string;
        capacity: number;
        year: number;
        plate: string;
        features: string[];
        ownerId: string;
    }[];
    owners: {
        id: string;
        name: string;
        lastName: string;
        email: string;
    }[];
}

type FormData = {
    pricePerDay: string;
    withdrawLocation: string;
    returnLocation: string;
    availableFrom: string;
    availableTo: string;
    agencyFee: string;
    depositAmount: string;
    dailyMileageLimit: string;
    vehicleOfferType: "WITH_DRIVER" | "WITHOUT_DRIVER";
    vehicleId: string;
    ownerId: string;
    conditions: string;
};

const inputClass =
    "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";
const labelClass = "block text-xs font-semibold text-custom-gray-500 mb-1 uppercase tracking-wide";

const EditVehicleOfferModal = ({ onClose, offer, afterEdit, vehicles, owners }: Props) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            pricePerDay: offer.pricePerDay.toString(),
            agencyFee: offer.agencyFee.toString(),
            depositAmount: offer.depositAmount.toString(),
            dailyMileageLimit: (offer.dailyMileageLimit ?? 200).toString(),
            withdrawLocation: offer.withdrawLocation,
            returnLocation: offer.returnLocation,
            availableFrom: new Date(offer.availableFrom).toISOString().split("T")[0],
            availableTo: new Date(offer.availableTo).toISOString().split("T")[0],
            vehicleOfferType: offer.vehicleOfferType as "WITH_DRIVER" | "WITHOUT_DRIVER",
            vehicleId: offer.vehicle.id,
            ownerId: offer.owner.id,
            conditions: offer.conditions ?? "",
        },
    });

    const selectedVehicle = vehicles.find((v) => v.id === watch("vehicleId"));
    const selectedOwner = owners.find((o) => o.id === watch("ownerId"));

    useEffect(() => {
        const vehicleId = watch("vehicleId");
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        if (vehicle) {
            setValue("ownerId", vehicle.ownerId);
        }
    }, [vehicles, watch, setValue]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const updatedOffer: CreateVehicleOfferRequest = {
                pricePerDay: Number(data.pricePerDay),
                withdrawLocation: data.withdrawLocation,
                returnLocation: data.returnLocation,
                originalTimeZone: offer.originalTimeZone,
                availableFrom: new Date(data.availableFrom),
                availableTo: new Date(data.availableTo),
                agencyFee: Number(data.agencyFee),
                depositAmount: Number(data.depositAmount),
                dailyMileageLimit: Number(data.dailyMileageLimit),
                vehicleOfferType: data.vehicleOfferType,
                vehicleId: data.vehicleId,
                ownerId: data.ownerId,
                conditions: data.conditions,
                available: offer.available,
            };

            const res = await updateVehicleOffer(offer.id, updatedOffer);
            toast.success("Viaje actualizado con éxito");
            afterEdit(res as VehicleOffersAdminResponse);
            onClose();
        } catch {
            toast.info("Error al actualizar el viaje");
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

                <h2 className="text-2xl font-bold mb-2 text-custom-golden-700">Editar oferta de vehículo</h2>
                <p className="text-sm text-custom-gray-500 mb-6">Edita los campos necesarios para actualizar la oferta.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800">
                    <div className="col-span-full">
                        <h3 className="text-base font-semibold text-custom-golden-600 mb-1">Datos del vehículo</h3>
                        <hr className="mb-4" />
                    </div>

                    <div>
                        <label className={labelClass}>Vehículo</label>
                        <select {...register("vehicleId", { required: true })} className={inputClass}>
                            {vehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.brand} {v.model} ({v.year})
                                </option>
                            ))}
                        </select>
                        {errors.vehicleId && <p className="text-red-500 text-xs">{"El vehículo es requerido"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Placa</label>
                        <input value={selectedVehicle?.plate ?? ""} className={inputClass} readOnly />
                    </div>

                    <div>
                        <label className={labelClass}>Capacidad</label>
                        <input value={selectedVehicle?.capacity ?? ""} className={inputClass} readOnly />
                    </div>

                    <div>
                        <label className={labelClass}>Combustible</label>
                        <input value={selectedVehicle?.fuelType ?? ""} className={inputClass} readOnly />
                    </div>

                    <div>
                        <label className={labelClass}>Transmisión</label>
                        <input value={selectedVehicle?.transmissionType ?? ""} className={inputClass} readOnly />
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClass}>Características del vehículo</label>
                        {selectedVehicle?.features?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedVehicle.features.map((feature, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-xs bg-custom-gray-200 text-custom-black-700 rounded-full border border-custom-gray-300"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-custom-gray-500 italic">Sin características especificadas</p>
                        )}
                    </div>

                    <div className="col-span-full">
                        <h3 className={labelClass}>Información de la oferta</h3>
                        <hr className="mb-4" />
                    </div>

                    <div>
                        <label className={labelClass}>Precio por día (€)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            {...register("pricePerDay", {
                                required: true,
                                validate: (value) => /^[0-9]*[.,]?[0-9]{0,2}$/.test(value) || "Formato inválido (usa solo números)",
                            })}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value
                                    .replace(",", ".") // convierte coma en punto
                                    .replace(/[^0-9.]/g, "") // bloquea letras y símbolos
                                    .replace(/(\..*?)\..*/g, "$1"); // solo un punto
                            }}
                            className={inputClass}
                        />
                        {errors.pricePerDay && <p className="text-red-500 text-xs">{errors.pricePerDay.message || "Campo obligatorio"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Tarifa de agencia (€)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            {...register("agencyFee", {
                                required: true,
                                validate: (value) => /^[0-9]*[.,]?[0-9]{0,2}$/.test(value) || "Formato inválido (usa solo números)",
                            })}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value
                                    .replace(",", ".")
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*?)\..*/g, "$1");
                            }}
                            className={inputClass}
                        />
                        {errors.agencyFee && <p className="text-red-500 text-xs">{errors.agencyFee.message || "Campo obligatorio"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Fianza (€)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            {...register("depositAmount", {
                                required: "La fianza es obligatoria",
                                validate: (value) => /^[0-9]*[.,]?[0-9]{0,2}$/.test(value) || "Formato inválido (usa solo números)",
                            })}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value
                                    .replace(",", ".")
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*?)\..*/g, "$1");
                            }}
                            className={inputClass}
                        />
                        {errors.depositAmount && <p className="text-red-500 text-xs">{errors.depositAmount.message || "Campo obligatorio"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Kilómetros por día</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            {...register("dailyMileageLimit", {
                                required: "El límite de kilometraje es obligatorio",
                                validate: (value) => /^[0-9]+$/.test(value) || "Debe ser un número entero",
                                min: { value: 1, message: "Debe ser al menos 1 km" },
                            })}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value.replace(/[^0-9]/g, "");
                            }}
                            className={inputClass}
                            placeholder="200"
                        />
                        {errors.dailyMileageLimit && <p className="text-red-500 text-xs">{errors.dailyMileageLimit.message || "Campo obligatorio"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Tipo de oferta</label>
                        <select {...register("vehicleOfferType", { required: true })} className={inputClass}>
                            <option value="WITH_DRIVER">Con conductor</option>
                            <option value="WITHOUT_DRIVER">Sin conductor</option>
                        </select>
                        {errors.vehicleOfferType && <p className="text-red-500 text-xs">{"Campo obligatorio"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Disponible desde</label>
                        <input
                            type="date"
                            {...register("availableFrom", { required: true })}
                            className={inputClass}
                            min={"2023-01-01"}
                            max={"2099-12-31"}
                        />
                        {errors.availableFrom && <p className="text-red-500 text-xs">{"Campo obligatorio"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Disponible hasta</label>
                        <input
                            type="date"
                            {...register("availableTo", { required: true })}
                            className={inputClass}
                            min={watch("availableFrom")}
                            max={"2099-12-31"}
                        />
                        {errors.availableTo && <p className="text-red-500 text-xs">{"Campo obligatorio"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Ubicación de retiro</label>
                        <input type="text" {...register("withdrawLocation", { required: true })} className={inputClass} />
                        {errors.withdrawLocation && <p className="text-red-500 text-xs">{"Campo obligatorio"}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Ubicación de devolución</label>
                        <input type="text" {...register("returnLocation", { required: true })} className={inputClass} />
                        {errors.returnLocation && <p className="text-red-500 text-xs">{"Campo obligatorio"}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClass}>Condiciones</label>
                        <textarea {...register("conditions")} className={inputClass} rows={3} />
                    </div>

                    <div className="col-span-full">
                        <h3 className={labelClass}>Propietario</h3>
                        <hr className="mb-4" />
                    </div>

                    <div>
                        <label className={labelClass}>Correo del propietario</label>
                        <input value={selectedOwner?.email ?? ""} className={inputClass} readOnly />
                    </div>

                    <div>
                        <label className={labelClass}>Nombre</label>
                        <input value={selectedOwner?.name ?? ""} className={inputClass} readOnly />
                    </div>

                    <div>
                        <label className={labelClass}>Apellido</label>
                        <input value={selectedOwner?.lastName ?? ""} className={inputClass} readOnly />
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

export default EditVehicleOfferModal;
