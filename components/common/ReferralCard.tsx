"use client";
import { useMemo } from "react";
import { Copy, Share2, Gift } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/constants";

type Props = {
  referralCode: string | null | undefined;
  title?: string;
  subtitle?: string;
  referredCount?: number;
};

export default function ReferralCard({ referralCode, title, subtitle, referredCount = 0 }: Props) {
  const link = useMemo(() => {
    const code = referralCode || "";
    return `${BASE_URL}/auth/register?ref=${code}`;
  }, [referralCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("¡Link copiado al portapapeles!");
    } catch {
      toast.info("No se pudo copiar. Intenta manualmente.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Únete a Viaje Seguro",
          text: "Regístrate con mi enlace y obtén beneficios",
          url: link,
        });
      } else {
        await navigator.clipboard.writeText(link);
        toast.success("Compartir no disponible. Enlace copiado.");
      }
    } catch {
      /* usuario canceló */
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Gift className="text-amber-500" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-semibold text-gray-900">
                {title || "Comparte y gana"}
              </h3>
              {referredCount > 0 && (
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {referredCount === 1 ? "1 referido" : `${referredCount} referidos`}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {subtitle || "Invita a tus amigos con tu enlace de referido"}
            </p>
            {referredCount === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Todavía no tienes referidos
              </p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  readOnly
                  value={link}
                  onClick={handleCopy}
                  className="w-full font-mono text-xs md:text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-amber-700 cursor-pointer pr-10"
                />
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 transition-all flex items-center justify-center"
                aria-label="Copiar"
              >
                <Copy size={16} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="shrink-0 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 flex items-center gap-2 text-sm font-medium transition-all shadow-sm"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Compartir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
