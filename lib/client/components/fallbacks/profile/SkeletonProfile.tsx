import { JSX } from "react";

export default function SkeletonProfile(): JSX.Element {
  return (
    <div className="w-full animate-pulse my-4 space-y-6 px-0 md:px-6 ">
      <div className="w-full flex flex-col justify-start items-start">
        <div className="h-5 w-1/3 bg-[var(--color-custom-gray-200)] rounded" />
      </div>
      {/* Nombre */}
      <div className="flex flex-col border p-3 border-custom-gray-300 rounded-md shadow-sm gap-2">
        <div className="h-3 w-20 bg-[var(--color-custom-gray-300)] rounded" />
        <div className="h-5 w-1/3 bg-[var(--color-custom-gray-200)] rounded" />
      </div>

      {/* Apellido */}
      <div className="flex flex-col border p-3 border-custom-gray-300 rounded-md shadow-sm gap-2">
        <div className="h-3 w-20 bg-[var(--color-custom-gray-300)] rounded" />
        <div className="h-5 w-1/3 bg-[var(--color-custom-gray-200)] rounded" />
      </div>

      {/* Email */}
      <div className="flex flex-col border p-3 border-custom-gray-300 rounded-md shadow-sm gap-2">
        <div className="h-3 w-32 bg-[var(--color-custom-gray-300)] rounded" />
        <div className="h-5 w-2/3 bg-[var(--color-custom-gray-200)] rounded" />
      </div>

      {/* Teléfono */}
      <div className="flex flex-col border p-3 border-custom-gray-300 rounded-md shadow-sm gap-2">
        <div className="h-3 w-28 bg-[var(--color-custom-gray-300)] rounded" />
        <div className="h-5 w-1/2 bg-[var(--color-custom-gray-200)] rounded" />
      </div>

      {/* Link de referido */}
      <div className="flex flex-col border p-3 border-custom-gray-300 rounded-md shadow-sm gap-2">
        <div className="h-3 w-40 bg-[var(--color-custom-gray-300)] rounded" />
        <div className="h-5 w-full bg-[var(--color-custom-gray-200)] rounded" />
      </div>

      {/* Quien te refirió */}
      <div className="flex flex-col border p-3 border-custom-gray-300 rounded-md shadow-sm gap-2">
        <div className="h-3 w-24 bg-[var(--color-custom-gray-300)] rounded" />
        <div className="h-5 w-2/3 bg-[var(--color-custom-gray-200)] rounded" />
      </div>

      {/* Botón Guardar */}
      <div className="h-10 w-full rounded-sm bg-[var(--color-custom-gray-200)]" />
    </div>
  );
}
