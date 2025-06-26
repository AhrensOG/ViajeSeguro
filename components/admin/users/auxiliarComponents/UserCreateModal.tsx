"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { createUser } from "@/lib/api/admin/user-panel";
import { toast } from "sonner";
import { SimpleUser, UserFormData, UserResponse } from "@/lib/api/admin/user-panel/userPanel.types";

interface Props {
    onClose: () => void;
    onSuccess: Dispatch<SetStateAction<SimpleUser[]>>;
}

const roles = ["CLIENT", "DRIVER", "ADMIN"];

const UserCreateModal = ({ onClose, onSuccess }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormData>({
        defaultValues: {
            name: "",
            lastName: "",
            email: "",
            password: "",
            role: "CLIENT",
        },
    });

    const handleCreateUser = async (data: UserFormData) => {
        try {
            const res = (await createUser(data)) as SimpleUser;
            if (!res) {
                toast.info("Error al crear el usuario");
                return;
            }
            toast.success("Usuario creado con éxito");
            onSuccess((prev) => [...prev, res]);
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                return toast.info(error.message);
            } else {
                console.error(error);
                return toast.info("Error al crear el usuario");
            }
        }
    };

    const onSubmit = (data: UserFormData) => {
        handleCreateUser(data);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose(); // función que cierra el modal
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div onClick={onClose} className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
                    <X className="size-5" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Crear nuevo usuario</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm text-custom-black-800">
                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Nombre</label>
                        <input
                            type="text"
                            {...register("name", { required: "El nombre es obligatorio" })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            placeholder="Nombre"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Apellido</label>
                        <input
                            type="text"
                            {...register("lastName", { required: "El apellido es obligatorio" })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            placeholder="Apellido"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: { value: /.+@.+\..+/, message: "Correo inválido" },
                            })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            placeholder="Correo electrónico"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Contraseña</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                            })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            placeholder="Contraseña"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Rol</label>
                        <select {...register("role", { required: true })} className="w-full border border-custom-gray-300 rounded-md px-4 py-2">
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Crear usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreateModal;
