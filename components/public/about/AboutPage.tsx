import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import HeroSection from "./auxiliarComponents/HeroSection";
import OurStorySection from "./auxiliarComponents/OurStorySection";
import FoundersSection from "./auxiliarComponents/FoundersSection";
import ProblemWeSolveSection from "./auxiliarComponents/ProblemWeSolveSection";
import OurValuesSection from "./auxiliarComponents/OurValuesSection";
import OurMissionSection from "./auxiliarComponents/OurMissionSection";
import TeamSection from "./auxiliarComponents/TeamSection";
import MilestonesSection from "./auxiliarComponents/MilestonesSection";
import CTASection from "./auxiliarComponents/CTASection";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-custom-white-50 text-custom-black-900">
      <NavBar />
      <HeroSection />
      <OurStorySection />
      <FoundersSection />
      <ProblemWeSolveSection />
      <OurValuesSection />
      <OurMissionSection />
      <TeamSection />
      <MilestonesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default AboutPage;
