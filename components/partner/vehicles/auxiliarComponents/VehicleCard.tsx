"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, Edit, Trash2, Star, MapPin, Users, Fuel, Settings, Calendar, AlertTriangle } from "lucide-react";
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEditClick?: (vehicle: Vehicle) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          Aprobado
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          En Revisión
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rechazado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Desconocido
        </span>
      );
  }
};

const getTransmissionLabel = (transmission: string) => {
  return transmission === "MANUAL" ? "Manual" : "Automática";
};

const getFuelLabel = (fuel: string) => {
  const fuelMap: Record<string, string> = {
    DIESEL: "Diésel",
    GASOLINE: "Gasolina", 
    ELECTRIC: "Eléctrico",
    HYBRID: "Híbrido"
  };
  return fuelMap[fuel] || fuel;
};

const getServiceTypeLabel = (serviceType: any) => {
  const serviceMap: Record<string, string> = {
    SIMPLE_TRIP: "Viaje simple",
    RENTAL_WITH_DRIVER: "Con chofer",
    RENTAL_WITHOUT_DRIVER: "Sin chofer"
  };
  return serviceMap[String(serviceType)] || String(serviceType);
};

export default function VehicleCard({ vehicle, onEditClick }: VehicleCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick(vehicle);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Vehicle Image */}
      <div className="relative h-48 bg-gray-100">
        {vehicle.images && vehicle.images.length > 0 && !imageError ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 17h14v2H5zm1.5-4.5h11l-2-6h-7l-2 6zm-.5-8h12l3 9v3h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H2v-3l3-9z"/>
                </svg>
              </div>
              <p className="text-sm text-gray-500">Sin imagen</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {getStatusBadge(vehicle.approvalStatus)}
        </div>
      </div>

      {/* Vehicle Info - Flex grow para ocupar espacio disponible */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title and Year */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Placa:</span>
              <span>{vehicle.plate || "Sin placa"}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{vehicle.capacity} pasajeros</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Fuel className="w-4 h-4" />
            <span>{getFuelLabel(vehicle.fuelType)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Settings className="w-4 h-4" />
            <span>{getTransmissionLabel(vehicle.transmissionType)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{getServiceTypeLabel(vehicle.serviceType)}</span>
          </div>
        </div>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Características:</p>
            <div className="flex flex-wrap gap-1">
              {vehicle.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                >
                  {feature.replace('_', ' ')}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                  +{vehicle.features.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rejection Reason */}
        {vehicle.approvalStatus === "REJECTED" && vehicle.rejectionReason && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">Motivo del rechazo:</p>
                <p className="text-sm text-red-700">{vehicle.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Spacer para empujar los botones hacia abajo */}
        <div className="flex-1"></div>
        
        {/* Footer con fecha y botones de acción */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          {/* Fecha de subida */}
          <div className="flex-1">
            <p className="text-sm text-gray-500">
              {new Date(vehicle.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-2">
            <button 
              onClick={handleEditClick}
              className="inline-flex items-center justify-center p-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center justify-center p-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
