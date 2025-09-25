"use client"

import { Check, X, Calendar, MapPin, User, Euro } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface RentalBooking {
  id: string
  renterName: string
  renterEmail: string
  vehicleName: string
  startDate: string
  endDate: string
  totalPrice: number
  status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED" | "COMPLETED" | "FINISHED"
  withdrawLocation: string
  returnLocation: string
}

interface RentalBookingCardProps {
  booking: RentalBooking
  onStatusUpdate: (bookingId: string, newStatus: string) => Promise<void>
}

export function RentalBookingCard({ booking, onStatusUpdate }: RentalBookingCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleApprove = async () => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(booking.id, "APPROVED")
      toast.success("Alquiler aprobado exitosamente")
    } catch {
      toast.error("Error al aprobar el alquiler")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDecline = async () => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(booking.id, "DECLINED")
      toast.success("Alquiler rechazado")
    } catch {
      toast.error("Error al rechazar el alquiler")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium" },
      APPROVED: { label: "Aprobado", color: "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium" },
      DECLINED: { label: "Rechazado", color: "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium" },
      CANCELLED: { label: "Cancelado", color: "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium" },
      COMPLETED: { label: "Completado", color: "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium" },
      FINISHED: { label: "Finalizado", color: "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    return (
      <span className={config.color}>
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const canApproveOrDecline = booking.status === "PENDING"

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{booking.vehicleName}</h3>
          {getStatusBadge(booking.status)}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Información del cliente */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <p className="font-medium">{booking.renterName}</p>
            <p className="text-sm text-gray-600">{booking.renterEmail}</p>
          </div>
        </div>

        {/* Fechas */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </span>
        </div>

        {/* Ubicaciones */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-500" />
            <span className="text-sm">Recogida: {booking.withdrawLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-sm">Devolución: {booking.returnLocation}</span>
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center gap-2">
          <Euro className="h-4 w-4 text-gray-500" />
          <span className="font-semibold text-lg">
            {booking.totalPrice.toFixed(2).replace('.', ',')} €
          </span>
        </div>

        {/* Botones de acción */}
        {canApproveOrDecline && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApprove}
              disabled={isUpdating}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Aprobar
            </button>
            <button
              onClick={handleDecline}
              disabled={isUpdating}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
