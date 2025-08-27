"use client";

import { useState } from "react";
import { Plus, Filter, Search, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";
import VehicleCard from "./VehicleCard";
import EditVehicleModal from "./EditVehicleModal";

interface VehiclesGridProps {
  vehicles: Vehicle[];
  onRegisterClick: () => void;
  onVehicleUpdate?: (updatedVehicle: Vehicle) => void;
}

export default function VehiclesGrid({ vehicles, onRegisterClick, onVehicleUpdate }: VehiclesGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Calculate stats based on approval status
  const aprobados = vehicles.filter((v) => v.approvalStatus === "APPROVED").length;
  const enRevision = vehicles.filter((v) => v.approvalStatus === "PENDING").length;
  const rechazados = vehicles.filter((v) => v.approvalStatus === "REJECTED").length;

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter((vehicle) =>
    `${vehicle.brand} ${vehicle.model} ${vehicle.plate}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit vehicle
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowEditModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingVehicle(null);
  };

  // Handle vehicle update success
  const handleVehicleUpdateSuccess = (updatedVehicle: Vehicle) => {
    if (onVehicleUpdate) {
      onVehicleUpdate(updatedVehicle);
    }
    handleCloseModal();
  };

  return (
    <div className="flex-1">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Vehículos</h2>
          <p className="text-gray-600">Gestiona tu flota de vehículos registrados</p>
        </div>
        <button
          onClick={onRegisterClick}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 
                     bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-medium shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-custom-golden-300 transition"
        >
          <Plus className="w-4 h-4" />
          Registrar vehículo
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo o matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-golden-400 bg-white"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-8 border-l-4 border-l-amber-400 bg-amber-50 rounded-lg">
        <div className="p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              Todos los vehículos deben registrarse con <strong>datos reales y verificables</strong>. Tras nuestra
              revisión, la administración aprobará tu coche y, solo entonces, podrás publicarlo para alquilar. Esta
              medida garantiza la seguridad y confianza de nuestra comunidad.
            </p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg hover:shadow-lg transition-all cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-700">{aprobados}</p>
                <p className="text-sm font-medium text-emerald-600">Vehículos Aprobados</p>
              </div>
              <div className="bg-emerald-500 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg hover:shadow-lg transition-all cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-700">{enRevision}</p>
                <p className="text-sm font-medium text-amber-600">En Revisión</p>
              </div>
              <div className="bg-amber-500 rounded-full p-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg hover:shadow-lg transition-all cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-700">{rechazados}</p>
                <p className="text-sm font-medium text-red-600">Rechazados</p>
              </div>
              <div className="bg-red-500 rounded-full p-3">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle} 
            onEditClick={handleEditVehicle}
          />
        ))}
      </div>

      {/* Empty State for filtered results */}
      {filteredVehicles.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron vehículos</h3>
          <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        vehicle={editingVehicle}
        isOpen={showEditModal}
        onClose={handleCloseModal}
        onSuccess={handleVehicleUpdateSuccess}
      />
    </div>
  );
}
