"use client";

import NavBar from "../navigation/NavBar";
import HeroMinimal from "./HeroMinimal";
import RoutesCompact from "./RoutesCompact";
import BenefitsMinimal from "./BenefitsMinimal";
import HowItWorks from "./HowItWorks";
import PaymentMethods from "./PaymentMethods";
import CTAMinimal from "./CTAMinimal";
import Footer from "../navigation/Footer";

const Home2Page = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      <HeroMinimal />
      <RoutesCompact />
      <BenefitsMinimal />
      <HowItWorks />
      <PaymentMethods />
      <CTAMinimal />
      <Footer />
    </div>
  );
};

export default Home2Page;
