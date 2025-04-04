import React from "react";
import NavBar from "../navigation/NavBar";
import Hero from "./Hero";
import Services from "./Services";
import Routes from "./Routes";
import Pricing from "./Pricing";
import CTA from "./CTA";
import Contact from "./Contact";
import Footer from "../navigation/Footer";

const HomePage = () => {
  return (
    <div className="bg-custom-gray-100">
      <NavBar />
      <Hero />
      <Services />
      <Routes />
      <Pricing />
      <CTA />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
