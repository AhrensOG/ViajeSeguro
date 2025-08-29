"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { RentalOffersEmpty } from "./auxiliarComponents/RentalOffersEmpty"
import { RentalOffersGrid } from "./auxiliarComponents/RentalOffersGrid"
import CreateOfferModal from "./auxiliarComponents/CreateOfferModal"
import EditOfferModal from "./auxiliarComponents/EditOfferModal"
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type"
import { getUserVehicles } from "@/lib/api/partner/vehicles"
import { VehicleOffersAdminResponse } from "@/lib/api/admin/vehicle-offers/vehicleOffers.types"
import { fetchWithAuth } from "@/lib/functions"
import { BACKEND_URL } from "@/lib/constants"

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
  }, [])

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

  return (
    <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
      <div className="w-full flex flex-col justify-start items-start">
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
            agencyFee: selectedOffer.pricePerDay * 0.15, // Calcular tarifa de agencia
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
