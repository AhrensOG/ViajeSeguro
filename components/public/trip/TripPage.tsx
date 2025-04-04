"use client";

import NavBar from "@/components/public/navigation/NavBar";
import TripDetail from "./auxiliarComponents/TripDetail";
import BookingSidebar from "./auxiliarComponents/BookingSidebar";
import Footer from "../navigation/Footer";

const TripPage = () => {
  return (
    <div className="bg-custom-white-50 flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-custom-black-800 mb-6">
          Domingo, 6 de abril
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TripDetail />
          <BookingSidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TripPage;
