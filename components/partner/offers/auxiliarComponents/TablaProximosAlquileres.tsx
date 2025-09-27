"use client"
/* eslint-disable @next/next/no-img-element */

import { Clock, MapPin, Phone, CheckCircle } from "lucide-react"
import { markBookingAsDelivered, saveDeliveryPhotos } from "@/lib/api/vehicle-booking"
import { toast } from "sonner"
import { useState } from "react"
import DeliveryCaptureModal from "./DeliveryCaptureModal"

interface ProximoAlquiler {
  id: string
  vehicleName: string
  vehicleImage: string
  vehiclePlate: string
  renterName: string
  renterAvatar?: string
  renterPhone: string
  startDate: string
  endDate: string
  totalAmount: number
  daysUntilStart: number
  status: "pending" | "confirmed" | "rejected" | "approved" | "APPROVED" | "CONFIRMED" | "DELIVERED" | "delivered" | "PENDING"
  location: string
}

interface TablaProximosAlquileresProps {
  rentals: ProximoAlquiler[]
  onRentalUpdate?: () => void
}

export function TablaProximosAlquileres({ rentals, onRentalUpdate }: TablaProximosAlquileresProps) {
  const [loadingDelivery, setLoadingDelivery] = useState<string | null>(null)
  const [deliveredRentals, setDeliveredRentals] = useState<Set<string>>(new Set())
  const [captureOpen, setCaptureOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  // Filtrar alquileres aprobados o entregados desde hoy en adelante
  const confirmedRentals = rentals.filter(rental => {
    // Estados válidos para mostrar (solo APPROVED/CONFIRMED y DELIVERED; excluir PENDING)
    const isApproved = rental.status === 'approved' || 
                      rental.status === 'confirmed' ||
                      rental.status === 'APPROVED'
    const isDelivered = rental.status === 'DELIVERED' || 
                       rental.status === 'delivered'
    
    // Fecha de hoy o futura (usar daysUntilStart ya calculado)
    const isTodayOrFuture = rental.daysUntilStart >= 0
    
    // Debug para verificar filtrado
    console.log('TablaProximosAlquileres Filter:', {
      id: rental.id,
      status: rental.status,
      daysUntilStart: rental.daysUntilStart,
      isApproved,
      isDelivered,
      isTodayOrFuture,
      willShow: (isApproved || isDelivered) && isTodayOrFuture
    })
    
    return (isApproved || isDelivered) && isTodayOrFuture
  })

  console.log('TablaProximosAlquileres - Total:', rentals.length, 'Approved future:', confirmedRentals.length)

  // Si no hay alquileres aprobados futuros, no mostrar la tabla
  if (confirmedRentals.length === 0) {
    return null
  }

  const getStatusBadge = (daysUntilStart: number) => {
    if (daysUntilStart <= 1) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Mañana</span>
    }
    if (daysUntilStart <= 3) {
      return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">En {daysUntilStart} días</span>
    }
    if (daysUntilStart <= 7) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">En {daysUntilStart} días</span>
    }
    return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Confirmado</span>
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  const openCaptureFlow = (rentalId: string) => {
    setSelectedBookingId(rentalId)
    setCaptureOpen(true)
  }

  const handleCaptureComplete = async (urls: string[]) => {
    if (!selectedBookingId) return
    try {
      setLoadingDelivery(selectedBookingId)
      // Guardar URLs de fotos de entrega antes de marcar entregado
      try {
        await saveDeliveryPhotos(selectedBookingId, urls)
      } catch (e: unknown) {
        console.warn('saveDeliveryPhotos failed, proceeding anyway:', e)
        toast.message("Fotos subidas", {
          description: "No se pudieron registrar en el servidor, pero se continuará con la entrega."
        })
      }
      await markBookingAsDelivered(selectedBookingId)
      // Actualizar UI local
      setDeliveredRentals(prev => new Set([...prev, selectedBookingId]))
      toast.success("🚗 Vehículo entregado exitosamente al cliente")
      onRentalUpdate?.()
    } catch (error) {
      console.error('Error al marcar como entregado:', error)
      toast.error("Error al marcar vehículo como entregado")
    } finally {
      setLoadingDelivery(null)
      setSelectedBookingId(null)
    }
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
      <div className="p-6 pb-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Próximos Alquileres
        </h3>
      </div>
      <div className="p-6">
        {confirmedRentals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No hay próximos alquileres</p>
            <p className="text-sm">Los alquileres aprobados aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {confirmedRentals.map((rental) => {
              const isDelivered = rental.status === 'DELIVERED' || rental.status === 'delivered' || deliveredRentals.has(rental.id);
              
              return (
              <div key={rental.id} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                {/* Imagen del vehículo */}
                <div className="flex-shrink-0">
                  <img
                    src={rental.vehicleImage || "/placeholder-vehicle.jpg"}
                    alt={rental.vehicleName}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                </div>

                {/* Información del vehículo */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{rental.vehicleName}</h4>
                  <p className="text-sm text-gray-600">Placa: {rental.vehiclePlate}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">{rental.location}</span>
                  </div>
                </div>

                {/* Información del cliente */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {rental.renterAvatar && (
                      <img
                        src={rental.renterAvatar}
                        alt={rental.renterName}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{rental.renterName}</p>
                      <p className="text-sm text-gray-600">{rental.renterPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Fechas y duración */}
                <div className="flex-1 min-w-0 text-center">
                  <p className="text-sm font-medium text-gray-900">
                    {rental.startDate} - {rental.endDate}
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(rental.daysUntilStart)}
                  </div>
                </div>

                {/* Precio total */}
                <div className="flex-shrink-0 text-right">
                  <p className="font-semibold text-lg text-gray-900">€{rental.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>

                <div className="flex-shrink-0">

                  {/* Acciones */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                      onClick={() => handleCall(rental.renterPhone)}
                      className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      title="Llamar al cliente"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                    {/* Solo mostrar botón de entrega si NO está entregado */}
                    {!isDelivered && (
                      <button 
                        onClick={() => openCaptureFlow(rental.id)}
                        disabled={loadingDelivery === rental.id}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 min-w-[140px] sm:min-w-[160px]"
                        title="Marcar vehículo como entregado al cliente"
                      >
                        {loadingDelivery === rental.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span className="text-sm font-medium hidden sm:inline">Entregando...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium hidden sm:inline">Marcar Entregado</span>
                            <span className="text-xs font-medium sm:hidden">Entregar</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {/* Mostrar estado entregado si ya fue entregado */}
                    {isDelivered && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg shadow-md min-w-[140px] sm:min-w-[160px] animate-pulse" title="Vehículo entregado exitosamente">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium hidden sm:inline">✅ Entregado</span>
                        <span className="text-xs font-medium sm:hidden">✅ OK</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Modal de captura de fotos para entrega */}
      <DeliveryCaptureModal
        isOpen={captureOpen}
        bookingId={selectedBookingId}
        onClose={() => setCaptureOpen(false)}
        onComplete={handleCaptureComplete}
      />
    </div>
  )
}
