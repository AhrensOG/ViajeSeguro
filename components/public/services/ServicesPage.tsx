"use client";

import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import HeroSection from "./auxiliarComponents/HeroSection";
import CurrentService from "./auxiliarComponents/CurrentService";
import CTASection from "./auxiliarComponents/CTASection";
import ComingSoonServices from "./auxiliarComponents/ComingSoonServices";
import VehicleBookingService from "./auxiliarComponents/VehicleBookingService";

const ServicesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-custom-white-50 text-custom-black-900">
      <NavBar />
      <HeroSection />
      <CurrentService />
      <VehicleBookingService />
      <ComingSoonServices />
      <CTASection />
      <Footer />
    </div>
  );
};

export default ServicesPage;
