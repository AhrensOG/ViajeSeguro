"use client";

import NavBar from "@/components/public/navigation/NavBar";
import Footer from "../navigation/Footer";
import TripProcess from "./auxiliarComponents/TripProcess";
import { Suspense } from "react";

const TripPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Suspense fallback={<div></div>}>
        <TripProcess />
      </Suspense>
      <Footer />
    </div>
  );
};

export default TripPage;
