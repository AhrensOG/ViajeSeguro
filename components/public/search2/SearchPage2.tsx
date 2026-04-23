"use client";

import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import HeroBusqueda from "./HeroBusqueda";
import ResultsList2 from "./ResultsList2";
import AuthPromptModal from "@/components/common/AuthPromptModal";

export default function SearchPage2() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <NavBar />
      <HeroBusqueda />
      <div className="container mx-auto px-4 py-8">
        <ResultsList2 />
      </div>
      <Footer />
      <AuthPromptModal delay={10} />
    </div>
  );
}
