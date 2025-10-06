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
    <div className="w-full p-4 md:p-5 bg-custom-white-100 border border-custom-gray-300 rounded-lg shadow-sm">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <Gift className="text-custom-golden-600" size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-custom-black-900">
              {title || "Comparte y gana"}
            </h3>
            {referredCount > 0 && (
              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-custom-golden-100 text-custom-golden-700 border border-custom-golden-500">
                {referredCount === 1 ? "Tienes 1 referido" : `Tienes ${referredCount} referidos`}
              </span>
            )}
          </div>
          <p className="text-sm text-custom-gray-700 mt-1">
            {subtitle || "Invita a tus amigos con tu enlace de referido"}
          </p>
          {referredCount === 0 && (
            <p className="text-sm text-custom-gray-500 mt-1">
              Todavía no tienes amigos o invitadores
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <input
              readOnly
              value={link}
              onClick={handleCopy}
              className="flex-1 font-mono text-xs md:text-sm bg-white border border-custom-gray-300 rounded-md px-3 py-2 text-custom-golden-700 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-md border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100"
              aria-label="Copiar"
            >
              <Copy size={16} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 rounded-md bg-custom-golden-600 hover:bg-custom-golden-700 text-white"
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
  );
}
