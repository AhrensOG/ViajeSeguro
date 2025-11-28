import SearchPage from "@/components/public/search/SearchPage";
import React from "react";

import { Suspense } from "react";

const Search = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SearchPage />
    </Suspense>
  );
};

export default Search;
