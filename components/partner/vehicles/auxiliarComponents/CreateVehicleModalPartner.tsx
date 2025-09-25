"use client";

// Importaciones de React y hooks
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Para manejo de formularios
import { X, Info } from "lucide-react"; // Iconos
import { toast } from "sonner"; // Para notificaciones/toasts
import { useSession } from "next-auth/react"; // Para obtener datos del usuario logueado

// Importaciones de tipos y APIs
import { CreateVehicleDto, Vehicle, FeatureEnum, Provider } from "@/lib/api/admin/vehicles/vehicles.type";
import { createVehicle } from "@/lib/api/admin/vehicles";
import { uploadFiles } from "@/lib/firebase/uploadFiles";

/**
 * PROPS DEL COMPONENTE
 * @param onClose - Función para cerrar el modal
 * @param onSuccess - Función para actualizar la lista de vehículos (no se usa en versión visual)
 */
interface Props {
  onClose: () => void;
  onSuccess: Dispatch<SetStateAction<Vehicle[]>>;
}

// ESTILOS REUTILIZABLES PARA EL FORMULARIO
const inputClass =
  "w-full border border-custom-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-golden-400 shadow-sm transition";
const labelClass =
  "block text-[0.75rem] font-semibold text-custom-gray-600 mb-1 uppercase tracking-wide";

/**
 * CARACTERÍSTICAS DISPONIBLES PARA LOS VEHÍCULOS
 * Array que define las características que puede tener un vehículo
 * Usa strings literales igual que CreateVehicleModal
 */
const FEATURES: { value: string; label: string }[] = [
  { value: "GPS", label: "GPS" }, 
  { value: "AIR_CONDITIONING", label: "Aire acondicionado" },
  { value: "BLUETOOTH", label: "Bluetooth" },
  { value: "REAR_CAMERA", label: "Cámara trasera" },
];

/**
 * COMPONENTE PRINCIPAL DEL MODAL
 */
const CreateVehicleModalPartner = ({ onClose, onSuccess }: Props) => {
  // ESTADO DEL COMPONENTE
  const { data: session } = useSession(); // Obtiene datos del usuario logueado
  const [imageFiles, setImageFiles] = useState<FileList | null>(null); // Almacena archivos de imagen seleccionados

  // CONFIGURACIÓN DEL FORMULARIO CON REACT-HOOK-FORM
  const {
    register, // Función para registrar campos del formulario
    handleSubmit, // Función para manejar el envío del formulario
    formState: { errors }, // Objeto con errores de validación
  } = useForm<CreateVehicleDto>();

  /**
   * FUNCIÓN DE ENVÍO DEL FORMULARIO - CONECTADA AL BACKEND
   * Igual lógica que CreateVehicleModal pero con provider fijo como "PARTNER"
   * 
   * @param data - Datos del formulario tipados con CreateVehicleDto
   */
  const submit = async (data: CreateVehicleDto) => {
    const toastId = toast.loading("Registrando vehículo...");
    
    try {
      // Upload de imágenes (opcional, igual que CreateVehicleModal)
      let uploadedUrls: string[] = [];
      if (imageFiles && imageFiles?.length > 0) {
        const filesArray = Array.from(imageFiles);
        uploadedUrls = await uploadFiles(filesArray, "Vehiculos");
      }

      // Obtener ID del usuario de la sesión
      const ownerIdFromSession = session?.user?.id || session?.user?.email;

      if (!ownerIdFromSession) {
        toast.error("No se pudo identificar al usuario. Inicia sesión nuevamente.", { id: toastId });
        return;
      }

      // Crear vehículo igual que CreateVehicleModal pero con datos fijos
      const vehicle = await createVehicle({
        ...data,
        year: Number(data.year),
        capacity: Number(data.capacity),
        features: ([] as string[]).concat(data.features || []).map((f) => f as FeatureEnum),
        images: uploadedUrls,
        provider: Provider.PRIVATE, // Usar enum válido en lugar de any
        ownerId: ownerIdFromSession,
        allowSeatSelection: false, // Por defecto false para partners
      });

      onSuccess((prev) => [...prev, vehicle]);
      onClose();
      toast.success("Vehículo creado exitosamente", { id: toastId });
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear el vehículo", { id: toastId });
    }
  };

  /**
   * EFECTO PARA CERRAR MODAL CON TECLA ESCAPE
   * Permite cerrar el modal presionando la tecla Escape
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // RENDERIZADO DEL COMPONENTE
  return (
    // BACKDROP DEL MODAL - Fondo oscuro con blur que cubre toda la pantalla
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose} // Cerrar modal al hacer click en el backdrop
    >
      {/* CONTENEDOR PRINCIPAL DEL MODAL */}
      <div
        onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer click dentro del modal
        className="bg-white rounded-2xl shadow-xl ring-1 ring-custom-gray-200 p-8 my-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative"
      >
        {/* BOTÓN DE CERRAR (X) EN LA ESQUINA SUPERIOR DERECHA */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Cerrar"
        >
          <X className="size-5" />
        </button>

        {/* ENCABEZADO DEL MODAL */}
        <h2 className="text-2xl font-bold mb-1 text-custom-golden-700 tracking-tight">
          Registrar vehículo (particular)
        </h2>
        <p className="text-sm text-custom-gray-500 mb-4 leading-relaxed">
          Completa los datos de tu coche. <strong>Usa información real y verificable.</strong> Una vez enviado, nuestro equipo revisará tu solicitud. Al ser aprobada, podrás publicarlo para alquiler.
        </p>

        {/* AVISO INFORMATIVO SOBRE EL PROCESO DE REVISIÓN */}
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-800 text-sm">
          <Info className="size-4 mt-0.5" />
          <p>
            Este registro se enviará a <strong>revisión</strong>. Tras la aprobación de administración, podrás activarlo para que aparezca en la plataforma.
          </p>
        </div>

        {/* FORMULARIO PRINCIPAL */}
        <form
          onSubmit={handleSubmit(submit)} // Maneja el envío con react-hook-form
          className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800"
        >
          {/* SECCIÓN: DATOS DEL VEHÍCULO */}
          <div className="col-span-full">
            <h3 className="text-base font-semibold text-custom-golden-600 mb-1">
              Datos del vehículo
            </h3>
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
              <option value="ELECTRIC">Eléctrico</option>
              <option value="HYBRID">Híbrido</option>
            </select>
            {errors.fuelType && <p className="text-red-500 text-xs">Campo obligatorio</p>}
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
              Sube al menos una imagen clara del vehículo (máx. 10).
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
              className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2.5 px-6 rounded-md transition shadow"
            >
              Enviar a revisión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVehicleModalPartner;
