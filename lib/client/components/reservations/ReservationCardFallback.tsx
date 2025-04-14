"use client";

import { CalendarDays, Clock, ChevronDown } from "lucide-react";

const ReservationCardFallback = () => {
  return (
    <div className="w-full rounded-2xl border border-custom-gray-200 shadow-md bg-custom-white-100 p-6 flex flex-col gap-4 animate-pulse">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-custom-golden-700">
          <CalendarDays className="size-5" />
          <div className="h-4 w-24 bg-custom-golden-200 rounded" />
        </div>
        <div className="flex items-center gap-2 text-custom-gray-500">
          <div className="h-4 w-16 bg-gray-300 rounded" />
          <ChevronDown size={18} className="text-gray-300" />
        </div>
      </div>

      {/* Info principal */}
      <div>
        <div className="h-6 w-48 bg-gray-300 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded mb-2" />
        <div className="flex items-center gap-2 text-custom-gray-600 text-sm">
          <Clock className="size-4 text-gray-300" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Indicador */}
      <div className="h-3 w-56 bg-gray-200 rounded" />

      {/* Detalles expandibles */}
      {/* <div className="overflow-hidden flex flex-col gap-6 mt-2">
        <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4">
          <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
          <div className="h-3 w-full bg-gray-200 rounded" />
        </div>
        <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4">
          <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
          <div className="h-3 w-full bg-gray-200 rounded" />
        </div>
        <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4">
          <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <div className="h-3 w-48 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-end items-center">
          <div className="h-8 w-28 bg-gray-300 rounded" />
        </div>
      </div> */}
    </div>
  );
};

export default ReservationCardFallback;
