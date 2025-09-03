"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { RentalOffersEmpty } from "./auxiliarComponents/RentalOffersEmpty"
import { RentalOffersGrid } from "./auxiliarComponents/RentalOffersGrid"
import CreateOfferModal from "./auxiliarComponents/CreateOfferModal"
import EditOfferModal from "./auxiliarComponents/EditOfferModal"
import { EstadisticasDashboardAlquileres } from "./auxiliarComponents/EstadisticasDashboardAlquileres"
import { RentalBookingsSection } from "./auxiliarComponents/RentalBookingsSection"
import { TablaProximosAlquileres } from "./auxiliarComponents/TablaProximosAlquileres"
import { TablaPendientesAprobacion } from "./auxiliarComponents/TablaPendientesAprobacion"
import { ActiveRentalsTable } from "./auxiliarComponents/ActiveRentalsTable"
import { TablaHistorialPagos } from "./auxiliarComponents/TablaHistorialPagos"
import { RentalHistoryTable } from "./auxiliarComponents/RentalHistoryTable"
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type"
import { getUserVehicles } from "@/lib/api/partner/vehicles"
import { VehicleOffersAdminResponse } from "@/lib/api/admin/vehicle-offers/vehicleOffers.types"
import { fetchWithAuth } from "@/lib/functions"
import { BACKEND_URL } from "@/lib/constants"
import { getPartnerEarnings, getPartnerUpcomingBookings } from "@/lib/api/vehicle-booking"
import { PartnerEarningsResponse } from "@/lib/api/vehicle-booking/vehicleBooking.types"

// Tipo adaptado para las ofertas del usuario
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
  // Información de próximas reservas (por ahora mock)
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

