import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface FormInputs {
    email: string;
    password: string;
}

const LogInForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        console.log(data);
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-third-gray" />
                    </div>
                    <input
                        id="email"
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-third-gray" />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 6,
                                message:
                                    "La contraseña debe tener al menos 6 caracteres",
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
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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

            <div className="flex items-center justify-between">
                <div className="text-sm">
                    <a
                        href="#"
                        className="font-medium text-first-golden hover:text-second-golden duration-300"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-first-white bg-first-golden hover:bg-second-golden duration-300"
                >
                    Iniciar sesión
                </button>
            </div>
        </form>
    );
};

export default LogInForm;
