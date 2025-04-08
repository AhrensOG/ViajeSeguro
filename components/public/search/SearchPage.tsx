import { Suspense } from "react";
import NavBar from "../navigation/NavBar";
import SearchProcess from "./auxiliarComponents/SearchProcess";
import SearchProcessFallback from "@/lib/client/components/fallbacks/SearchProcessFallback";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-custom-white-50">
      <NavBar shadow={false} />
      <Suspense fallback={<SearchProcessFallback />}>
        <SearchProcess />
      </Suspense>
    </div>
  );
}
