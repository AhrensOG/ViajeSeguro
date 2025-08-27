"use client";

import { useState, useEffect } from "react";
import { CarFront, Plus } from "lucide-react";
import { toast } from "sonner";
import CreateVehicleModalPartner from "./auxiliarComponents/CreateVehicleModalPartner";
import VehiclesGrid from "./auxiliarComponents/VehiclesGrid";
import { getUserVehicles } from "@/lib/api/partner/vehicles";
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";

export default function VehiclesPage() {
  const [openModal, setOpenModal] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const userVehicles = await getUserVehicles();
        setVehicles(userVehicles);
      } catch (error) {
        toast.error("Error al cargar los vehículos");
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleVehicleSuccess = () => {
    // Recargar los vehículos después de crear uno nuevo
    const fetchVehicles = async () => {
      try {
        const userVehicles = await getUserVehicles();
        setVehicles(userVehicles);
      } catch (error) {
        toast.error("Error al cargar los vehículos");
      }
    };
    fetchVehicles();
    setOpenModal(false);
  };

  const handleVehicleUpdate = (updatedVehicle: Vehicle) => {
    // Actualizar el vehículo en la lista local
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => 
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
  };

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-golden-600"></div>
        </div>
      </div>
    );
  }

  // Si tiene vehículos, mostrar la grilla
  if (vehicles.length > 0) {
    return (
      <div className="w-full flex flex-col px-0 md:px-6 my-4 pb-10 bg-white">
        <VehiclesGrid 
          vehicles={vehicles} 
          onRegisterClick={() => setOpenModal(true)}
          onVehicleUpdate={handleVehicleUpdate}
        />
        
        {/* Modal */}
        {openModal && (
          <CreateVehicleModalPartner
            onClose={() => setOpenModal(false)}
            onSuccess={handleVehicleSuccess}
          />
        )}
      </div>
    );
  }

  // Si no tiene vehículos, mostrar la vista original
  return (
    <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
      {/* Header + CTA */}
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Mis Vehículos
          </h1>

          {/* CTA desktop */}
          <button
            onClick={() => setOpenModal(true)}
            className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 
                       bg-orange-500 hover:bg-orange-600 text-white font-medium shadow 
                       focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          >
            <Plus className="size-4" />
            Registrar vehículo
          </button>
        </div>

        {/* Aviso de verificación */}
        <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md text-sm">
          <p>
            Todos los vehículos deben registrarse con <strong>datos reales y
            verificables</strong>. Tras nuestra revisión, la administración
            aprobará tu coche y, solo entonces, podrás publicarlo para alquiler.
            Esta medida garantiza la seguridad y confianza de nuestra comunidad.
          </p>
        </div>

        {/* CTA mobile */}
        <button
          onClick={() => setOpenModal(true)}
          className="md:hidden inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 
                     bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow 
                     focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
        >
          <CarFront className="size-4" />
          Registrar vehículo
        </button>
      </div>

      {/* Listado de vehículos (TODO: renderizar acá los vehículos del usuario) */}
      <div className="w-full mt-6">
        {vehicles.length === 0 && (
          <div className="rounded-2xl border border-gray-200 p-8 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-orange-50">
              <CarFront className="size-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Aún no has registrado vehículos
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Registra tu coche con datos reales. Lo revisaremos y, al aprobarlo,
              podrás publicarlo para que lo alquilen.
            </p>
            <button
              onClick={() => setOpenModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 
                         bg-orange-500 hover:bg-orange-600 text-white font-medium shadow 
                         focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            >
              <Plus className="size-4" />
              Registrar vehículo
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {openModal && (
        <CreateVehicleModalPartner
          onClose={() => setOpenModal(false)}
          onSuccess={handleVehicleSuccess}
        />
      )}
    </div>
  );
}
