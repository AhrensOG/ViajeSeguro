import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    confirmPassword: string;
    terms: boolean;
};

const RegisterForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const toastId = toast.loading("Registrando...");
        try {
            const rest = {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                role: "CLIENT",
            };
            const res = await fetch(BACKEND_URL + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rest),
            });
            if (res.ok) {
                return toast.success("Te has registrado correctamente.", {
                    id: toastId,
                });
            }
            toast.info("Ups! ocurrió un error al registrar tu cuenta.", {
                description:
                    "Intenta nuevamente o contacta con nuestro soporte.",
                id: toastId,
            });
            return router.push("/auth/login");
        } catch (error) {
            toast.info("Ups! ocurrió un error inesperado.", {
                description:
                    "Intenta nuevamente o contacta con nuestro soporte.",
                id: toastId,
            });
            console.log(error);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Nombre
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-third-gray" />
                    <input
                        id="name"
                        {...register("name", {
                            required: "El nombre es obligatorio",
                        })}
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
                        placeholder="Tu nombre"
                    />
                </div>
                {errors.name && (
                    <p className="text-red-500 text-sm pt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Apellido
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-third-gray" />
                    <input
                        id="lastName"
                        {...register("lastName", {
                            required: "El apellido es obligatorio",
                        })}
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
                        placeholder="Tu apellido"
                    />
                </div>
                {errors.lastName && (
                    <p className="text-red-500 text-sm pt-1">
                        {errors.lastName.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-second-gray mb-1"
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
                                value: /^\S+@\S+$/i,
                                message: "Email inválido",
                            },
                        })}
                        type="email"
                        className="block w-full pl-10 pr-3 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
                        placeholder="tu@email.com"
                    />
                </div>
                {errors.email && (
                    <p className="text-red-500 text-sm pt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Contraseña
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-third-gray" />
                    <input
                        id="password"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 6,
                                message: "Mínimo 6 caracteres",
                            },
                        })}
                        type={showPassword ? "text" : "password"}
                        className="block w-full pl-10 pr-10 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
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
                    <p className="text-red-500 text-sm pt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Confirmar Contraseña
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-third-gray" />
                    <input
                        id="confirmPassword"
                        {...register("confirmPassword", {
                            required: "Debes confirmar tu contraseña",
                            validate: (value) =>
                                value === watch("password") ||
                                "Las contraseñas no coinciden",
                        })}
                        type={showConfirmPassword ? "text" : "password"}
                        className="block w-full pl-10 pr-10 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
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
                            <EyeOff className="h-5 w-5 text-third-gray" />
                        ) : (
                            <Eye className="h-5 w-5 text-third-gray" />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm pt-1">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <div>
                <div className="flex items-center">
                    <input
                        id="terms"
                        {...register("terms", {
                            required:
                                "Debes aceptar los términos y condiciones",
                        })}
                        type="checkbox"
                        className="h-4 w-4 text-first-golden focus:ring-first-golden border-fourth-gray rounded"
                    />
                    <label
                        htmlFor="terms"
                        className="ml-2 block text-sm text-second-gray"
                    >
                        Acepto los{" "}
                        <a
                            href="#"
                            className="font-medium text-first-golden hover:text-second-golden"
                        >
                            términos y condiciones
                        </a>
                    </label>
                </div>
                {errors.terms && (
                    <p className="text-red-500 text-sm pt-1">
                        {errors.terms.message}
                    </p>
                )}
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-first-golden hover:bg-second-golden duration-300"
                >
                    Crear cuenta
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;
