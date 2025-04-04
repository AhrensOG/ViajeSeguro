import { ArrowRight } from "lucide-react";

interface Trip {
  id: string;
  departureTime: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
  duration: string;
  price: number;
}

const TripCard = ({ trip }: { trip: Trip }) => {
  const [int, decimal] = trip.price.toFixed(2).split(".");

  return (
    <div className="bg-white rounded-lg shadow-md border border-custom-gray-300 overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center max-w-sm">
            <div className="flex gap-2 items-center">
              <span className="font-bold text-custom-black-700">
                {trip.departureTime}
              </span>
              <div className="w-3 h-3 rounded-full border-2 border-custom-golden-600 bg-white" />
            </div>
            <div className="flex-1 relative">
              <div className="h-1 bg-custom-golden-600 w-full absolute top-1/2 -translate-y-1/2" />
              <div className="text-center text-xs text-custom-gray-600 relative bg-white inline-block px-2 left-1/2 -translate-x-1/2">
                {trip.duration}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 rounded-full border-2 border-custom-golden-600 bg-custom-golden-600" />
              <span className="font-bold text-custom-black-700">
                {trip.arrivalTime}
              </span>
            </div>
          </div>
          <div className="max-w-sm flex justify-between text-custom-gray-800 font-semibold text-sm">
            <div>{trip.departureLocation}</div>
            <div>{trip.arrivalLocation}</div>
          </div>
        </div>

        <div className="flex items-center justify-end md:w-32">
          <div className="text-right">
            <div className="font-bold text-2xl text-custom-black-700">
              {int}
              <span className="text-sm align-top"> ,{decimal}</span> €
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-custom-gray-300 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-custom-gray-700">
            Viaje Seguro
          </span>
        </div>
        <button className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-medium rounded-lg px-4 py-2 flex items-center">
          Reservar
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TripCard;
