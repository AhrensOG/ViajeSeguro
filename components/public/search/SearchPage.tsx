import { Suspense } from "react";
import NavBar from "../navigation/NavBar";
import SearchProcessFallback from "@/lib/client/components/fallbacks/search/SearchProcessFallback";
import SearchWrapper from "./auxiliarComponents/SearchWrapper";
import FiltersBar from "./auxiliarComponents/FiltersBar";
import AuthPromptModal from "@/components/common/AuthPromptModal";

export default function SearchPage() {
    return (
        <div className="min-h-screen flex flex-col bg-custom-white-50 relative">
            <NavBar shadow={false} />
            <Suspense fallback={<SearchProcessFallback />}>
                <FiltersBar />
                {/* <SearchProcess /> */}
                <SearchWrapper />
            </Suspense>
            <AuthPromptModal delay={2} />
        </div>
    );
}
