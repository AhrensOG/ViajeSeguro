import { BACKEND_URL } from "@/lib/constants";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ForgotPasswordForm {
    forgotEmail: string;
}

const ForgotPasswordForm = () => {
    const {
        register: registerForgot,
        handleSubmit: handleForgotSubmit,
        watch: watchForgot,
        formState: { errors: forgotErrors },
    } = useForm<ForgotPasswordForm>();

    const handleForgotPassword = async () => {
        const email = watchForgot("forgotEmail");
        if (!email) {
            toast.warning("Por favor, ingresa un email válido.");
            return;
        }

        try {
            const response = await fetch(
                BACKEND_URL + "/auth/forgot-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                toast.success(
                    "Se ha enviado un código de recuperación a tu email."
                );
            } else {
                response.status === 404
                    ? toast.warning("Usuario no encontrado.", {
                          description: "Verifica tu email",
                      })
                    : toast.warning("Ups! Ocurrio un error inesperado.", {
                          description:
                              "Intenta nuevamente o comunicate con nuestro soporte",
                      });
            }
        } catch (error) {
            toast.error("Error al enviar la solicitud de recuperación.");
        }
    };

    return (
        <form
            onSubmit={handleForgotSubmit(handleForgotPassword)}
            className="space-y-4"
        >
            <div>
                <label
                    htmlFor="forgotEmail"
                    className="block text-sm font-medium text-first-gray mb-1"
                >
                    Ingresa tu correo para recuperar tu contraseña
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-third-gray" />
                    <input
                        id="forgotEmail"
                        {...registerForgot("forgotEmail", {
                            required: "El email es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Formato de email inválido",
                            },
                        })}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                            forgotErrors.forgotEmail
                                ? "border-red-500"
                                : "border-fourth-gray"
                        } rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden`}
                        placeholder="tu@email.com"
                    />
                </div>
                {forgotErrors.forgotEmail && (
                    <p className="text-red-500 text-xs mt-1">
                        {forgotErrors.forgotEmail.message}
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
