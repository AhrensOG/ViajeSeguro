import SearchPage2 from "@/components/public/search2/SearchPage2";
import { Suspense } from "react";

export default function Search2() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <SearchPage2 />
    </Suspense>
  );
}
