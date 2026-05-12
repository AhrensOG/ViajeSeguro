"use client";

import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import HeroBusqueda from "./HeroBusqueda";
import ResultsList from "./ResultsList";

export default function SearchPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <NavBar />
      <HeroBusqueda />
      <div className="container mx-auto px-4 py-8">
        <ResultsList />
      </div>
      <Footer />
    </div>
  );
}
