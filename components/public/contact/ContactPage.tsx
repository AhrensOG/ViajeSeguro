"use client";

import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import ContactForm from "./auxiliarComponents/ContactForm";
import ContactInformation from "./auxiliarComponents/ContactInformation";
import HeroSection from "./auxiliarComponents/HeroSection";

const ContactPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[--color-custom-white-50] text-[--color-custom-black-900]">
      <NavBar />
      <HeroSection />
      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <ContactForm />
            <ContactInformation />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
