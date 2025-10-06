"use client";
import { useEffect, useMemo, useState } from "react";
import { Gift, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/constants";

// Use a fresh storage key so it appears para todos nuevamente
const STORAGE_KEY = "vs_referral_banner_dismissed_v2";

type Props = { referralCode?: string | null };

export default function ReferralBanner({ referralCode }: Props) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setDismissed(v === "1");
  }, []);

  // No contador: sin llamadas extra ni estado adicional

  const link = useMemo(() => {
    const code = referralCode || "";
    return `${BASE_URL}/auth/register?ref=${code}`;
  }, [referralCode]);

  if (dismissed) return null;

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Viaje Seguro", text: "Únete con mi enlace", url: link });
      } else {
        await navigator.clipboard.writeText(link);
        toast.success("Compartir no disponible. Enlace copiado.");
      }
    } catch {}
  };

  const onDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <div className="w-full">
      <div className="relative mt-0 bg-custom-golden-100/90 border-b border-custom-golden-600/60 shadow-sm">
        <button onClick={onDismiss} className="absolute right-3 top-3 text-custom-black-800/70 hover:text-custom-black-800" aria-label="Ocultar">
          <X size={16} />
        </button>
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-custom-golden-700 border border-custom-gray-300 shadow-sm">
                <Gift size={18} />
              </div>
              <div className="text-custom-black-800">
                <div className="font-semibold leading-5">Comparte tu enlace y obtén beneficios</div>
                <div className="text-xs md:text-sm text-custom-gray-700 mt-0.5">Invita amigos y obten descuentos.</div>
              </div>
            </div>
            <div className="flex-1" />
            {/* Sin contador de referidos por pedido */}
            <div className="flex items-center">
              <button
                onClick={onShare}
                className="px-4 py-2 rounded-full bg-custom-golden-600 hover:bg-custom-golden-700 text-white shadow-sm transition-colors"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Share2 size={16} />
                  <span>Compartir</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
