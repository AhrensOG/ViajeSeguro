"use client"
/* eslint-disable @next/next/no-img-element */

import { MapPin, Phone, AlertTriangle, Check, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { fetchWithAuth } from "@/lib/functions"
import { BACKEND_URL } from "@/lib/constants"
import { motion, AnimatePresence } from "framer-motion"

interface PendienteAprobacion {
  id: number
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
  status: "PENDING" | "confirmed" | "rejected" | "completed" | "approved"
  location: string
}

interface TablaPendientesAprobacionProps {
  rentals: PendienteAprobacion[]
  onApprovalChange: (rentalId: number, newStatus: 'confirmed' | 'rejected' | 'approved') => void
}

export function TablaPendientesAprobacion({ rentals, onApprovalChange }: TablaPendientesAprobacionProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [expandedRentals, setExpandedRentals] = useState<Set<number>>(new Set())

  // Filtrar solo alquileres pendientes (backend envía en mayúsculas)
  const pendingRentals = rentals.filter(rental => 
    rental.status === 'PENDING' || rental.status === 'completed'
  )
  
  console.log('TablaPendientesAprobacion - Todos los rentals:', rentals.map(r => ({ id: r.id, status: r.status })))
  console.log('TablaPendientesAprobacion - Rentals filtrados:', pendingRentals.length)

  // No renderizar si no hay alquileres pendientes
  if (pendingRentals.length === 0) {
    return null
  }

  const updateBookingStatus = async (bookingId: number, status: string) => {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${bookingId}/${status}`, {
      method: 'PATCH',
    })
  }

  const handleApprove = async (rentalId: number) => {
    setLoading(`approve-${rentalId}`)
    try {
      await updateBookingStatus(rentalId, 'APPROVED')
      // Cambiar a 'approved' en lugar de 'confirmed' para que coincida con el filtro
      onApprovalChange(rentalId, 'approved')
      console.log('Alquiler aprobado exitosamente - Estado cambiado a approved')
    } catch (error) {
      console.error('Error al aprobar:', error)
      alert('Error al aprobar el alquiler. Inténtalo de nuevo.')
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (rentalId: number) => {
    setLoading(`reject-${rentalId}`)
    try {
      await updateBookingStatus(rentalId, 'DECLINED')
      onApprovalChange(rentalId, 'rejected')
      console.log('Alquiler rechazado exitosamente')
    } catch (error) {
      console.error('Error al rechazar:', error)
      alert('Error al rechazar el alquiler. Inténtalo de nuevo.')
    } finally {
      setLoading(null)
    }
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  const toggleExpanded = (rentalId: number) => {
    setExpandedRentals(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rentalId)) {
        newSet.delete(rentalId)
      } else {
        newSet.add(rentalId)
      }
      return newSet
    })
  }

  const getUrgencyIcon = (daysUntilStart: number) => {
    if (daysUntilStart <= 3) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />
    }
    return null
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 mb-8 backdrop-blur-sm">
      <div className="p-6 pb-4 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            Pendientes de Aprobación
          </h3>
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {pendingRentals.length}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {pendingRentals.map((rental) => {
            const isExpanded = expandedRentals.has(rental.id)
            
            return (
              <div
                key={rental.id}
                className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-5 hover:bg-white hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300"
              >
                {/* Header clickeable */}
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpanded(rental.id)}
                >
                  {/* Información del vehículo */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={rental.vehicleImage || "/placeholder.svg"}
                        alt={rental.vehicleName}
                        className="w-16 h-12 object-cover rounded-xl border-2 border-slate-200/60 shadow-md"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-lg">{rental.vehicleName}</h4>
                      <p className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-md">{rental.vehiclePlate}</p>
                    </div>
                  </div>

                  {/* Información del inquilino */}
                  <div className="text-sm space-y-1">
                    <p className="font-bold text-slate-800">{rental.renterName}</p>
                    <p className="text-slate-500 text-xs">{rental.renterPhone}</p>
                  </div>

                  {/* Fechas */}
                  <div className="text-sm text-center space-y-1">
                    <p className="font-bold text-slate-800">{rental.startDate}</p>
                    <p className="text-slate-500 text-xs">hasta {rental.endDate}</p>
                  </div>

                  {/* Precio y urgencia */}
                  <div className="text-right space-y-2">
                    <p className="font-black text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${rental.totalAmount}
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      {getUrgencyIcon(rental.daysUntilStart)}
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        Pendiente
                      </span>
                    </div>
                  </div>

                  {/* Icono de expansión */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0 p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors"
                  >
                    <ChevronDown className="h-5 w-5 text-slate-600" />
                  </motion.div>
                </div>

                {/* Contenido expandido */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-yellow-300">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* Información completa del vehículo */}
                          <div className="bg-white p-3 rounded-md">
                            <h5 className="font-semibold text-gray-800 mb-2">Información del Vehículo</h5>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Modelo:</span> {rental.vehicleName}</p>
                              <p><span className="font-medium">Placa:</span> {rental.vehiclePlate}</p>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="font-medium">Ubicación:</span> {rental.location}
                              </div>
                            </div>
                          </div>

                          {/* Información completa del cliente */}
                          <div className="bg-white p-3 rounded-md">
                            <h5 className="font-semibold text-gray-800 mb-2">Información del Cliente</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                {rental.renterAvatar ? (
                                  <img src={rental.renterAvatar} alt={rental.renterName} className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-700">{rental.renterName.charAt(0)}</span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{rental.renterName}</p>
                                  <p className="text-gray-600">{rental.renterPhone}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                handleApprove(rental.id)
                              }}
                              disabled={loading === `approve-${rental.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                              <Check className="h-4 w-4" />
                              {loading === `approve-${rental.id}` ? 'Aprobando...' : 'Aprobar'}
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReject(rental.id)
                              }}
                              disabled={loading === `reject-${rental.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                              <X className="h-4 w-4" />
                              {loading === `reject-${rental.id}` ? 'Rechazando...' : 'Rechazar'}
                            </button>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCall(rental.renterPhone)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                          >
                            <Phone className="h-4 w-4" />
                            Llamar Cliente
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
