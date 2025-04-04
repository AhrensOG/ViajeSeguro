// Archivo: components/trip/BookingSidebar.tsx

import { Calendar1Icon, ChevronRight } from "lucide-react";
import TripRouteCompact from "./TripRouteCompact";

const BookingSidebar = () => {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <h2 className="text-xl font-bold text-custom-black-700 mb-4">
          Domingo, 6 de abril
        </h2>

        {/* Trip summary */}
        <TripRouteCompact
          departureTime="00:20"
          duration="3h40"
          arrivalTime="04:00"
          originCity="Valencia"
          originLocation="Valencia"
          destinationCity="Madrid"
          destinationLocation="Madrid"
          size="md"
        />

        <div className="flex items-center gap-3 mt-4 mb-6">
          <span className="font-medium">Mohammed</span>
        </div>

        <div className="flex items-center justify-between border-t border-b border-custom-gray-300 py-4 my-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Importe</span>
            <ChevronRight size={16} className="text-custom-gray-500" />
          </div>
          <div className="text-2xl font-bold text-custom-black-800">
            66<span className="text-sm align-top">,98</span> €
          </div>
        </div>

        <button className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 py-4 mt-4 rounded-lg flex items-center justify-center">
          <Calendar1Icon size={16} className="mr-2" />
          Enviar solicitud
        </button>
      </div>
    </div>
  );
};

export default BookingSidebar;
