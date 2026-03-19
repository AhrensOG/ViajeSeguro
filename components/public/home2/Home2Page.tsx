"use client";

import NavBar from "../navigation/NavBar";
import HeroMinimal from "./HeroMinimal";
import RoutesCompact from "./RoutesCompact";
import BenefitsMinimal from "./BenefitsMinimal";
import HowItWorks from "./HowItWorks";
import PaymentMethods from "./PaymentMethods";
import CTAMinimal from "./CTAMinimal";
import Footer from "../navigation/Footer";
import { motion } from "framer-motion";
import { Car, ArrowRight } from "lucide-react";
import Link from "next/link";

const EarnMoneyBanner = () => {
  return (
    <section className="bg-gradient-to-r from-amber-500 to-amber-600 py-6">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                Publica tu viaje y gana dinero
              </p>
              <p className="text-white/80 text-sm">
                Comparte tu vehículo y split costs • O busca viaje y ahorra
              </p>
            </div>
          </div>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 bg-white text-amber-600 font-semibold px-6 py-2 rounded-full hover:bg-amber-50 transition-colors"
          >
            Publicar viaje
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const Home2Page = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      <HeroMinimal />
      <EarnMoneyBanner />
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
