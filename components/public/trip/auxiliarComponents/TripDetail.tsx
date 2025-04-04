import {
  AlertCircle,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import TripRouteCompact from "./TripRouteCompact";

const TripDetail = () => {
  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Info principal del viaje */}
      <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <TripRouteCompact
          departureTime="00:20"
          duration="3h40"
          arrivalTime="04:00"
          originCity="Paterna"
          originLocation="Heron City"
          destinationCity="Cerdanyola del Vallès"
          destinationLocation="Bellaterra"
          size="md"
        />
      </div>

      {/* Info del conductor */}
      <div className="p-6 bg-custom-white-100 shadow-sm rounded-lg border border-custom-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-medium text-custom-black-800">
              Mohammed
            </h3>
          </div>
          <ChevronRight className="text-custom-gray-500" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-custom-golden-600" />
          <span className="text-custom-gray-600 text-sm">
            Perfil verificado
          </span>
        </div>

        <div className="mt-4 text-custom-gray-600">
          Pasajeros directo a Montpellier.
        </div>

        <div className="mt-6 flex items-center gap-2 text-custom-gray-600 border-t border-custom-gray-300 pt-4">
          <AlertCircle size={16} className="text-custom-golden-600" />
          <span className="text-sm">
            Tu reserva no se confirmará hasta que Viaje Seguro acepte la
            solicitud
          </span>
        </div>

        <button className="mt-6 w-full flex items-center justify-center gap-2 text-custom-golden-600 border border-custom-golden-600 hover:bg-custom-golden-100 rounded-lg py-2 px-4">
          <MessageCircle size={18} />
          <span>Contactar con Viaje Seguro</span>
        </button>
      </div>
    </div>
  );
};

export default TripDetail;
