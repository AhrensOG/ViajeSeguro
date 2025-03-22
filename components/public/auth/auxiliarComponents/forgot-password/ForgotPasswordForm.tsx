import { BACKEND_URL } from "@/lib/constants";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

interface ForgotPasswordForm {
    email: string;
}

const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>();

    const handleForgotPassword: SubmitHandler<ForgotPasswordForm> = async (
        data
    ) => {
        const toastId = toast.loading("Enviando solicitud...");
        try {
            const response = await fetch(
                `${BACKEND_URL}/auth/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: data.email }),
                }
            );

            if (response.ok) {
                return toast.success(
                    "Se ha enviado un código de recuperación a tu email.",
                    {
                        id: toastId,
                    }
                );
            } else if (response.status === 404) {
                return toast.warning("Usuario no encontrado.", {
                    description: "Verifica tu email",
                    id: toastId,
                });
            } else {
                return toast.warning("Ups! Ocurrió un error inesperado.", {
                    description:
                        "Intenta nuevamente o comunícate con nuestro soporte",
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error("Error al enviar la solicitud de recuperación.", {
                description:
                    "Intenta nuevamente o comunícate con nuestro soporte",
                id: toastId,
            });
            console.error(error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleForgotPassword)}
            className="space-y-4"
        >
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-first-gray mb-1"
                >
                    Ingresa tu correo para recuperar tu contraseña
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-third-gray" />
                    <input
                        id="email"
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Formato de email inválido",
                            },
                        })}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.email
                                ? "border-red-500"
                                : "border-fourth-gray"
                        } rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden`}
                        placeholder="tu@email.com"
                    />
                </div>
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>
            <p className="text-sm mt-2">
                <Link
                    href="/auth/login"
                    className="text-first-golden hover:text-second-golden"
                >
                    Volver al inicio de sesión
                </Link>
            </p>
            <button
                type="submit"
                className="w-full mt-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-first-golden hover:bg-second-golden duration-300"
            >
                Enviar código de recuperación
            </button>
        </form>
    );
};

export default ForgotPasswordForm;
