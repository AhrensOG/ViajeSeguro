"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/constants";

interface FormData {
    password: string;
    confirmPassword: string;
}

const ResetPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const toastId = toast.loading("Actualizando contraseña...");
        try {
            const response = await fetch(BACKEND_URL + "/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            });

            if (response.ok) {
                toast.success("Contraseña actualizada con éxito.", {
                    id: toastId,
                });
                router.push("/auth/login");
            } else if (response.status === 401) {
                return toast.warning("El token es incorrecto o ha expirado.", {
                    description:
                        "Solicita un nuevo restablecimiento de contraseña.",
                    id: toastId,
                });
            } else {
                return toast.warning("Ups! Ocurrió un error inesperado.", {
                    description:
                        "Intenta nuevamente o contacta con nuestro soporte.",
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error("Ups! Ocurrió un error inesperado.", { id: toastId });
            console.error(error);
        }
    };

    return (
        <div className="mx-auto mt-10 bg-white">
            <h2 className="text-2xl font-semibold text-center text-custom-gray-800 mb-4">
                Restablecer Contraseña
            </h2>
            <p className="text-sm text-center text-custom-gray-600 mb-6">
                Ingresa tu nueva contraseña. Asegúrate de recordarla.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-custom-gray-800 mb-1"
                    >
                        Nueva Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-custom-gray-500" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "La nueva contraseña es obligatoria",
                                minLength: {
                                    value: 6,
                                    message: "Mínimo 6 caracteres",
                                },
                            })}
                            className={`block w-full pl-10 pr-10 py-2 border ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-custom-gray-300"
                            } rounded-md shadow-sm outline-none focus:ring-custom-golden-600 focus:border-custom-golden-600`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-custom-gray-500" />
                            ) : (
                                <Eye className="h-5 w-5 text-custom-gray-500" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-custom-gray-800 mb-1"
                    >
                        Confirmar Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-custom-gray-500" />
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Confirma tu contraseña",
                                validate: (value) =>
                                    value === watch("password") ||
                                    "Las contraseñas no coinciden",
                            })}
                            className={`block w-full pl-10 pr-10 py-2 border ${
                                errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-custom-gray-300"
                            } rounded-md shadow-sm outline-none focus:ring-custom-golden-600 focus:border-custom-golden-600`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-custom-gray-500" />
                            ) : (
                                <Eye className="h-5 w-5 text-custom-gray-500" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-custom-golden-600 hover:bg-custom-golden-700 duration-300"
                    >
                        Restablecer Contraseña
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
