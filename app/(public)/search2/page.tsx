import type { Metadata } from "next";
import SearchPage2 from "@/components/public/search2/SearchPage2";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Buscar viajes",
  description:
    "Encuentra viajes compartidos entre Madrid, Barcelona y Valencia. Filtra por origen, destino y fecha para tu próximo viaje.",
  robots: { index: false, follow: true },
};

export default function Search2() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <SearchPage2 />
    </Suspense>
  );
}
