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
import SearchFormV1 from "@/lib/client/components/SearchFormV1";
import SearchWrapper from "@/lib/client/components/SearchWhrapper";

const HomePage = () => {
    return (
        <div className="bg-custom-gray-100">
            <NavBar />
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
