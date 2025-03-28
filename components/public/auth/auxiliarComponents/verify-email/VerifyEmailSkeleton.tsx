import React from "react";

const VerifyEmailSkeleton = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="animate-pulse grid place-items-center">
                <div className="h-16 w-16 rounded-full bg-orange-300 mb-6"></div>
                <h1 className="text-2xl font-semibold text-gray-500 mb-2">
                    Preparando verificación...
                </h1>
                <p className="text-gray-400">Estamos iniciando el proceso.</p>
            </div>
        </div>
    );
};

export default VerifyEmailSkeleton;
