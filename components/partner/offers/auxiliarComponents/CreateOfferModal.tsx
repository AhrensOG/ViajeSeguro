"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";
import { CreateVehicleOfferRequest } from "@/lib/api/admin/vehicle-offers/vehicleOffers.types";
import { createVehicleOffer } from "@/lib/api/admin/vehicle-offers";
import { useSession } from "next-auth/react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  userVehicles: Vehicle[];
}

type FormData = {
  vehicleId: string;
  pricePerDay: string;
  agencyFee: string;
  vehicleOfferType: "WITH_DRIVER" | "WITHOUT_DRIVER";
  availableFrom: string;
  availableTo: string;
  withdrawLocation: string;
  returnLocation: string;
  conditions?: string;
};

const inputClass =
  "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";
const labelClass =
  "block text-xs font-semibold text-custom-gray-500 mb-1 uppercase tracking-wide";

const CreateOfferModal = ({ onClose, onSuccess, userVehicles }: Props) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const pricePerDay = watch("pricePerDay");

  // Calcular tarifa de agencia automáticamente (15% del precio por día)
  useEffect(() => {
    const price = parseFloat(pricePerDay?.replace(",", "."));
    if (!isNaN(price)) {
      const fee = (price * 0.15).toFixed(2);
      setValue("agencyFee", fee);
    } else {
      setValue("agencyFee", "");
    }
  }, [pricePerDay, setValue]);

  const submit: SubmitHandler<FormData> = async (data) => {
    if (!session?.user?.id) {
      toast.error("Error de autenticación");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creando oferta de vehículo...");
    
    try {
      const payload: CreateVehicleOfferRequest = {
        pricePerDay: Number(data.pricePerDay),
        withdrawLocation: data.withdrawLocation,
        returnLocation: data.returnLocation,
        originalTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        availableFrom: new Date(data.availableFrom),
        availableTo: new Date(data.availableTo),
        agencyFee: Number(data.agencyFee),
        vehicleOfferType: data.vehicleOfferType,
        vehicleId: data.vehicleId,
        ownerId: session.user.id, // El propietario es siempre el usuario autenticado
        conditions: data.conditions,
        available: "AVAILABLE",
      };

      await createVehicleOffer(payload);
      toast.success("Oferta creada con éxito", { id: toastId });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Error al crear la oferta", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar modal con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Filtrar solo vehículos aprobados
  const approvedVehicles = userVehicles.filter(
    (vehicle) => vehicle.approvalStatus === "APPROVED"
  );

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl p-8 my-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative border border-custom-gray-300"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-custom-gray-400 hover:text-custom-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-custom-golden-700">
          Crear oferta de alquiler
        </h2>
        <p className="text-sm text-custom-gray-500 mb-6">
          Completa los datos para publicar una nueva oferta de alquiler de tu vehículo.
        </p>

        <form
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800"
        >
          <div className="col-span-full">
            <h3 className="text-base font-semibold text-custom-golden-600 mb-1">
              Datos de la oferta
            </h3>
            <hr className="mb-4" />
          </div>

          <div>
            <label className={labelClass}>Vehículo</label>
            <select
              {...register("vehicleId", { required: "Selecciona un vehículo" })}
              className={inputClass}
              disabled={isLoading}
            >
              <option value="">Selecciona un vehículo</option>
              {approvedVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.plate}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="text-red-500 text-xs">
                {errors.vehicleId.message || "Campo obligatorio"}
              </p>
            )}
            {approvedVehicles.length === 0 && (
              <p className="text-amber-600 text-xs mt-1">
                No tienes vehículos aprobados disponibles para crear ofertas.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Precio por día (€)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              {...register("pricePerDay", {
                required: "El precio es obligatorio",
                min: { value: 1, message: "El precio debe ser mayor a 0" },
              })}
              className={inputClass}
              placeholder="50.00"
              disabled={isLoading}
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
            <p className="text-xs text-custom-gray-500 mt-1">
              Se calcula automáticamente (15% del precio por día)
            </p>
            {errors.agencyFee && (
              <p className="text-red-500 text-xs">
                {errors.agencyFee.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Tipo de oferta</label>
            <select
              {...register("vehicleOfferType", { required: "Selecciona el tipo de oferta" })}
              className={inputClass}
              disabled={isLoading}
            >
              <option value="">Selecciona una opción</option>
              <option value="WITH_DRIVER">Con conductor</option>
              <option value="WITHOUT_DRIVER">Sin conductor</option>
            </select>
            {errors.vehicleOfferType && (
              <p className="text-red-500 text-xs">
                {errors.vehicleOfferType.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Disponible desde</label>
            <input
              type="date"
              {...register("availableFrom", { required: "Selecciona la fecha de inicio" })}
              className={inputClass}
              min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
              max="2099-12-31"
              disabled={isLoading}
            />
            {errors.availableFrom && (
              <p className="text-red-500 text-xs">
                {errors.availableFrom.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Disponible hasta</label>
            <input
              type="date"
              {...register("availableTo", { required: "Selecciona la fecha de fin" })}
              className={inputClass}
              min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
              max="2099-12-31"
              disabled={isLoading}
            />
            {errors.availableTo && (
              <p className="text-red-500 text-xs">
                {errors.availableTo.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Ubicación de retiro</label>
            <input
              type="text"
              {...register("withdrawLocation", { required: "La ubicación de retiro es obligatoria" })}
              className={inputClass}
              placeholder="Ej: Aeropuerto de Madrid"
              disabled={isLoading}
            />
            {errors.withdrawLocation && (
              <p className="text-red-500 text-xs">
                {errors.withdrawLocation.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Ubicación de devolución</label>
            <input
              type="text"
              {...register("returnLocation", { required: "La ubicación de devolución es obligatoria" })}
              className={inputClass}
              placeholder="Ej: Aeropuerto de Madrid"
              disabled={isLoading}
            />
            {errors.returnLocation && (
              <p className="text-red-500 text-xs">
                {errors.returnLocation.message || "Campo obligatorio"}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Condiciones (opcional)</label>
            <textarea
              {...register("conditions")}
              className={inputClass}
              rows={3}
              placeholder="Ej: No fumar, combustible lleno al devolver, etc."
              disabled={isLoading}
            />
          </div>

          <div className="col-span-full flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-5 rounded-md"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || approvedVehicles.length === 0}
            >
              {isLoading ? "Creando..." : "Crear oferta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOfferModal;
