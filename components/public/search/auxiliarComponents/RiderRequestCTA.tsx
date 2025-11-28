"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CreateRiderRequestModal from "./CreateRiderRequestModal";

export default function RiderRequestCTA() {
  const [open, setOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 mt-4 z-10">
      <div className="rounded-2xl border border-custom-golden-200 bg-custom-golden-50 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            ¿No encontraste tu pasaje o no te convence el horario?
          </h3>
          <p className="text-sm md:text-base text-gray-700 mt-1">
            Armá tu propio viaje y los conductores registrados se postularán para llevarte. Podrás indicar cuántas
            personas viajan contigo, elegir al conductor y permitir que otros viajeros se unan hasta completar las plazas.
          </p>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => {
              if (status !== "authenticated") {
                const callbackUrl = typeof window !== 'undefined' ? window.location.href : '/search';
                router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
                return;
              }
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-custom-golden-600 px-4 py-2 text-white hover:bg-custom-golden-700"
          >
            Armar mi viaje
          </button>
        </div>
      </div>
      <CreateRiderRequestModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
