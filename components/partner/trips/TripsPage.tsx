import { useState } from "react";
import { Route, PlusCircle } from "lucide-react";
import CreateTripModalPartner from "./CreateTripModalPartner";
import PartnerTripsList from "./PartnerTripsList";

export default function TripsPage() {
  const [open, setOpen] = useState(false);
  const [hasTrips, setHasTrips] = useState<boolean>(false);
  return (
    <div className="w-full flex flex-col items-center px-4 md:px-6 my-6 pb-12">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-custom-black-800 mb-2">Mis Viajes</h1>
        <p className="text-custom-gray-700 mb-6">Publica trayectos para ofrecer plazas a tus clientes y optimizar tus recorridos.</p>

        {!hasTrips && (
          <div className="w-full rounded-2xl border border-custom-gray-200 bg-custom-white-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Route className="h-5 w-5 text-custom-golden-700" />
                  <h2 className="text-xl font-semibold text-custom-black-800">Publica tu primer viaje</h2>
                </div>
                <p className="text-sm text-custom-gray-700">
                  Define un origen y destino, la fecha y el número de plazas disponibles. Podrás gestionar reservas, contactar pasajeros y optimizar ingresos.
                </p>
                <ul className="mt-4 space-y-1 text-sm text-custom-gray-700 list-disc pl-5">
                  <li>Elige ciudades y horarios inteligentes</li>
                  <li>Gestiona reservas desde tu panel</li>
                  <li>Comunícate fácilmente con tus pasajeros</li>
                </ul>
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg bg-custom-golden-700 hover:bg-custom-golden-800 text-white font-medium shadow-sm transition cursor-pointer"
                >
                  <PlusCircle className="h-5 w-5" /> Publicar mi primer viaje
                </button>
              </div>
              <div className="hidden md:block">
                <div className="rounded-xl border border-custom-gray-200 bg-gradient-to-br from-custom-golden-50 to-white p-6 h-full flex items-center justify-center">
                  <Route className="h-16 w-16 text-custom-golden-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <PartnerTripsList
          onRequestCreate={() => setOpen(true)}
          onItemsLoaded={(count) => setHasTrips(count > 0)}
        />
      </div>
      {open && (
        <CreateTripModalPartner
          onClose={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      )}
    </div>
  );
}
