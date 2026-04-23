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
import AuthPromptModal from "@/components/common/AuthPromptModal";

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
            <AuthPromptModal delay={15} />
        </div>
    );
};

export default HomePage;
