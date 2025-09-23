"use client"

import { useState, useEffect } from "react"
import { RentalBookingCard } from "./RentalBookingCard"
import { fetchWithAuth } from "@/lib/functions"
import { BACKEND_URL } from "@/lib/constants"
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

interface RentalBookingsSectionProps {
  className?: string
}

export function RentalBookingsSection({ className }: RentalBookingsSectionProps) {
  const [bookings, setBookings] = useState<RentalBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true)
      // Endpoint para obtener las reservas de las ofertas del usuario
      const response = await fetchWithAuth<Array<{
        id: string;
        renter: { name: string; lastName: string; email: string };
        offer: { vehicle: { brand: string; model: string; year: number }; withdrawLocation: string; returnLocation: string };
        startDate: string;
        endDate: string;
        totalPrice: number;
        status: RentalBooking["status"];
      }>>(`${BACKEND_URL}/vehicle-booking/user-bookings`)
      
      const transformedBookings: RentalBooking[] = response.map((booking) => ({
        id: booking.id,
        renterName: `${booking.renter.name} ${booking.renter.lastName}`,
        renterEmail: booking.renter.email,
        vehicleName: `${booking.offer.vehicle.brand} ${booking.offer.vehicle.model} (${booking.offer.vehicle.year})`,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
        withdrawLocation: booking.offer.withdrawLocation,
        returnLocation: booking.offer.returnLocation
      }))

      setBookings(transformedBookings)
    } catch (error) {
      console.error("Error fetching user bookings:", error)
      toast.error("Error al cargar las reservas")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/update-status/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      // Actualizar el estado local
      setBookings(prev => prev.map(booking => booking.id === bookingId ? { ...booking, status: newStatus as RentalBooking["status"] } : booking))
    } catch (error) {
      console.error("Error updating booking status:", error)
      throw error
    }
  }

  useEffect(() => {
    fetchUserBookings()
  }, [])

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Alquiler</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-golden-500"></div>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Alquiler</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">No tienes solicitudes de alquiler pendientes</p>
        </div>
      </div>
    )
  }

  const pendingBookings = bookings.filter(b => b.status === "PENDING")
  const otherBookings = bookings.filter(b => b.status !== "PENDING")

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Alquiler</h2>
      
      {pendingBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Pendientes de Aprobación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingBookings.map((booking) => (
              <RentalBookingCard
                key={booking.id}
                booking={booking}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {otherBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Historial de Reservas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherBookings.map((booking) => (
              <RentalBookingCard
                key={booking.id}
                booking={booking}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
