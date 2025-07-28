"use client";
import { useSearchParams } from "next/navigation";
import SearchOfferProcess from "../../vehicle-offer/auxiliarComponents/SearchOfferProcess";
import SearchProcess from "./SearchProcess";

export default function SearchWrapper() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");

    if (mode === "van") {
        return <SearchOfferProcess />;
    }

    return <SearchProcess />;
}
