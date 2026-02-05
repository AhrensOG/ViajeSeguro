"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CreateVehicleOfferRequest,
  SimpleUser,
  SimpleVehicle,
  VehicleOffersAdminResponse,
} from "@/lib/api/admin/vehicle-offers/vehicleOffers.types";
import { createVehicleOffer } from "@/lib/api/admin/vehicle-offers";

interface Props {
  onClose: () => void;
  onSuccess: Dispatch<SetStateAction<VehicleOffersAdminResponse[]>>;
  vehicles: SimpleVehicle[];
  owners: SimpleUser[];
}
type FormData = {
  vehicleId: string;
  ownerId: string;
  pricePerDay: string;
  agencyFee: string;
  vehicleOfferType: "WITH_DRIVER" | "WITHOUT_DRIVER";
  availableFrom: string;
  availableTo: string;
  withdrawLocation: string;
  returnLocation: string;
  conditions?: string;
  depositAmount: string;
  dailyMileageLimit: string;
};

const inputClass =
  "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";
const labelClass =
  "block text-xs font-semibold text-custom-gray-500 mb-1 uppercase tracking-wide";

const CreateVehicleOfferModal = ({
  onClose,
  onSuccess,
  vehicles,
  owners,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const selectedVehicleId = watch("vehicleId");
  const [matchedOwner, setMatchedOwner] = useState<SimpleUser | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<SimpleVehicle | null>(null);

  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (vehicle) {
        setSelectedVehicle(vehicle);

        // Solo buscar y asignar owner si NO es vehículo de Viaje Seguro
        if (vehicle.provider !== "VS") {
          const owner = owners.find((o) => o.id === vehicle.ownerId);
          if (owner) {
            setValue("ownerId", owner.id);
            setMatchedOwner(owner);
          } else {
            setMatchedOwner(null);
          }
        } else {
          // Para vehículos VS, limpiar el owner y no asignar ownerId
          setMatchedOwner(null);
          setValue("ownerId", "");
        }
      }
    } else {
      setSelectedVehicle(null);
      setMatchedOwner(null);
    }
  }, [selectedVehicleId, vehicles, owners, setValue]);

  const submit: SubmitHandler<FormData> = async (data) => {
    const toastId = toast.loading("Creando oferta de vehículo...");
    try {
      const depositParsed = Number(String(data.depositAmount ?? "").replace(",", "."));
      if (Number.isNaN(depositParsed) || depositParsed < 0) {
        toast.error("La fianza debe ser un número válido mayor o igual a 0", { id: toastId });
        return;
      }

      const payload: CreateVehicleOfferRequest = {
        pricePerDay: Number(data.pricePerDay),
        withdrawLocation: data.withdrawLocation,
        returnLocation: data.returnLocation,
        originalTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        availableFrom: new Date(data.availableFrom),
        availableTo: new Date(data.availableTo),
        agencyFee: Number(data.agencyFee),
        depositAmount: depositParsed,
        dailyMileageLimit: Number(data.dailyMileageLimit),
        vehicleOfferType: data.vehicleOfferType,
        vehicleId: data.vehicleId,
        ownerId: data.ownerId,
        conditions: data.conditions,
        available: "AVAILABLE",
      };

      const res = await createVehicleOffer(payload);
      toast.success("Viaje creado con éxito", { id: toastId });
      onSuccess((prev) => [...prev, res]);
      onClose();
    } catch {
      toast.info("Error al crear el viaje", { id: toastId });
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const pricePerDay = watch("pricePerDay");

  useEffect(() => {
    const price = parseFloat(pricePerDay?.replace(",", "."));
    if (!isNaN(price)) {
      const fee = (price * 0.22).toFixed(2);
      setValue("agencyFee", fee);
    } else {
      setValue("agencyFee", "");
    }
  }, [pricePerDay, setValue]);

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl p-8 my-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative border border-custom-gray-300">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Cerrar">
          <X className="size-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-custom-golden-700">
          Crear oferta de vehículo
        </h2>
        <p className="text-sm text-custom-gray-500 mb-6">
          Completa los datos para publicar una nueva oferta de alquiler de
          vehículo.
        </p>

        <form
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800">
          <div className="col-span-full">
            <h3 className="text-base font-semibold text-custom-golden-600 mb-1">
              Datos de la oferta
            </h3>
            <hr className="mb-4" />
          </div>

          <div>
            <label className={labelClass}>Vehículo</label>
            <select
              {...register("vehicleId", { required: true })}
              className={inputClass}>
              <option value="">Selecciona un vehículo</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) - {v.plate}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="text-red-500 text-xs">Campo obligatorio</p>
            )}
          </div>

          {/* Solo mostrar campo propietario para vehículos que NO son de Viaje Seguro */}
          {selectedVehicle?.provider !== "VS" && (
            <div>
              <label className={labelClass}>Propietario</label>
              <input
                type="text"
                readOnly
                value={
                  matchedOwner
                    ? `${matchedOwner.name} ${matchedOwner.lastName} - ${matchedOwner.email}`
                    : ""
                }
                className={inputClass}
              />
              <input type="hidden" {...register("ownerId", { required: true })} />
            </div>
          )}

          {/* Mostrar información para vehículos de Viaje Seguro */}
          {selectedVehicle?.provider === "VS" && (
            <div>
              <label className={labelClass}>Propietario</label>
              <div className="w-full border border-custom-gray-300 rounded-md px-4 py-2 bg-custom-gray-50 text-custom-gray-600 text-sm">
                Viaje Seguro (asignado automáticamente)
              </div>
              <input type="hidden" {...register("ownerId", { required: false })} />
            </div>
          )}

          <div>
            <label className={labelClass}>Precio por día (€)</label>
            <input
              type="text"
              inputMode="decimal"
              {...register("pricePerDay", {
                required: true,
                validate: (value) =>
                  /^[0-9]*[.,]?[0-9]{0,2}$/.test(value) ||
                  "Formato inválido (usa solo números)",
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
            {errors.pricePerDay && (
              <p className="text-red-500 text-xs">
                {errors.pricePerDay.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Tarifa de agencia (€)</label>
            <input
              type="text"
              disabled
              {...register("agencyFee", { required: true })}
              className={`${inputClass} bg-custom-gray-100 cursor-not-allowed`}
              readOnly
            />
            {errors.agencyFee && (
              <p className="text-red-500 text-xs">
                {errors.agencyFee.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Fianza (€)</label>
            <input
              type="text"
              inputMode="decimal"
              {...register("depositAmount", {
                required: "La fianza es obligatoria",
                validate: (value) =>
                  /^[0-9]*[.,]?[0-9]{0,2}$/.test(value) ||
                  "Formato inválido (usa solo números)",
              })}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value
                  .replace(",", ".")
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
              }}
              className={inputClass}
              placeholder="Ej: 300.00"
            />
            {errors.depositAmount && (
              <p className="text-red-500 text-xs">
                {errors.depositAmount.message || "Campo obligatorio"}
              </p>
            )}
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
              defaultValue="200"
            />
            <p className="text-xs text-custom-gray-500 mt-1">
              Límite diario incluido en el precio.
            </p>
            {errors.dailyMileageLimit && (
              <p className="text-red-500 text-xs">
                {errors.dailyMileageLimit.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Tipo de oferta</label>
            <select
              {...register("vehicleOfferType", { required: true })}
              className={inputClass}>
              <option value="">Selecciona una opción</option>
              <option value="WITH_DRIVER">Con conductor</option>
              <option value="WITHOUT_DRIVER">Sin conductor</option>
            </select>
            {errors.vehicleOfferType && (
              <p className="text-red-500 text-xs">Campo obligatorio</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Disponible desde</label>
            <input
              type="date"
              {...register("availableFrom", { required: true })}
              className={inputClass}
              min={"2020-01-01"}
              max={"2099-12-31"}
            />
            {errors.availableFrom && (
              <p className="text-red-500 text-xs">Campo obligatorio</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Disponible hasta</label>
            <input
              type="date"
              {...register("availableTo", { required: true })}
              className={inputClass}
              min={"2020-01-01"}
              max={"2099-12-31"}
            />
            {errors.availableTo && (
              <p className="text-red-500 text-xs">Campo obligatorio</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Ubicación de retiro</label>
            <input
              type="text"
              {...register("withdrawLocation", { required: true })}
              className={inputClass}
            />
            {errors.withdrawLocation && (
              <p className="text-red-500 text-xs">Campo obligatorio</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Ubicación de devolución</label>
            <input
              type="text"
              {...register("returnLocation", { required: true })}
              className={inputClass}
            />
            {errors.returnLocation && (
              <p className="text-red-500 text-xs">Campo obligatorio</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Condiciones (opcional)</label>
            <textarea
              {...register("conditions")}
              className={inputClass}
              rows={3}
            />
          </div>

          <div className="col-span-full flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-5 rounded-md">
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-5 rounded-md">
              Crear oferta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVehicleOfferModal;