export default function OffersPage() {
  const { data: session } = useSession()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<RentalOffer | null>(null)
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([])
  const [userOffers, setUserOffers] = useState<RentalOffer[]>([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true)
  const [isLoadingOffers, setIsLoadingOffers] = useState(true)
  const [statistics, setStatistics] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    activeRentals: 0,
    totalVehicles: 0,
    upcomingReturns: 0,
    earningsGrowthPercentage: 0,
    nextReturnDate: "2024-02-17"
  })
  const [proximosAlquileres, setProximosAlquileres] = useState<any[]>([])
  const [activeRentals, setActiveRentals] = useState<any[]>([])
  const [rentalHistory, setRentalHistory] = useState<any[]>([])
  const [historialPagos, setHistorialPagos] = useState([
    {
      id: 1,
      vehicleName: "Ford Transit 2023",
      renterName: "Carlos García",
      amount: 450,
      date: "2024-02-10",
      status: "completed" as const,
      paymentMethod: "Tarjeta de Crédito",
      transactionId: "TXN-2024-001234"
    },
    {
      id: 2,
      vehicleName: "Mercedes Sprinter",
      renterName: "Ana López",
      amount: 680,
      date: "2024-02-08",
      status: "completed" as const,
      paymentMethod: "PayPal",
      transactionId: "TXN-2024-001235"
    },
    {
      id: 3,
      vehicleName: "Volkswagen Crafter",
      renterName: "Miguel Rodríguez",
      amount: 560,
      date: "2024-02-05",
      status: "pending" as const,
      paymentMethod: "Transferencia",
      transactionId: "TXN-2024-001236"
    }
  ])

  // Función para obtener ofertas del usuario
  const getUserOffers = async (): Promise<RentalOffer[]> => {
    try {
      // Usar el nuevo endpoint específico para ofertas del usuario
      const response = await fetchWithAuth<VehicleOffersAdminResponse[]>(`${BACKEND_URL}/vehicle-offer/user-offers`)
      
      // Transformar la respuesta de la API al formato esperado
      return response.map((offer: VehicleOffersAdminResponse): RentalOffer => ({
        id: offer.id,
        vehicleId: offer.vehicle.id,
        vehicleName: `${offer.vehicle.brand} ${offer.vehicle.model} (${offer.vehicle.year})`,
        vehicleImage: offer.vehicle.images?.[0] || "",
        pricePerDay: offer.pricePerDay,
        withdrawLocation: offer.withdrawLocation,
        returnLocation: offer.returnLocation,
        availableFrom: offer.availableFrom.toString(),
        availableTo: offer.availableTo.toString(),
        status: offer.available as "AVAILABLE" | "UNAVAILABLE" | "RENTED",
        totalBookings: offer.bookings?.length || 0,
        vehicleOfferType: offer.vehicleOfferType as "WITH_DRIVER" | "WITHOUT_DRIVER",
        conditions: offer.conditions,
        createdAt: offer.availableFrom.toString(), // Usar availableFrom como createdAt temporalmente
        // TODO: Implementar lógica real para próximas reservas
        nextPickup: undefined,
        currentRental: undefined,
      }))
    } catch (error) {
      console.error("Error fetching user offers:", error)
      // Si falla, retornar array vacío en lugar de lanzar error
      return []
    }
  }

  // Cargar vehículos del usuario al montar el componente
  useEffect(() => {
    const loadUserVehicles = async () => {
      try {
        setIsLoadingVehicles(true)
        const vehicles = await getUserVehicles()
        setUserVehicles(vehicles)
      } catch (error) {
        console.error("Error loading user vehicles:", error)
        toast.error("Error al cargar tus vehículos")
      } finally {
        setIsLoadingVehicles(false)
      }
    }

    loadUserVehicles()
  }, [])

  // Cargar ofertas del usuario
  useEffect(() => {
    const loadUserOffers = async () => {
      try {
        setIsLoadingOffers(true)
        const offers = await getUserOffers()
        setUserOffers(offers)
      } catch (error) {
        console.error("Error loading user offers:", error)
        // No mostrar error si no hay ofertas, es normal
        setUserOffers([])
      } finally {
        setIsLoadingOffers(false)
      }
    }

    loadUserOffers()
    loadStatistics()
    loadUpcomingBookings()
  }, [])

  // Función para calcular estadísticas
  const loadStatistics = async () => {
    try {
      const data = await getPartnerEarnings() as PartnerEarningsResponse
      setStatistics({
        totalEarnings: data.totalEarnings,
        monthlyEarnings: data.currentMonthEarnings,
        activeRentals: data.currentlyRentedVehicles,
        totalVehicles: data.publishedVehicles,
        upcomingReturns: data.totalBookings,
        earningsGrowthPercentage: data.growthPercentage,
        nextReturnDate: "2024-02-17"
      })
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  // Función para cargar próximos alquileres
  const loadUpcomingBookings = async () => {
    try {
      const bookings = await getPartnerUpcomingBookings() as any[]
      
      // Transformar datos del backend al formato del frontend
      const transformedBookings = bookings.map((booking: any) => {
        const startDate = new Date(booking.startDate)
        const endDate = new Date(booking.endDate)
        const today = new Date()
        const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        return {
          id: booking.id,
          vehicleName: `${booking.offer.vehicle.brand} ${booking.offer.vehicle.model}`,
          vehicleImage: booking.offer.vehicle.images?.[0] || "/placeholder.svg",
          vehiclePlate: booking.offer.vehicle.plate || "N/A",
          renterName: `${booking.renter.name} ${booking.renter.lastName}`,
          renterPhone: booking.renter.phone || "No disponible",
          startDate: startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          endDate: endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          totalAmount: booking.totalPrice,
          daysUntilStart: Math.max(0, daysUntilStart),
          status: booking.status,
          location: booking.offer.withdrawLocation
        }
      })

      // Debug: Mostrar todos los estados recibidos
      console.log('All bookings from backend:', transformedBookings.map(b => ({ id: b.id, status: b.status })))
      
      // Separar reservas por estado
      const proximosAlquileresFiltered = transformedBookings.filter(booking => 
        booking.status === 'PENDING' || booking.status === 'APPROVED' || booking.status === 'DELIVERED'
      )
      
      const activeRentalsFiltered = transformedBookings.filter(booking => 
        booking.status === 'ACTIVE' || booking.status === 'RETURNED'
      )

      // Pasar TODAS las reservas al historial
      const rentalHistoryFiltered = transformedBookings

      console.log('Filtered active rentals:', activeRentalsFiltered)
      console.log('Filtered rental history:', rentalHistoryFiltered)

      setProximosAlquileres(proximosAlquileresFiltered)
      setActiveRentals(activeRentalsFiltered)
      setRentalHistory(rentalHistoryFiltered)
    } catch (error) {
      console.error('Error loading upcoming bookings:', error)
      setProximosAlquileres([])
      setActiveRentals([])
      setRentalHistory([])
    }
  }


  // Handlers para las acciones de ofertas
  const handleCreateOffer = () => {
    if (userVehicles.filter(v => v.approvalStatus === "APPROVED").length === 0) {
      toast.error("Necesitas al menos un vehículo aprobado para crear ofertas")
      return
    }
    setShowCreateModal(true)
  }

  const handleEditOffer = (offer: RentalOffer) => {
    setSelectedOffer(offer)
    setShowEditModal(true)
  }

  const handleViewOffer = (offer: RentalOffer) => {
    // TODO: Implementar modal de vista
    console.log("View offer:", offer.id)
  }

  const handleDeleteOffer = (offer: RentalOffer) => {
    // TODO: Implementar confirmación y eliminación
    console.log("Delete offer:", offer.id)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedOffer(null)
  }

  const handleOfferCreated = async () => {
    toast.success("¡Oferta creada exitosamente!")
    setShowCreateModal(false)
    
    // Recargar ofertas después de crear una nueva
    try {
      const offers = await getUserOffers()
      setUserOffers(offers)
    } catch (error) {
      console.error("Error reloading offers:", error)
    }
  }

  const handleOfferUpdated = async () => {
    toast.success("¡Oferta actualizada exitosamente!")
    setShowEditModal(false)
    setSelectedOffer(null)
    
    // Recargar ofertas después de actualizar
    try {
      const offers = await getUserOffers()
      setUserOffers(offers)
    } catch (error) {
      console.error("Error reloading offers:", error)
    }
  }

  // Handler para cambios de aprobación
  const handleApprovalChange = (rentalId: number, newStatus: 'confirmed' | 'rejected' | 'approved') => {
    console.log('handleApprovalChange called:', { rentalId, newStatus })
    setProximosAlquileres(prev => {
      const updated = prev.map(rental => 
        rental.id === rentalId 
          ? { ...rental, status: newStatus }
          : rental
      )
      console.log('Updated proximosAlquileres:', updated)
      return updated
    })
  }

  if (isLoadingVehicles || isLoadingOffers) {
    return (
      <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
        <div className="w-full flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-golden-500"></div>
          <p className="mt-4 text-gray-600">
            {isLoadingVehicles ? "Cargando tus vehículos..." : "Cargando tus ofertas..."}
          </p>
        </div>
      </div>
    )
  }

  // Solo mostrar estadísticas si el partner tiene al menos un vehículo aprobado
  const hasApprovedVehicles = userVehicles.some(v => v.approvalStatus === "APPROVED")

  return (
    <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
      <div className="w-full flex flex-col justify-start items-start">
        {/* Estadísticas - Solo mostrar si tiene vehículos aprobados */}
        {hasApprovedVehicles && (
          <EstadisticasDashboardAlquileres
            totalEarnings={statistics.totalEarnings}
            monthlyEarnings={statistics.monthlyEarnings}
            userVehicles={userVehicles}
            rentals={rentalHistory}
            earningsGrowthPercentage={statistics.earningsGrowthPercentage}
          />
        )}

        {/* Tabla de pendientes de aprobación */}
        <div className="w-full max-w-none">
          <TablaPendientesAprobacion 
            rentals={proximosAlquileres} 
            onApprovalChange={handleApprovalChange}
          />
        </div>

        {/* Tabla de próximos alquileres */}
        <div className="w-full max-w-none">
          <TablaProximosAlquileres rentals={proximosAlquileres} />
        </div>

        {/* Tabla de alquileres activos - SIEMPRE MOSTRAR PARA DEBUG */}
        <div className="w-full max-w-none">
          <ActiveRentalsTable rentals={activeRentals} />
        </div>

        {/* Tabla de historial de pagos */}
        {/* {hasApprovedVehicles && historialPagos.length > 0 && (
          <div className="w-full max-w-none mb-8">
            <TablaHistorialPagos payments={historialPagos} />
          </div>
        )} */}

        {/* Tabla de historial de alquileres */}
        <div className="w-full max-w-none mb-8">
          <RentalHistoryTable rentals={rentalHistory} />
        </div>

        {/* Separador visual */}
        <div className="h-12"></div>

        {userOffers.length > 0 ? (
          <RentalOffersGrid
            offers={userOffers}
            onCreateOffer={handleCreateOffer}
            onEditOffer={handleEditOffer}
            onViewOffer={handleViewOffer}
            onDeleteOffer={handleDeleteOffer}
          />
        ) : (
          <RentalOffersEmpty onCreateOffer={handleCreateOffer} />
        )}
      </div>

      {/* Modal de creación de ofertas */}
      {showCreateModal && (
        <CreateOfferModal
          onClose={handleCloseCreateModal}
          onSuccess={handleOfferCreated}
          userVehicles={userVehicles}
        />
      )}

      {/* Modal de edición de ofertas */}
      {showEditModal && selectedOffer && (
        <EditOfferModal
          onClose={handleCloseEditModal}
          onSuccess={handleOfferUpdated}
          userVehicles={userVehicles}
          offer={{
            id: selectedOffer.id,
            vehicleId: selectedOffer.vehicleId,
            pricePerDay: selectedOffer.pricePerDay,
            agencyFee: selectedOffer.pricePerDay * 0.22, // Calcular tarifa de agencia
            vehicleOfferType: selectedOffer.vehicleOfferType,
            availableFrom: selectedOffer.availableFrom,
            availableTo: selectedOffer.availableTo,
            withdrawLocation: selectedOffer.withdrawLocation,
            returnLocation: selectedOffer.returnLocation,
            conditions: selectedOffer.conditions,
          }}
        />
      )}
    </div>
  );
}
