"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Info } from "lucide-react";
import { toast } from "sonner";
import { Vehicle, FeatureEnum, VehicleApprovalStatus, CreateVehicleDto } from "@/lib/api/admin/vehicles/vehicles.type";
import { updateUserVehicle } from "@/lib/api/partner/vehicles";

interface EditVehicleModalUserProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedVehicle: Vehicle) => void;
}

// ESTILOS REUTILIZABLES PARA EL FORMULARIO
const inputClass =
  "w-full border border-custom-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-golden-400 shadow-sm transition";
const labelClass =
  "block text-[0.75rem] font-semibold text-custom-gray-600 mb-1 uppercase tracking-wide";

const FEATURES: { value: FeatureEnum; label: string }[] = [
  { value: FeatureEnum.GPS, label: "GPS" },
  { value: FeatureEnum.AIR_CONDITIONING, label: "Aire acondicionado" },
  { value: FeatureEnum.BLUETOOTH, label: "Bluetooth" },
  { value: FeatureEnum.REAR_CAMERA, label: "Cámara trasera" },
];

export function EditVehicleModalUser({ vehicle, isOpen, onClose, onSuccess }: EditVehicleModalUserProps) {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateVehicleDto>();

  const watchedFeatures = watch("features") || [];

  useEffect(() => {
    if (vehicle && isOpen) {
      console.log("[EditVehicleModalUser] Modal opened with vehicle:", vehicle);
      
      // Resetear y llenar el formulario con datos del vehículo
      reset();
      setValue("plate", vehicle.plate);
      setValue("capacity", vehicle.capacity);
      setValue("serviceType", vehicle.serviceType);
      setValue("provider", vehicle.provider);
      setValue("allowSeatSelection", vehicle.allowSeatSelection);
      setValue("model", vehicle.model);
      setValue("brand", vehicle.brand);
      setValue("year", vehicle.year);
      setValue("fuelType", vehicle.fuelType);
      setValue("transmissionType", vehicle.transmissionType);
      setValue("features", vehicle.features as FeatureEnum[]);
      setValue("images", vehicle.images);
    }
  }, [vehicle, isOpen, reset, setValue]);

  if (!isOpen || !vehicle) return null;

  const handleFeatureChange = (feature: FeatureEnum, checked: boolean) => {
    const currentFeatures = watchedFeatures;
    const newFeatures = checked
      ? [...currentFeatures, feature]
      : currentFeatures.filter((f: FeatureEnum) => f !== feature);
    
    setValue("features", newFeatures);
  };

  const onSubmit = async (data: CreateVehicleDto) => {
    setLoading(true);
    try {
      // Preparar datos para envío - cambiar estado a PENDIENTE cuando se edita
      const updateData = {
        ...data,
        approvalStatus: VehicleApprovalStatus.PENDING, // Cambiar a PENDIENTE tras editar
        rejectionReason: null // Limpiar razón de rechazo
      };

      console.log("[EditVehicleModalUser] Saving vehicle with data:", updateData);
      
      const updatedVehicle = await updateUserVehicle(vehicle.id, updateData);
      
      toast.success("Vehículo actualizado correctamente. Será revisado nuevamente por administración.");
      onSuccess(updatedVehicle);
      onClose();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Error al actualizar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-custom-golden-600">
            Editar Vehículo
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Marca</label>
              <input
                {...register("brand", { required: "La marca es requerida" })}
                className={inputClass}
                placeholder="Toyota, Honda, etc."
              />
              {errors.brand && (
                <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Modelo</label>
              <input
                {...register("model", { required: "El modelo es requerido" })}
                className={inputClass}
                placeholder="Corolla, Civic, etc."
              />
              {errors.model && (
                <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Año</label>
              <input
                type="number"
                {...register("year", { 
                  required: "El año es requerido",
                  min: { value: 1990, message: "Año mínimo: 1990" },
                  max: { value: new Date().getFullYear() + 1, message: "Año inválido" }
                })}
                className={inputClass}
                placeholder="2020"
              />
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Matrícula</label>
              <input
                {...register("plate", { required: "La matrícula es requerida" })}
                className={inputClass}
                placeholder="ABC-1234"
              />
              {errors.plate && (
                <p className="text-red-500 text-xs mt-1">{errors.plate.message}</p>
              )}
            </div>
          </div>

          {/* Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Transmisión</label>
              <select
                {...register("transmissionType", { required: "La transmisión es requerida" })}
                className={inputClass}
              >
                <option value="">Seleccionar...</option>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automática</option>
              </select>
              {errors.transmissionType && (
                <p className="text-red-500 text-xs mt-1">{errors.transmissionType.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Combustible</label>
              <select
                {...register("fuelType", { required: "El tipo de combustible es requerido" })}
                className={inputClass}
              >
                <option value="">Seleccionar...</option>
                <option value="GASOLINE">Gasolina</option>
                <option value="DIESEL">Diésel</option>
                <option value="HYBRID">Híbrido</option>
                <option value="ELECTRIC">Eléctrico</option>
              </select>
              {errors.fuelType && (
                <p className="text-red-500 text-xs mt-1">{errors.fuelType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Capacidad</label>
              <input
                type="number"
                {...register("capacity", { 
                  required: "La capacidad es requerida",
                  min: { value: 1, message: "Mínimo 1 pasajero" },
                  max: { value: 50, message: "Máximo 50 pasajeros" }
                })}
                className={inputClass}
                placeholder="5"
              />
              {errors.capacity && (
                <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Tipo de Servicio</label>
              <select
                {...register("serviceType", { required: "El tipo de servicio es requerido" })}
                className={inputClass}
              >
                <option value="">Seleccionar...</option>
                <option value="0">Viaje simple</option>
                <option value="1">Con chofer</option>
                <option value="2">Sin chofer</option>
              </select>
              {errors.serviceType && (
                <p className="text-red-500 text-xs mt-1">{errors.serviceType.message}</p>
              )}
            </div>
          </div>

          {/* Características */}
          <div>
            <label className={labelClass}>Características</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {FEATURES.map((feature) => (
                <div key={feature.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={feature.value}
                    checked={watchedFeatures.includes(feature.value)}
                    onChange={(e) => handleFeatureChange(feature.value, e.target.checked)}
                    className="w-4 h-4 text-custom-golden-600 border-gray-300 rounded focus:ring-custom-golden-500"
                  />
                  <label htmlFor={feature.value} className="text-sm text-gray-700">
                    {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Aviso importante */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Importante:</strong> Al editar tu vehículo, este pasará nuevamente a estado "Pendiente" 
                y deberá ser revisado por administración antes de ser aprobado.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
