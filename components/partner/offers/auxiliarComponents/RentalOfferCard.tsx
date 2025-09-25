"use client"

import { Edit, Trash2, Eye, MapPin, Calendar, Users, Clock, Car } from "lucide-react"
import Image from "next/image"

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

interface RentalOfferCardProps {
  offer: RentalOffer
  onEdit: (offer: RentalOffer) => void
  onView?: (offer: RentalOffer) => void
  onDelete?: (offer: RentalOffer) => void
}

export function RentalOfferCard({ offer, onEdit, onView, onDelete }: RentalOfferCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Disponible
          </span>
        )
      case "RENTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Alquilado
          </span>
        )
      case "UNAVAILABLE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            No Disponible
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    })
    return timeString ? `${date} ${timeString}` : date
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      {/* Header con imagen */}
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          {offer.vehicleImage ? (
            <Image
              src={offer.vehicleImage}
              alt={offer.vehicleName}
              width={400}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          {getStatusBadge(offer.status)}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4">
        {/* Información del vehículo */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{offer.vehicleName}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {offer.withdrawLocation}
          </div>
        </div>

        {/* Precio y tipo */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-custom-golden-600">€{offer.pricePerDay}</p>
            <p className="text-sm text-gray-600">por día</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {offer.vehicleOfferType === "WITH_DRIVER" ? "Con conductor" : "Sin conductor"}
            </p>
          </div>
        </div>

        {/* Información de fechas importantes */}
        {offer.currentRental && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-blue-800">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-medium">Entrega programada:</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              {formatDateTime(offer.currentRental.returnDate, offer.currentRental.returnTime)} en {offer.currentRental.location}
            </p>
          </div>
        )}

        {offer.nextPickup && (
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-green-800">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-medium">Próxima reserva:</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {formatDateTime(offer.nextPickup.date, offer.nextPickup.time)} en {offer.nextPickup.location}
            </p>
          </div>
        )}

        {/* Estadísticas */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(offer.availableFrom)} - {formatDate(offer.availableTo)}
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            {offer.totalBookings} reservas
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(offer)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
          <button
            onClick={() => onView?.(offer)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </button>
          <button
            onClick={() => onDelete?.(offer)}
            className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
