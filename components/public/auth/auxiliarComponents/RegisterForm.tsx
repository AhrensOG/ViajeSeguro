import React, { useState } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <form className="space-y-4">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Nombre completo
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-third-gray" />
                    </div>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
                        placeholder="Tu nombre completo"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-third-gray" />
                    </div>
                    <input
                        id="register-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
                        placeholder="tu@email.com"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Teléfono
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-third-gray" />
                    </div>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
                        placeholder="600 123 456"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Contraseña
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-third-gray" />
                    </div>
                    <input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="block w-full pl-10 pr-10 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
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
            </div>

            <div>
                <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-second-gray mb-1"
                >
                    Confirmar contraseña
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-third-gray" />
                    </div>
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="block w-full pl-10 pr-10 py-2 border border-fourth-gray rounded-md shadow-sm outline-none focus:ring-first-golden focus:border-first-golden"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
            </div>

            <div className="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
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

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-first-golden hover:bg-second-golden duration-300"
                >
                    Crear cuenta
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;
