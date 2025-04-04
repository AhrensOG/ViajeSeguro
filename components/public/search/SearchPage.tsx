"use client";

import { Suspense } from "react";
import SearchBarSkeleton from "./auxiliarComponents/SearchBarSkeleton";
import SearchBar from "./auxiliarComponents/SearchBar";
import TripCard from "./auxiliarComponents/TripCard";
import NavBar from "../navigation/NavBar";
import Image from "next/image";

const trips = [
  {
    id: "trip1",
    departureTime: "00:20",
    arrivalTime: "04:00",
    departureLocation: "Paterna",
    arrivalLocation: "Cerdanyola del Vallès",
    duration: "3h40",
    price: 27.50,
  },
  {
    id: "trip2",
    departureTime: "07:10",
    arrivalTime: "11:10",
    departureLocation: "Mislata",
    arrivalLocation: "Santa Perpetua de Mogoda",
    duration: "4h00",
    price: 27.50,
  },
  {
    id: "trip3",
    departureTime: "08:00",
    arrivalTime: "11:50",
    departureLocation: "Valencia",
    arrivalLocation: "Barcelona",
    duration: "3h50",
    price: 27.50,
  },
  {
    id: "trip4",
    departureTime: "09:00",
    arrivalTime: "12:40",
    departureLocation: "Paterna",
    arrivalLocation: "Barcelona",
    duration: "3h40",
    price: 27.50,
  },
  {
    id: "trip5",
    departureTime: "09:05",
    arrivalTime: "12:20",
    departureLocation: "Valencia Joaquín Sorolla",
    arrivalLocation: "Barcelona-Sants",
    duration: "3h15",
    price: 27.50,
  },
];

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-custom-white-50">
      <NavBar shadow={false} />
      <Suspense fallback={<SearchBarSkeleton />}>
        <SearchBar />
      </Suspense>

      <div className="container mx-auto px-4 py-4 flex gap-2 grow h-[calc(100vh-316px)] sm:h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)]">
        <div className="w-1/3 relative rounded-md overflow-hidden hidden lg:block">
          <Image src="/main/main.webp" alt="Map" fill />
        </div>
        <div className="w-full lg:w-2/3 space-y-4 overflow-y-auto scrollbar-none">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
