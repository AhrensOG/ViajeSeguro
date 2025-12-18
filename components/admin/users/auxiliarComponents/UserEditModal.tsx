"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { SimpleUser, UserAdminResponse, UserEditFormData } from "@/lib/api/admin/user-panel/userPanel.types";
import { updateUserData } from "@/lib/api/admin/user-panel";
import { toast } from "sonner";

interface Props {
    user: UserAdminResponse;
    onClose: () => void;
    onUpdateUser: (user: SimpleUser) => void;
}

const roles = ["CLIENT", "DRIVER", "ADMIN", "PARTNER"];

const UserEditModal = ({ user, onClose, onUpdateUser }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserAdminResponse>({
        defaultValues: user,
    });

    // Watch role to show restriction option
    // using internal state because watch() might be easier or just onChange
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [isRestricted, setIsRestricted] = useState(false);
    const [restrictionDays, setRestrictionDays] = useState(1);

    const handleSaveData = async (data: UserAdminResponse) => {
        const updatedUser: UserEditFormData = {
            name: data.name,
            lastName: data.lastName,
            role: data.role,
        };

        // If restricting (only valid for CLIENT usually, but let's allow for any if needed, spec says when changing to CLIENT)
        if (selectedRole === 'CLIENT' && isRestricted) {
            const now = new Date();
            const expiry = new Date(now.getTime() + restrictionDays * 24 * 60 * 60 * 1000);
            // Hijack driverLicenseUrl
            updatedUser.driverLicenseUrl = `RESTRICTED|${expiry.toISOString()}|${user.role}`;
        }

        const res = await updateUserData(user.id, updatedUser);
        if (!res) {
            toast.info("Error al actualizar el usuario");
            return;
        }
        toast.success("Usuario actualizado con éxito");
        onUpdateUser({ ...user, ...updatedUser } as SimpleUser);
        onClose();
    };

    const onSubmit = (data: UserAdminResponse) => {
        handleSaveData(data);
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
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black">
                    <X className="size-5" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Editar usuario</h2>

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
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Rol</label>
                        <select
                            {...register("role", {
                                required: true,
                                onChange: (e) => setSelectedRole(e.target.value)
                            })}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Restriction Option for CLIENT */}
                    {selectedRole === "CLIENT" && (
                        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-2">
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    id="restrictUser"
                                    checked={isRestricted}
                                    onChange={(e) => setIsRestricted(e.target.checked)}
                                    className="accent-yellow-600 w-4 h-4"
                                />
                                <label htmlFor="restrictUser" className="text-sm font-medium text-yellow-800 cursor-pointer select-none">
                                    Aplicar restricción temporal
                                </label>
                            </div>

                            {isRestricted && (
                                <div className="ml-6 animate-in slide-in-from-top-1">
                                    <label className="block text-xs font-semibold text-yellow-700 mb-1">
                                        Días de restricción
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={restrictionDays}
                                        onChange={(e) => setRestrictionDays(Math.max(1, parseInt(e.target.value) || 0))}
                                        className="w-full border border-yellow-300 rounded-md px-3 py-1 text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200"
                                    />
                                    <p className="text-[10px] text-yellow-600 mt-1">
                                        El usuario verá un mensaje de advertencia pero podrá acceder.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;
