"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, MapPin, Calendar, DollarSign, Users, Car, Clock } from "lucide-react"
import { RentalOfferCard } from "./RentalOfferCard"

interface RentalOffer {
  id: string
  vehicleId: string
  vehicleName: string
  vehicleImage: string
  pricePerDay: number
  withdrawLocation: string
  returnLocation: string
  availableFrom: string
  availableTo: string
  status: "AVAILABLE" | "UNAVAILABLE" | "RENTED"
  totalBookings: number
  vehicleOfferType: "WITH_DRIVER" | "WITHOUT_DRIVER"
  conditions?: string
  createdAt: string
  // Información de próximas reservas
  nextPickup?: {
    date: string
    time: string
    location: string
  }
  currentRental?: {
    returnDate: string
    returnTime: string
    location: string
  }
}

interface RentalOffersGridProps {
  offers: RentalOffer[]
  onCreateOffer: () => void
  onEditOffer: (offer: RentalOffer) => void
  onViewOffer?: (offer: RentalOffer) => void
  onDeleteOffer?: (offer: RentalOffer) => void
}

export function RentalOffersGrid({ 
  offers, 
  onCreateOffer, 
  onEditOffer, 
  onViewOffer, 
  onDeleteOffer 
}: RentalOffersGridProps) {
  const [filter, setFilter] = useState<"all" | "AVAILABLE" | "RENTED" | "UNAVAILABLE">("all")

  const filteredOffers = offers.filter((offer) => filter === "all" || offer.status === filter)

  const stats = {
    total: offers.length,
    available: offers.filter((o) => o.status === "AVAILABLE").length,
    rented: offers.filter((o) => o.status === "RENTED").length,
    unavailable: offers.filter((o) => o.status === "UNAVAILABLE").length,
  }

  // Ofertas con entregas próximas (próximas 7 días)
  const upcomingReturns = offers.filter(offer => {
    if (!offer.currentRental) return false
    const returnDate = new Date(offer.currentRental.returnDate)
    const today = new Date()
    const diffTime = returnDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  }).length

  // Próximas reservas (próximos 7 días)
  const upcomingPickups = offers.filter(offer => {
    if (!offer.nextPickup) return false
    const pickupDate = new Date(offer.nextPickup.date)
    const today = new Date()
    const diffTime = pickupDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  }).length

  return (
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Ofertas de Alquiler</h1>
          <p className="text-gray-600 mt-2">Gestiona y optimiza tus ofertas activas</p>
        </div>
        <button 
          onClick={onCreateOffer}
          className="inline-flex items-center px-4 py-2 bg-custom-golden-500 hover:bg-custom-golden-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Oferta
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ofertas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-custom-golden-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-custom-golden-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alquilados</p>
              <p className="text-2xl font-bold text-blue-600">{stats.rented}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">No Disponibles</p>
              <p className="text-2xl font-bold text-red-600">{stats.unavailable}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de próximas actividades */}
      {(upcomingReturns > 0 || upcomingPickups > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingReturns > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Entregas Próximas</h3>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {upcomingReturns} vehículo{upcomingReturns > 1 ? 's' : ''} para entregar en los próximos 7 días
              </p>
            </div>
          )}
          
          {upcomingPickups > 0 && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-900">Próximas Reservas</h3>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {upcomingPickups} reserva{upcomingPickups > 1 ? 's' : ''} programada{upcomingPickups > 1 ? 's' : ''} en los próximos 7 días
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-custom-golden-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Todas ({stats.total})
        </button>
        <button
          onClick={() => setFilter("AVAILABLE")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "AVAILABLE"
              ? "bg-custom-golden-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Disponibles ({stats.available})
        </button>
        <button
          onClick={() => setFilter("RENTED")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "RENTED"
              ? "bg-custom-golden-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Alquilados ({stats.rented})
        </button>
        <button
          onClick={() => setFilter("UNAVAILABLE")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "UNAVAILABLE"
              ? "bg-custom-golden-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          No Disponibles ({stats.unavailable})
        </button>
      </div>

      {/* Grid de ofertas */}
      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <RentalOfferCard
              key={offer.id}
              offer={offer}
              onEdit={onEditOffer}
              onView={onViewOffer}
              onDelete={onDeleteOffer}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === "all" ? "No tienes ofertas publicadas" : `No hay ofertas ${filter.toLowerCase()}`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === "all" 
              ? "Crea tu primera oferta para comenzar a generar ingresos con tus vehículos"
              : "Cambia el filtro para ver otras ofertas"
            }
          </p>
          {filter === "all" && (
            <button 
              onClick={onCreateOffer}
              className="inline-flex items-center px-4 py-2 bg-custom-golden-500 hover:bg-custom-golden-600 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Oferta
            </button>
          )}
        </div>
      )}
    </div>
  )
}
