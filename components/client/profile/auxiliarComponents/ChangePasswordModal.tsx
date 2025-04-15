import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        email: string;
        name: string;
        lastName: string;
    };
}

const ChangePasswordModal = ({ isOpen, onClose, user }: ChangePasswordModalProps) => {
    const defaultValues: ChangePasswordFormValues = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ChangePasswordFormValues>({ defaultValues });

    const newPassword = watch("newPassword");
    const currentPassword = watch("currentPassword");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const toggleShow = (field: "current" | "new" | "confirm") => {
        if (field === "current") setShowCurrent((prev) => !prev);
        if (field === "new") setShowNew((prev) => !prev);
        if (field === "confirm") setShowConfirm((prev) => !prev);
    };

    const onSubmit = async (values: ChangePasswordFormValues) => {
        return toast.promise(changePassword(values), {
            loading: "Cambiando contraseña...",
            success: () => {
                reset();
                onClose();
                return "Contraseña cambiada exitosamente";
            },
            error: (err) => {
                return "Error al cambiar la contraseña";
            },
        });
    };

    const changePassword = async (values: ChangePasswordFormValues): Promise<void> => {
        try {
            const res = await fetchWithAuth(`${BACKEND_URL}/user/change-password`, {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                }),
                headers: { "Content-Type": "application/json" },
            });
            console.log("Respuesta del servidor:", res);
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
        }
    };

    return (
        <div
            id="default-modal"
            tabIndex={-1}
            aria-hidden={isOpen ? "false" : "true"}
            className={`${isOpen ? "" : "hidden"} fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center`}
        >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30" onClick={onClose} />

            <div className="relative bg-white rounded-lg shadow-sm max-w-md w-full p-4 md:p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                    <h3 className="text-xl font-semibold text-gray-900">Cambiar Contraseña</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 md:p-5 space-y-4">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        {/* Contraseña actual */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                Contraseña Actual:
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    id="currentPassword"
                                    placeholder="Ingresa tu contraseña actual"
                                    className="mt-1 block w-full p-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    {...register("currentPassword", { required: "La contraseña actual es obligatoria" })}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("current")}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.currentPassword && <div className="text-sm text-orange-600 mt-1">{errors.currentPassword.message}</div>}
                        </div>

                        {/* Nueva contraseña */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                Nueva Contraseña:
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    id="newPassword"
                                    placeholder="Ingresa tu nueva contraseña"
                                    className="mt-1 block w-full p-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    {...register("newPassword", {
                                        required: "La nueva contraseña es obligatoria",
                                        validate: (value) => {
                                            if (value === currentPassword) return "La nueva contraseña debe ser diferente a la actual";
                                            return true;
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("new")}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && <div className="text-sm text-orange-600 mt-1">{errors.newPassword.message}</div>}
                        </div>

                        {/* Confirmar contraseña */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Contraseña:
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirma tu nueva contraseña"
                                    className="mt-1 block w-full p-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    {...register("confirmPassword", {
                                        required: "La confirmación de contraseña es obligatoria",
                                        validate: (value) => value === newPassword || "Las contraseñas no coinciden",
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("confirm")}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <div className="text-sm text-orange-600 mt-1">{errors.confirmPassword.message}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md shadow-sm transition duration-200 ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            Cambiar Contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
