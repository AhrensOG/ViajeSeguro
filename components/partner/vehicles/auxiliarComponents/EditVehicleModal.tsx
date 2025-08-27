"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { X, AlertTriangle, Info } from "lucide-react";
import { Vehicle, VehicleApprovalStatus, CreateVehicleDto, FeatureEnum } from "@/lib/api/admin/vehicles/vehicles.type";
import { updateUserVehicle } from "@/lib/api/partner/vehicles";
import { uploadFiles } from "@/lib/firebase/uploadFiles";

interface EditVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedVehicle: Vehicle) => void;
}

// ESTILOS REUTILIZABLES PARA EL FORMULARIO (iguales al modal de creación)
const inputClass =
  "w-full border border-custom-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-golden-400 shadow-sm transition";
const labelClass =
  "block text-[0.75rem] font-semibold text-custom-gray-600 mb-1 uppercase tracking-wide";

// CARACTERÍSTICAS DISPONIBLES (iguales al modal de creación)
const FEATURES: { value: string; label: string }[] = [
  { value: "GPS", label: "GPS" }, 
  { value: "AIR_CONDITIONING", label: "Aire acondicionado" },
  { value: "BLUETOOTH", label: "Bluetooth" },
  { value: "REAR_CAMERA", label: "Cámara trasera" },
];

export default function EditVehicleModal({ vehicle, isOpen, onClose, onSuccess }: EditVehicleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVehicleDto>();

  // Reset form when vehicle changes
  useEffect(() => {
    if (vehicle && isOpen) {
      reset({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        transmissionType: vehicle.transmissionType,
        fuelType: vehicle.fuelType,
        capacity: vehicle.capacity,
        serviceType: vehicle.serviceType,
        features: vehicle.features as FeatureEnum[],
      });
    }
  }, [vehicle, isOpen, reset]);

  const onSubmit = async (data: CreateVehicleDto) => {
    if (!vehicle) return;

    setIsLoading(true);
    const toastId = toast.loading("Actualizando vehículo...");
    
    try {
      // Upload de imágenes si se seleccionaron nuevas
      let uploadedUrls: string[] = [];
      if (imageFiles && imageFiles?.length > 0) {
        const filesArray = Array.from(imageFiles);
        uploadedUrls = await uploadFiles(filesArray, "Vehiculos");
      }

      // Combinar imágenes existentes con las nuevas (igual que en admin)
      const existingUrls = vehicle.images || [];
      const imagesChanged = uploadedUrls.length > 0;

      const updateData: CreateVehicleDto = {
        ...data,
        year: Number(data.year),
        capacity: Number(data.capacity),
        features: data.features?.map((f) => f as FeatureEnum),
        images: imagesChanged ? [...existingUrls, ...uploadedUrls] : vehicle.images,
        // Mantener campos requeridos del vehículo original
        provider: vehicle.provider,
        ownerId: vehicle.ownerId,
        allowSeatSelection: vehicle.allowSeatSelection,
      };

      const updatedVehicle = await updateUserVehicle(vehicle.id, updateData);
      
      // Crear objeto actualizado completo (igual que en admin)
      const completeUpdatedVehicle = {
        ...vehicle, // Mantener todos los datos originales
        ...updateData, // Aplicar cambios del formulario
        ...updatedVehicle, // Aplicar respuesta de la API
        approvalStatus: VehicleApprovalStatus.PENDING, // Forzar estado PENDING
        rejectionReason: "", // Limpiar razón de rechazo
      };
      
      toast.success("Vehículo actualizado exitosamente. Será revisado nuevamente por el administrador.", { id: toastId });
      onSuccess(completeUpdatedVehicle);
      onClose();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Error al actualizar el vehículo", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Editar Vehículo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Important Notice */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Importante</h3>
              <p className="text-sm text-amber-700 mt-1">
                Al editar tu vehículo, el estado cambiará a "Pendiente" y deberá ser revisado nuevamente por el administrador antes de estar disponible.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className={labelClass}>Marca</label>
              <input
                type="text"
                {...register("brand", { required: true })}
                className={inputClass}
              />
              {errors.brand && <p className="text-red-500 text-xs">Campo obligatorio</p>}
            </div>

            <div>
              <label className={labelClass}>Modelo</label>
              <input
                type="text"
                {...register("model", { required: true })}
                className={inputClass}
              />
              {errors.model && <p className="text-red-500 text-xs">Campo obligatorio</p>}
            </div>

            <div>
              <label className={labelClass}>Año</label>
              <input
                type="text"
                inputMode="numeric"
                {...register("year", {
                  required: true,
                  validate: (value) =>
                    /^[0-9]+$/.test(String(value)) || "Solo se permiten números enteros positivos",
                })}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^0-9]/g, "");
                }}
                className={inputClass}
              />
              {errors.year && (
                <p className="text-red-500 text-xs">
                  {errors.year.message || "Campo obligatorio"}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Capacidad</label>
              <input
                type="text"
                inputMode="numeric"
                {...register("capacity", {
                  required: true,
                  validate: (value) =>
                    /^[0-9]+$/.test(String(value)) || "Solo se permiten números enteros positivos",
                })}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^0-9]/g, "");
                }}
                className={inputClass}
              />
              {errors.capacity && (
                <p className="text-red-500 text-xs">
                  {errors.capacity.message || "Campo obligatorio"}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Matrícula</label>
              <input type="text" {...register("plate", { required: true })} className={inputClass} />
              {errors.plate && <p className="text-red-500 text-xs">Campo obligatorio</p>}
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
                <option value="DIESEL">Diésel</option>
                <option value="HYBRID">Híbrido</option>
                <option value="ELECTRIC">Eléctrico</option>
              </select>
              {errors.fuelType && <p className="text-red-500 text-xs">Campo obligatorio</p>}
            </div>

            {/* provider y owner NO se muestran; se fijan en el submit */}

            <div>
              <label className={labelClass}>Tipo de servicio</label>
              <select {...register("serviceType", { required: true })} className={inputClass}>
                <option value="">Selecciona una opción</option>
                <option value="RENTAL_WITH_DRIVER">Viaje con conductor</option>
                <option value="RENTAL_WITHOUT_DRIVER">Viaje sin conductor</option>
              </select>
              {errors.serviceType && <p className="text-red-500 text-xs">Campo obligatorio</p>}
            </div>

            <div className="col-span-full">
              <label className={labelClass}>Características</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FEATURES.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 bg-custom-gray-100 px-3 py-2 rounded-md shadow-inner text-sm"
                  >
                    <input
                      type="checkbox"
                      value={value}
                      {...register("features")}
                      className="accent-custom-golden-600"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-full">
              <label className={labelClass}>Imágenes</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="block w-full text-sm text-custom-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-custom-golden-600 file:text-white hover:file:bg-custom-golden-700"
                onChange={(e) => setImageFiles(e.target.files)}
              />
              <p className="text-xs text-custom-gray-500 mt-1">
                Sube nuevas imágenes del vehículo (máx. 10). Las imágenes actuales se mantendrán.
              </p>
            </div>

            <div className="col-span-full flex justify-end gap-3 mt-10">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2.5 px-6 rounded-md transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2.5 px-6 rounded-md transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Actualizando..." : "Actualizar vehículo"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
