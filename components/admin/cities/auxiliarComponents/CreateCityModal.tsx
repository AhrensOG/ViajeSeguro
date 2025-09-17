import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createCity } from "@/lib/api/admin/cities";

interface Props {
    onClose: () => void;
    onSuccess: (newCity: any) => void;
}

interface CreateCityForm {
    name: string;
    state: string;
    country: string;
    isActive: boolean;
}

const inputClass =
    "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";
const labelClass = "block text-xs font-semibold text-custom-gray-500 mb-1 uppercase tracking-wide";

const CreateCityModal = ({ onClose, onSuccess }: Props) => {
    const [form, setForm] = useState<CreateCityForm>({
        name: "",
        state: "",
        country: "",
        isActive: true,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        
        let parsedValue: string | boolean = value;
        
        if (type === "checkbox") {
            parsedValue = (e.target as HTMLInputElement).checked;
        }

        setForm((prev) => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones
        if (!form.name.trim()) {
            toast.error("El nombre de la ciudad es requerido");
            return;
        }
        
        if (!form.state.trim()) {
            toast.error("El estado/región es requerido");
            return;
        }

        if (!form.country.trim()) {
            toast.error("El país es requerido");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Creando ciudad...");

        try {
            const response = await createCity(form);
            onSuccess(response);
            toast.success("Ciudad creada exitosamente", { id: toastId });
            onClose();
        } catch (error) {
            toast.error("Error al crear la ciudad", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 border border-custom-gray-300"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-custom-gray-200">
                    <h2 className="text-xl font-bold text-custom-black-800">Agregar Nueva Ciudad</h2>
                    <button
                        onClick={onClose}
                        className="text-custom-gray-400 hover:text-custom-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre de la Ciudad */}
                    <div>
                        <label htmlFor="name" className={labelClass}>
                            Nombre de la Ciudad *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Ej: Madrid, Barcelona, Valencia..."
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Estado/Región */}
                    <div>
                        <label htmlFor="state" className={labelClass}>
                            Estado/Región *
                        </label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Ej: Comunidad de Madrid, Cataluña..."
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* País */}
                    <div>
                        <label htmlFor="country" className={labelClass}>
                            País *
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Ej: España, Francia, Portugal..."
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Estado Activo */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 text-custom-golden-600 focus:ring-custom-golden-400 border-custom-gray-300 rounded"
                            disabled={loading}
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-custom-black-700">
                            Ciudad activa
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-custom-gray-600 bg-custom-gray-100 hover:bg-custom-gray-200 rounded-md transition-colors font-medium"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Creando..." : "Crear Ciudad"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCityModal;
