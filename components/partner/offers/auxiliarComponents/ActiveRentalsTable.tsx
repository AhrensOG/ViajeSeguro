"use client"
/* eslint-disable @next/next/no-img-element */

import { CalendarDays, MapPin, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { confirmVehicleReturn } from "@/lib/api/vehicle-booking"
import { toast } from "sonner"
import DeliveryCaptureModal from "./DeliveryCaptureModal"

interface ActiveRental {
  id: string
  vehicleName: string
  vehicleImage: string
  vehiclePlate?: string
  renterName: string
  renterAvatar?: string
  renterPhone: string
  startDate: string
  endDate: string
  totalAmount: number
  status: "ACTIVE" | "RETURNED" | "overdue" | "ending-soon"
  location: string
}

interface ActiveRentalsTableProps {
  rentals: ActiveRental[]
}

export function ActiveRentalsTable({ rentals }: ActiveRentalsTableProps) {
  const [loadingConfirm, setLoadingConfirm] = useState<Set<string>>(new Set())
  const [visibleRentals, setVisibleRentals] = useState<ActiveRental[]>(rentals)
  const [captureOpen, setCaptureOpen] = useState(false)
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null)

  // Mantener el estado local sincronizado con las props
  useEffect(() => {
    setVisibleRentals(rentals)
  }, [rentals])

  console.log('🔍 ActiveRentalsTable DEBUG:', {
    totalRentals: visibleRentals.length,
    rentalsData: visibleRentals,
    statuses: visibleRentals.map(r => ({ id: r.id, status: r.status, type: typeof r.status }))
  })

  // Filtrar reservas con estado ACTIVE y RETURNED
  const activeRentals = visibleRentals.filter(rental =>
    rental.status === 'ACTIVE' || rental.status === 'RETURNED'
  )

  console.log('🎯 Filtered ACTIVE and RETURNED rentals:', activeRentals)

  // Si no hay reservas activas o devueltas, no mostrar
  if (activeRentals.length === 0) {
    console.log('❌ No ACTIVE or RETURNED rentals found, component will not render')
    return null
  }

  // (UI simplificada) Si se requiere expandir filas en el futuro, reactivar estado y handler

  const openCaptureFlow = (rentalId: string) => {
    setSelectedRentalId(rentalId)
    setCaptureOpen(true)
  }

  const handleCaptureComplete = async (urls: string[]) => {
    void urls;
    if (!selectedRentalId) return
    const rentalId = selectedRentalId
    try {
      setLoadingConfirm(prev => new Set(prev).add(rentalId))
      await confirmVehicleReturn(rentalId)
      toast.success("¡Recepción confirmada! El alquiler ha finalizado")
      // Eliminar de la vista local para evitar necesidad de refrescar la página
      setVisibleRentals(prev => prev.filter(r => r.id !== rentalId))
    } catch (error) {
      console.error('Error al confirmar recepción:', error)
      toast.error("Error al confirmar la recepción del vehículo")
    } finally {
      setLoadingConfirm(prev => {
        const newSet = new Set(prev)
        newSet.delete(rentalId)
        return newSet
      })
      setCaptureOpen(false)
      setSelectedRentalId(null)
    }
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  const getStatusBadge = (status: ActiveRental["status"]) => {
    switch (status) {
      case "ACTIVE":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Activo</span>
      case "RETURNED":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Devuelto</span>
      case "overdue":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Vencido</span>
      case "ending-soon":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Termina Pronto</span>
    }
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
      <div className="p-6 pb-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          Alquileres Activos
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activeRentals.map((rental) => (
            <div
              key={rental.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={rental.vehicleImage || "/placeholder.svg"}
                  alt={rental.vehicleName}
                  className="w-16 h-12 object-cover rounded-md"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{rental.vehicleName}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {rental.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {rental.renterAvatar ? (
                      <img src={rental.renterAvatar} alt={rental.renterName} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">{rental.renterName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{rental.renterName}</p>
                    <p className="text-gray-600">{rental.renterPhone}</p>
                  </div>
                </div>

                <div className="text-sm text-center">
                  <p className="font-medium">{rental.startDate}</p>
                  <p className="text-gray-600">hasta {rental.endDate}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-blue-600">${rental.totalAmount}</p>
                  <p className="text-[10px] text-gray-500 leading-3 mt-1 mb-1 max-w-[120px]">
                    200km/día incluidos<br />Exceso 0,50€/km
                  </p>
                  {getStatusBadge(rental.status)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCall(rental.renterPhone)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                  {rental.status === "RETURNED" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCaptureFlow(rental.id);
                      }}
                      disabled={loadingConfirm.has(rental.id)}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
                    >
                      {loadingConfirm.has(rental.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                          Confirmando...
                        </>
                      ) : (
                        "Confirmar Recepción"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal de captura obligatorio para confirmar recepción */}
      <DeliveryCaptureModal
        isOpen={captureOpen}
        bookingId={selectedRentalId}
        onClose={() => setCaptureOpen(false)}
        onComplete={handleCaptureComplete}
        phase="OWNER_POST"
      />
    </div>
  )
}
