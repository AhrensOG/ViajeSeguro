"use client";

import { useForm, Controller } from "react-hook-form";
import { DollarSign } from "lucide-react";
import Input from "./Input";
import InputWhitIcon from "./InputWhitIcon";
import Button from "./Button";
import DropdownField from "./DropdownField";
import { FormData } from "@/lib/api/vehicleOffer/vehicleOffers.types";

export default function VehicleOfferPage() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            price: 0,
            agency_fee: 0,
            withdraw_location: "",
            return_location: "",
            start_date: "",
            end_date: "",
            vehicle: "",
            conditions: "",
        },
    });

    const onSubmit = (data: FormData) => {
        console.log("Datos enviados:", data);
        reset(); // Limpiar el formulario después del envío
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-auto">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-3xl bg-custom-white-50 border border-custom-gray-200 rounded-lg flex flex-col gap-4"
            >
                <div className="flex flex-col gap-2 bg-custom-golden-500 rounded-t-lg py-4 px-4">
                    <h2 className="text-custom-white-100 font-semibold text-2xl">Nueva Oferta de Reservación de Vehículo</h2>
                    <p className="text-custom-white-50 text-sm">Complete los detalles para generar una nueva oferta</p>
                </div>

                <div className="flex gap-2 p-4 justify-between">
                    <div className="flex flex-col w-1/2">
                        <InputWhitIcon
                            id="price"
                            type="number"
                            label="Precio por día"
                            placeholder="0.00"
                            icon={<DollarSign className="h-4 w-4" />}
                            {...register("price", {
                                required: "El precio es obligatorio",
                                min: { value: 1, message: "El precio debe ser mayor a 0" },
                            })}
                        />
                        {errors.price && <span className="text-red-500 text-sm pl-1">{errors.price.message}</span>}
                    </div>

                    <div className="flex flex-col w-1/2">
                        <InputWhitIcon
                            id="agency_fee"
                            type="number"
                            label="Comisión de agencia"
                            placeholder="0.00"
                            icon={<DollarSign className="h-4 w-4" />}
                            {...register("agency_fee", {
                                required: "La comisión es obligatoria",
                                min: { value: 0, message: "La comisión no puede ser negativa" },
                            })}
                        />
                        {errors.agency_fee && <span className="text-red-500 text-sm pl-1">{errors.agency_fee.message}</span>}
                    </div>
                </div>

                <div className="flex gap-2 p-4 justify-between">
                    <div className="flex flex-col w-1/2">
                        <Input
                            id="withdraw_location"
                            label="Lugar de retiro"
                            type="text"
                            placeholder="Dirección de retiro"
                            {...register("withdraw_location", { required: "El lugar de retiro es obligatorio" })}
                        />
                        {errors.withdraw_location && <span className="text-red-500 text-sm pl-1">{errors.withdraw_location.message}</span>}
                    </div>

                    <div className="flex flex-col w-1/2">
                        <Input
                            id="return_location"
                            label="Lugar de entrega"
                            type="text"
                            placeholder="Dirección de entrega"
                            {...register("return_location", { required: "El lugar de entrega es obligatorio" })}
                        />
                        {errors.return_location && <span className="text-red-500 text-sm pl-1">{errors.return_location.message}</span>}
                    </div>
                </div>

                <div className="flex gap-2 p-4 justify-between">
                    <div className="flex flex-col w-1/2">
                        <Input
                            id="start_date"
                            type="date"
                            label="Fecha de inicio"
                            placeholder="Fecha de inicio"
                            {...register("start_date", { required: "La fecha de inicio es obligatoria" })}
                        />
                        {errors.start_date && <span className="text-red-500 text-sm pl-1">{errors.start_date.message}</span>}
                    </div>

                    <div className="flex flex-col w-1/2">
                        <Input
                            id="end_date"
                            type="date"
                            label="Fecha de finalización"
                            placeholder="Fecha de finalización"
                            {...register("end_date", { required: "La fecha de finalización es obligatoria" })}
                        />
                        {errors.end_date && <span className="text-red-500 text-sm pl-1">{errors.end_date.message}</span>}
                    </div>
                </div>

                <div className="flex gap-2 p-4 justify-between">
                    <Controller
                        name="vehicle"
                        control={control}
                        rules={{ required: "Debe seleccionar un vehículo" }}
                        render={({ field }) => (
                            <div className="flex flex-col w-full">
                                <DropdownField
                                    id="vehicle"
                                    label="Vehículo"
                                    placeholder="Seleccionar vehículo"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { label: "Sedán", value: "sedan" },
                                        { label: "SUV", value: "suv" },
                                        { label: "Furgoneta", value: "van" },
                                        { label: "Camioneta", value: "truck" },
                                    ]}
                                />
                                {errors.vehicle && <span className="text-red-500 text-sm pl-1">{errors.vehicle.message}</span>}
                            </div>
                        )}
                    />
                </div>

                <div className="px-4">
                    <label htmlFor="conditions" className="block font-medium text-custom-black-900 text-lg pl-1 mb-1">
                        Condiciones
                    </label>
                    <textarea
                        id="conditions"
                        {...register("conditions")}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-golden-500 focus:border-custom-golden-500 min-h-[100px]"
                    />
                </div>

                <div className="flex gap-2 p-4 justify-end border-t border-custom-gray-200 w-full">
                    <Button title="Cancelar" type="secondary" />
                    <Button title="Guardar" type="primary" />
                </div>
            </form>
        </div>
    );
}
