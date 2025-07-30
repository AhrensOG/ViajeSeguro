import { Suspense } from "react";
import NavBar from "../navigation/NavBar";
import SearchProcessFallback from "@/lib/client/components/fallbacks/search/SearchProcessFallback";
import SearchWrapper from "./auxiliarComponents/SearchWrapper";
import FiltersBar from "./auxiliarComponents/FiltersBar";

export default function SearchPage() {
    return (
        <div className="min-h-screen flex flex-col bg-custom-white-50">
            <NavBar shadow={false} />
            <Suspense fallback={<SearchProcessFallback />}>
                <FiltersBar />
                {/* <SearchProcess /> */}
                <SearchWrapper />
            </Suspense>
        </div>
    );
}
