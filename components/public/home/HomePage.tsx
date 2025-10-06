"use client";
import React from "react";
import NavBar from "../navigation/NavBar";
import Hero from "./Hero";
import Services from "./Services";
import Routes from "./Routes";
import CTA from "./CTA";
import Contact from "./Contact";
import Footer from "../navigation/Footer";
import Subscriptions from "./Subscriptions";
import SearchWrapper from "@/lib/client/components/SearchWhrapper";
import ReferralBanner from "@/components/common/ReferralBanner";

const HomePage = () => {
    return (
        <div className="bg-custom-gray-100">
            <NavBar />
            <ReferralBanner />
            <Hero />
            <SearchWrapper />
            <Subscriptions />
            <Routes />
            <Services />
            <CTA />
            <Contact />
            <Footer />
        </div>
    );
};

export default HomePage;
