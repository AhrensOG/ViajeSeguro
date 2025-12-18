import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { SimpleUser } from "@/lib/api/admin/user-panel/userPanel.types";
import { toast } from "sonner";
import { deleteUser } from "@/lib/api/admin/user-panel";

interface Props {
    user: SimpleUser;
    onClose: () => void;
    onSuccess: (userId: string) => void;
}

const UserBanModal = ({ user, onClose, onSuccess }: Props) => {
    const [banType, setBanType] = useState<"PERMANENT" | "TEMPORARY">("TEMPORARY");
    const [days, setDays] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    const handleBan = async () => {
        if (!user.id) {
            toast.error("ID de usuario no encontrado");
            return;
        }
        setLoading(true);
        try {
            const daysToSend = banType === "TEMPORARY" ? days : undefined;
            await deleteUser(user.id, daysToSend);
            toast.success("Usuario baneado exitosamente");
            onSuccess(user.id);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error al banear usuario");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl w-full max-w-md relative border border-custom-gray-300 overflow-hidden"
            >
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black">
                    <X size={20} />
                </button>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-red-600">
                        <AlertTriangle className="h-6 w-6" />
                        <h2 className="text-xl font-bold">Banear Usuario</h2>
                    </div>

                    <p className="text-gray-600 mb-6 text-sm">
                        Estás a punto de restringir el acceso a <span className="font-semibold text-gray-900">{user.name} {user.lastName}</span>.
                    </p>

                    <div className="space-y-4 mb-6">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setBanType("TEMPORARY")}
                                className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${banType === "TEMPORARY"
                                    ? "bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Temporal
                            </button>
                            <button
                                onClick={() => setBanType("PERMANENT")}
                                className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${banType === "PERMANENT"
                                    ? "bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Permanente
                            </button>
                        </div>

                        {banType === "TEMPORARY" && (
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                    Duración del baneo (días)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={days}
                                    onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    El usuario será desbaneado automáticamente después de {days} día(s).
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleBan}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? "Procesando..." : "Confirmar Baneo"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserBanModal;
