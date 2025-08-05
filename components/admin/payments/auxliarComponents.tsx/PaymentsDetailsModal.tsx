"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { PaymentResponse } from "@/lib/api/admin/payments/payments.type";

interface Props {
    payment: PaymentResponse;
    onClose: () => void;
}

const PaymentDetailModal = ({ payment, onClose }: Props) => {
    const user = payment.user;

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
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative border border-custom-gray-300"
            >
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Detalle de Pago</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-custom-black-800">
                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Nombre completo</label>
                        <p>
                            {user?.name ?? "-"} {user?.lastName ?? ""}
                        </p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Correo electrónico</label>
                        <p>{user?.email ?? "-"}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Monto</label>
                        <p>€{payment.amount.toFixed(2)}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Método de pago</label>
                        <p>{payment.method}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Estado</label>
                        <p>{payment.status}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">ID de pago</label>
                        <p>{payment.id}</p>
                    </div>

                    <div className="bg-custom-white-50 p-3 rounded-md border border-custom-gray-200 col-span-1 md:col-span-2">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Fecha de creación</label>
                        <p>{new Date(payment.createdAt).toLocaleString("es-ES")}</p>
                    </div>
                </div>

                {/* <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-4 rounded-md"
                    >
                        Cerrar
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default PaymentDetailModal;
