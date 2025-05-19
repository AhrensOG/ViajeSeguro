import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import HeroSection from "./auxiliarComponents/HeroSection";
import ComparisionTableSection from "./auxiliarComponents/ComparisionTableSection";
import FAQSection from "./auxiliarComponents/FAQSection";
import CTASection from "./auxiliarComponents/CTASection";
import TestimonialsSection from "./auxiliarComponents/TestimonialsSection";
import PromotionCards from "./auxiliarComponents/PromotionCards";

const PromotionsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[--color-custom-white-50] text-[--color-custom-black-900]">
      <NavBar />
      <HeroSection />
      <section id="promotions" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-custom-black-800 text-center mb-12">
            Elige el plan que mejor se adapte a ti
          </h2>
          <PromotionCards />
          <ComparisionTableSection />
          <FAQSection />
        </div>
      </section>
      <CTASection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default PromotionsPage;
