import { JSX } from "react";

export default function SkeletonProfile(): JSX.Element {
    return (
        <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md animate-pulse">
            {/* Título o encabezado */}
            <div className="h-8 bg-[var(--color-custom-gray-300)] rounded w-1/3 mb-6 mx-auto"></div>

            {/* Primera fila: dos campos (ej. nombre y apellido) */}
            <div className="flex flex-col md:flex-row md:gap-4 mb-4">
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--color-custom-gray-300)] rounded w-1/4"></div>
                    <div className="h-10 bg-[var(--color-custom-gray-200)] rounded"></div>
                </div>
                <div className="flex-1 space-y-2 mt-4 md:mt-0">
                    <div className="h-4 bg-[var(--color-custom-gray-300)] rounded w-1/4"></div>
                    <div className="h-10 bg-[var(--color-custom-gray-200)] rounded"></div>
                </div>
            </div>

            {/* Campo individual (ej. email) */}
            <div className="mb-4 space-y-2">
                <div className="h-4 bg-[var(--color-custom-gray-300)] rounded w-1/3"></div>
                <div className="h-10 bg-[var(--color-custom-gray-200)] rounded"></div>
            </div>

            {/* Otro campo individual (ej. teléfono) */}
            <div className="mb-4 space-y-2">
                <div className="h-4 bg-[var(--color-custom-gray-300)] rounded w-1/4"></div>
                <div className="h-10 bg-[var(--color-custom-gray-200)] rounded"></div>
            </div>
            {/* Otro campo individual (ej. teléfono) */}
            <div className="mb-4 space-y-2">
                <div className="h-4 bg-[var(--color-custom-gray-300)] rounded w-1/4"></div>
                <div className="h-10 bg-[var(--color-custom-gray-200)] rounded"></div>
            </div>
            {/* Otro campo individual (ej. teléfono) */}
            <div className="mb-4 space-y-2">
                <div className="h-4 bg-[var(--color-custom-gray-300)] rounded w-1/4"></div>
                <div className="h-10 bg-[var(--color-custom-gray-200)] rounded"></div>
            </div>
        </div>
    );
}
