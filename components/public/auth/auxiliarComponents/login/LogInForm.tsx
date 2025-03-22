"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface FormData {
    email: string;
    password: string;
}

const LogInForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const toastId = toast.loading("Iniciando sesión...");
        try {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            if (res?.ok) {
                toast.success("¡Inicio de sesión exitoso!", { id: toastId });
                return router.push(callbackUrl);
            }
            toast.warning("Credenciales incorrectas. Intente nuevamente.", {
                id: toastId,
            });
        } catch (error) {
            toast.info("Ups! Ocurrió un error inesperado.", {
                description:
                    "Intenta nuevamente o contacta con nuestro soporte",
                id: toastId,
            });
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-first-gray mb-1"
                >
                    Email
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

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-first-gray mb-1"
                >
                    Contraseña
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-third-gray" />
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 6,
                                message: "Mínimo 6 caracteres",
                            },
                        })}
                        className={`block w-full pl-10 pr-10 py-2 border ${
                            errors.password
                                ? "border-red-500"
                                : "border-fourth-gray"
                        } rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-2.5"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-third-gray" />
                        ) : (
                            <Eye className="h-5 w-5 text-third-gray" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="text-sm">
                <Link
                    href={"/auth/forgot-password"}
                    className="font-medium text-first-golden hover:text-second-golden duration-300"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-first-golden hover:bg-second-golden duration-300"
                >
                    Iniciar sesión
                </button>
            </div>
        </form>
    );
};

export default LogInForm;
