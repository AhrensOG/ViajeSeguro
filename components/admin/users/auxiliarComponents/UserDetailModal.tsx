"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { UserAdminResponse } from "@/lib/api/admin/user-panel/userPanel.types";
import BanTimer from "@/components/common/BanTimer";
import RestrictionTimer from "@/components/common/RestrictionTimer";

interface Props {
    user: UserAdminResponse;
    onClose: () => void;
}

const UserDetailModal = ({ user, onClose }: Props) => {
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
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black">
                    <X className="size-5" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Detalles del usuario</h2>

                <div className="space-y-4 text-sm text-custom-black-800">
                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Nombre completo</label>
                        <p>
                            {user.name} {user.lastName}
                        </p>
                    </div>
                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Correo electrónico</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Rol</label>
                        <p>{user.role}</p>
                    </div>
                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Email Verificado</label>
                        <p>{user.emailVerified ? "Sí" : "No"}</p>
                    </div>
                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Creado</label>
                        <p>{new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Actualizado</label>
                        <p>{new Date(user.updatedAt).toLocaleString()}</p>
                    </div>

                    {/* Ban Timer */}
                    {user.resetToken && user.resetToken.startsWith('BANNED:') && user.resetTokenExpires && (
                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-red-500 mb-1">Estado: Baneado</label>
                            <BanTimer bannedUntil={new Date(user.resetTokenExpires)} />
                        </div>
                    )}

                    {/* Restriction Timer */}
                    {user.driverLicenseUrl && user.driverLicenseUrl.startsWith('RESTRICTED') && (
                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-yellow-600 mb-1">Estado: Restringido</label>
                            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-2">
                                <label className="block text-xs font-semibold text-yellow-700 mb-1">Restricción finaliza el</label>
                                <p className="text-yellow-900 font-medium">
                                    {(() => {
                                        let date: Date | null = null;
                                        if (user.driverLicenseUrl?.startsWith('RESTRICTED|')) {
                                            date = new Date(user.driverLicenseUrl.split('|')[1]);
                                        } else if (user.driverLicenseUrl?.startsWith('RESTRICTED:')) {
                                            // Legacy format support: RESTRICTED:YYYY-MM-DDTHH:mm:ss.sssZ:ROLE
                                            const parts = user.driverLicenseUrl.split(':');
                                            // Join parts between "RESTRICTED" and "ROLE"
                                            const dateStr = parts.slice(1, parts.length - 1).join(':');
                                            date = new Date(dateStr);
                                        }

                                        return date && !isNaN(date.getTime()) ? date.toLocaleString() : 'Fecha inválida';
                                    })()}
                                </p>
                            </div>
                            <RestrictionTimer restrictedUntil={(() => {
                                let date: Date | null = null;
                                if (user.driverLicenseUrl?.startsWith('RESTRICTED|')) {
                                    date = new Date(user.driverLicenseUrl.split('|')[1]);
                                } else if (user.driverLicenseUrl?.startsWith('RESTRICTED:')) {
                                    const parts = user.driverLicenseUrl.split(':');
                                    const dateStr = parts.slice(1, parts.length - 1).join(':');
                                    date = new Date(dateStr);
                                }
                                return date && !isNaN(date.getTime()) ? date : new Date();
                            })()} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
