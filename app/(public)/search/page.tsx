import type { Metadata } from "next";
import SearchPage from "@/components/public/search/SearchPage";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Buscar viajes",
  description:
    "Encuentra viajes compartidos entre Barcelona y Valencia. Filtra por origen, destino y fecha para tu próximo viaje.",
  robots: { index: false, follow: true },
};

const Search = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <SearchPage />
    </Suspense>
  );
};

export default Search;
