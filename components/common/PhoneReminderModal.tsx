"use client"

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchUserData } from "@/lib/api/client-profile";
import { X, Phone as PhoneIcon, ArrowRight } from "lucide-react";

export default function PhoneReminderModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // Al autenticarse, verificar si el usuario tiene teléfono cargado
    const checkPhone = async () => {
      try {
        const userId = (session?.user as { id?: string } | undefined)?.id;
        if (!userId) return;
        const profile = await fetchUserData(userId);
        const hasPhone = !!profile?.phone && String(profile.phone).trim().length > 0;
        // No mostrar el modal cuando ya estamos en la pantalla de perfil
        const isOnProfile = pathname?.startsWith("/dashboard/user/profile");
        setOpen(!hasPhone && !isOnProfile);
      } catch {
        // En caso de error, no bloquear la app; no abrir modal
        setOpen(false);
      }
    };

    if (status === "authenticated") {
      checkPhone();
    }
  }, [status, session, pathname]);

  // Si estamos en la pantalla de perfil, nunca renderizar el modal para evitar molestia
  if (!open || pathname?.startsWith("/dashboard/user/profile")) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-custom-white-100 border border-custom-gray-200 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-custom-golden-700 to-custom-golden-600 text-white">
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Agrega tu número de teléfono</h3>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-white/10" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-3 text-custom-gray-700">
          <p className="text-custom-black-800 font-medium">
            Para contratar y gestionar servicios de Viaje Seguro, necesitas registrar tu número de teléfono.
          </p>
          <p className="text-sm text-custom-gray-600">
            Si ya lo cargaste, recuerda mantenerlo actualizado. Te tomará menos de un minuto.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 bg-custom-white-100 border-t border-custom-gray-200">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg border border-custom-gray-300 text-custom-gray-700 hover:bg-gray-50 transition"
          >
            Ahora no
          </button>
          <button
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/user/profile");
            }}
            className="px-4 py-2 rounded-lg bg-custom-golden-700 hover:bg-custom-golden-800 text-white flex items-center gap-2 shadow-sm transition"
          >
            Ingresar número <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
