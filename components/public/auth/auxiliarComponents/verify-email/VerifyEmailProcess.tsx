"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";

type StatusType = "loading" | "success" | "error";

const VerifyEmailProcess = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<StatusType>("loading");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await fetch(BACKEND_URL + "/auth/verify-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });
                if (!res.ok) throw new Error();
                setStatus("success");
                router.push("/");
            } catch {
                setStatus("error");
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setStatus("error");
        }
    }, [token, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-first-white px-4 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-first-golden border-solid mb-6"></div>
                <h1 className="text-2xl font-semibold text-first-gray">
                    Verificando tu correo electrónico...
                </h1>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-first-white px-4 text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">
                    ¡Correo verificado con éxito!
                </h1>
                <p className="text-gray-600 mb-6">
                    Gracias por confirmar tu correo. Ya podés acceder a la
                    plataforma.
                </p>
                <span className="px-6 py-2 text-first-golden font-semibold rounded-md">
                    ¡Te has registrado con éxito!
                </span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-first-white px-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
                Error al verificar el correo
            </h1>
            <p className="text-gray-600 mb-6">
                El enlace es inválido o expiró. Solicitá un nuevo email de
                verificación o contactá a soporte.
            </p>
            <button
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-first-golden hover:bg-second-golden text-first-white font-semibold rounded-md"
            >
                Ir al inicio
            </button>
        </div>
    );
};

export default VerifyEmailProcess;
