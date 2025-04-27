import React from "react";
import NavBar from "../navigation/NavBar";
import Hero from "./Hero";
import Services from "./Services";
import Routes from "./Routes";
import CTA from "./CTA";
import Contact from "./Contact";
import Footer from "../navigation/Footer";
import Subscriptions from "./Subscriptions";

const HomePage = () => {
    return (
        <div className="bg-custom-gray-100">
            <NavBar />
            <Hero />
            <Services />
            <Routes />
            <Subscriptions />
            <CTA />
            <Contact />
            <Footer />
        </div>
    );
};

export default HomePage;
