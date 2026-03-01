"use client"

import { CalendarDays, MapPin, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { VehicleBookingResponseAdmin } from "@/lib/api/admin/vehicle-bookings/vehicleBookings.types"
import { fetchWithAuth } from "@/lib/functions"
import { BACKEND_URL } from "@/lib/constants"
import DeliveryCaptureModalAdmin from "./DeliveryCaptureModalAdmin"

interface ActiveRentalsTableAdminProps {
    rentals: VehicleBookingResponseAdmin[]
    onRentalUpdate?: (updatedRental: VehicleBookingResponseAdmin) => void
}

export function ActiveRentalsTableAdmin({ rentals, onRentalUpdate }: ActiveRentalsTableAdminProps) {
    const [loadingConfirm, setLoadingConfirm] = useState<Set<string>>(new Set())
    const [visibleRentals, setVisibleRentals] = useState<VehicleBookingResponseAdmin[]>(rentals)
    const [captureOpen, setCaptureOpen] = useState(false)
    const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null)

    // Utilizamos phase para determinar si estamos entregando (OWNER_PRE) o recibiendo (OWNER_POST)
    const [capturePhase, setCapturePhase] = useState<"OWNER_PRE" | "OWNER_POST">("OWNER_PRE")

    useEffect(() => {
        setVisibleRentals(rentals)
    }, [rentals])

    // Filtrar reservas que están listas para ser entregadas (APPROVED), o que están activas (ACTIVE), o devueltas por el cliente (RETURNED)
    const activeRentals = visibleRentals.filter(rental =>
        rental.status === 'APPROVED' || rental.status === 'DELIVERED' || rental.status === 'ACTIVE' || rental.status === 'RETURNED'
    )

    if (activeRentals.length === 0) {
        return null
    }

    const openCaptureFlow = (rentalId: string, phase: "OWNER_PRE" | "OWNER_POST") => {
        setSelectedRentalId(rentalId)
        setCapturePhase(phase)
        setCaptureOpen(true)
    }

    const updateBookingStatus = async (bookingId: string, status: string) => {
        const response = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${bookingId}/${status}`, {
            method: 'PATCH',
        })
        return response
    }

    const handleCaptureComplete = async (urls: string[]) => {
        void urls;
        if (!selectedRentalId) return
        const rentalId = selectedRentalId

        try {
            setLoadingConfirm(prev => new Set(prev).add(rentalId))

            // Dependiendo de la fase, llamamos a diferentes endpoints de cambio de estado
            if (capturePhase === "OWNER_PRE") {
                await updateBookingStatus(rentalId, 'mark-delivered')
                toast.success("¡Vehículo marcado como entregado!")
            } else {
                await updateBookingStatus(rentalId, 'confirm-return')
                toast.success("¡Recepción confirmada! El alquiler ha finalizado")
            }

            // Actualizar localmente el estado de la reserva
            if (onRentalUpdate) {
                const rentalToUpdate = visibleRentals.find(r => r.id === rentalId)
                if (rentalToUpdate) {
                    onRentalUpdate({
                        ...rentalToUpdate,
                        status: capturePhase === "OWNER_PRE" ? 'DELIVERED' : 'FINISHED'
                    })
                }
            } else {
                // Si no hay callback, simplemente lo removemos de esta vista si finalizó
                if (capturePhase === "OWNER_POST") {
                    setVisibleRentals(prev => prev.filter(r => r.id !== rentalId))
                } else {
                    setVisibleRentals(prev => prev.map(r => r.id === rentalId ? { ...r, status: 'DELIVERED' } : r))
                }
            }

        } catch (error) {
            console.error('Error al confirmar acción:', error)
            toast.error("Error al confirmar la acción sobre el vehículo")
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
        // Si no hay teléfono registrado en Renter para el backend actual, lo omitimos o usamos placeholder
        window.open(`tel:${phone}`, '_self')
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Por Entregar</span>
            case "DELIVERED":
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Entregado</span>
            case "ACTIVE":
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Activo</span>
            case "RETURNED":
                return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Devuelto por Cliente</span>
            default:
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>
        }
    }

    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
            <div className="p-6 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    Alquileres Activos (VS)
                </h3>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {activeRentals.map((rental) => (
                        <div
                            key={rental.id}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4 md:gap-0 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4 w-full md:w-auto border-b md:border-b-0 border-gray-100 pb-3 md:pb-0">
                                <div className="w-16 h-12 bg-gray-200 flex items-center justify-center rounded-md shrink-0">
                                    <span className="text-xs font-bold text-gray-400">VS</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{rental.offer.vehicle.brand} {rental.offer.vehicle.model}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-3 w-3" />
                                        {rental.offer.withdrawLocation}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-sm font-medium text-gray-600">{rental.renter.name.charAt(0)}</span>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium">{rental.renter.name} {rental.renter.lastName}</p>
                                        <p className="text-gray-600">{rental.renter.email}</p>
                                    </div>
                                </div>

                                <div className="text-sm md:text-center w-full md:w-auto border-y md:border-y-0 border-gray-100 py-3 md:py-0">
                                    <p className="font-medium">{new Date(rental.startDate).toLocaleDateString("es-ES")}</p>
                                    <p className="text-gray-600">hasta {new Date(rental.endDate).toLocaleDateString("es-ES")}</p>
                                </div>

                                <div className="text-left md:text-right w-full md:w-auto flex flex-col md:block">
                                    <div className="flex justify-between md:block items-center">
                                        <p className="font-bold text-blue-600">€{rental.totalPrice.toFixed(2)}</p>
                                        <div className="md:hidden">{getStatusBadge(rental.status)}</div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-3 mt-1 mb-1 max-w-[120px] md:ml-auto">
                                        200km/día incluidos<br />Exceso 0,50€/km
                                    </p>
                                    <div className="hidden md:block">
                                        {getStatusBadge(rental.status)}
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                                    <button
                                        onClick={() => handleCall("000000000")} // TODO: Añadir telefono al usuario si el backend lo devuelve
                                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        <Phone className="h-4 w-4" />
                                    </button>

                                    {rental.status === "APPROVED" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openCaptureFlow(rental.id, "OWNER_PRE");
                                            }}
                                            disabled={loadingConfirm.has(rental.id)}
                                            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors flex flex-1 md:flex-none justify-center items-center gap-1"
                                        >
                                            {loadingConfirm.has(rental.id) ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                                                    Iniciando...
                                                </>
                                            ) : (
                                                "Entregar Vehículo"
                                            )}
                                        </button>
                                    )}

                                    {(rental.status === "ACTIVE" || rental.status === "RETURNED" || rental.status === "DELIVERED") && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openCaptureFlow(rental.id, "OWNER_POST");
                                            }}
                                            disabled={loadingConfirm.has(rental.id)}
                                            className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors flex flex-1 md:flex-none justify-center items-center gap-1"
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

            {captureOpen && selectedRentalId && (
                <DeliveryCaptureModalAdmin
                    isOpen={captureOpen}
                    bookingId={selectedRentalId}
                    onClose={() => setCaptureOpen(false)}
                    onComplete={handleCaptureComplete}
                    phase={capturePhase}
                />
            )}
        </div>
    )
}
