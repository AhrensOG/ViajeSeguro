"use client"
/* eslint-disable @next/next/no-img-element */

import { MapPin, Phone, AlertTriangle, Check, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { fetchWithAuth } from "@/lib/functions"
import { BACKEND_URL } from "@/lib/constants"
import { motion, AnimatePresence } from "framer-motion"

export interface PendienteAprobacion {
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
  status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED" | "COMPLETED"
  location: string
}

export interface TablaPendientesAprobacionProps {
  rentals: PendienteAprobacion[]
  onApprovalChange: (rentalId: string, newStatus: 'APPROVED' | 'DECLINED') => void
}

export function TablaPendientesAprobacion({ rentals, onApprovalChange }: TablaPendientesAprobacionProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [expandedRentals, setExpandedRentals] = useState<Set<string>>(new Set())
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)

  // Filtrar solo alquileres en estado PENDING (desaparece al aprobar)
  const pendingRentals = rentals.filter(rental => rental.status === 'PENDING')

  console.log('TablaPendientesAprobacion - Todos los rentals:', rentals.map(r => ({ id: r.id, status: r.status })))
  console.log('TablaPendientesAprobacion - Rentals filtrados:', pendingRentals.length)

  // No renderizar si no hay alquileres pendientes
  if (pendingRentals.length === 0) {
    return null
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${bookingId}/${status}`, {
      method: 'PATCH',
    })
  }

  const handleApprove = async (rentalId: string) => {
    setLoading(`approve-${rentalId}`)
    try {
      await updateBookingStatus(rentalId, 'APPROVED')
      // Informar cambio a estado 'APPROVED' (enum backend)
      onApprovalChange(rentalId, 'APPROVED')
      console.log('Alquiler aprobado exitosamente - Estado cambiado a approved')
    } catch (error) {
      console.error('Error al aprobar:', error)
      alert('Error al aprobar el alquiler. Inténtalo de nuevo.')
    } finally {
      setLoading(null)
      setShowApproveModal(false)
      setApproveTargetId(null)
    }
  }

  const handleReject = async (rentalId: string) => {
    setLoading(`reject-${rentalId}`)
    try {
      await updateBookingStatus(rentalId, 'DECLINED')
      onApprovalChange(rentalId, 'DECLINED')
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

  const toggleExpanded = (rentalId: string) => {
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
                  className="flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer gap-4 md:gap-0"
                  onClick={() => toggleExpanded(rental.id)}
                >
                  {/* Información del vehículo */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative shrink-0">
                      <img
                        src={rental.vehicleImage || "/placeholder.svg"}
                        alt={rental.vehicleName}
                        className="w-16 h-12 object-cover rounded-xl border-2 border-slate-200/60 shadow-md"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-lg truncate pr-2">{rental.vehicleName}</h4>
                      <p className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-md inline-block">{rental.vehiclePlate}</p>
                    </div>
                  </div>

                  {/* Wrapper para info intermedia en móvil */}
                  <div className="flex flex-row justify-between w-full md:w-auto md:contents">
                    {/* Información del inquilino */}
                    <div className="text-sm space-y-1">
                      <p className="font-bold text-slate-800">{rental.renterName}</p>
                      <p className="text-slate-500 text-xs">{rental.renterPhone}</p>
                    </div>

                    {/* Fechas */}
                    <div className="text-sm text-right md:text-center space-y-1">
                      <p className="font-bold text-slate-800">{rental.startDate}</p>
                      <p className="text-slate-500 text-xs">hasta {rental.endDate}</p>
                    </div>
                  </div>

                  {/* Precio y urgencia */}
                  <div className="flex flex-row justify-between items-center w-full md:w-auto md:block md:text-right">
                    <div className="flex items-center gap-2 md:hidden">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        Pendiente
                      </span>
                    </div>
                    <div className="text-right space-y-1 md:space-y-2">
                      <p className="font-black text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ${rental.totalAmount}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-3 mt-1">
                        Incluye 200km/día. Exceso 0,50€/km
                      </p>
                      <div className="hidden md:flex items-center gap-2 justify-end">
                        {getUrgencyIcon(rental.daysUntilStart)}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          Pendiente
                        </span>
                      </div>
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
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                          <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setApproveTargetId(rental.id)
                                setShowApproveModal(true)
                              }}
                              disabled={loading === `approve-${rental.id}`}
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-semibold"
                            >
                              <Check className="h-5 w-5" />
                              {loading === `approve-${rental.id}` ? '...' : 'Aprobar'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReject(rental.id)
                              }}
                              disabled={loading === `reject-${rental.id}`}
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-semibold"
                            >
                              <X className="h-5 w-5" />
                              {loading === `reject-${rental.id}` ? '...' : 'Rechazar'}
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCall(rental.renterPhone)
                            }}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                          >
                            <Phone className="h-4 w-4" />
                            Soporte Tecnico
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
      {/* Modal de confirmación de aprobación */}
      <ApprovalReminderModal
        open={showApproveModal}
        onClose={() => { setShowApproveModal(false); setApproveTargetId(null) }}
        onConfirm={() => { if (approveTargetId) handleApprove(approveTargetId) }}
        loading={!!(approveTargetId && loading === `approve-${approveTargetId}`)}
      />
    </div>
  )
}

// Modal de confirmación de aprobación con recordatorio de requisitos
export function ApprovalReminderModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-2">Antes de aprobar</h4>
        <p className="text-sm text-slate-700 mb-3">
          Recuerda verificar la identidad del arrendatario y que cuente con <strong>más de 8 años</strong> de carnet de conducir.
        </p>
        <p className="text-sm text-slate-700 mb-4">
          Si no cumple este requisito, el propietario del coche tiene derecho a rechazar la reserva. Esta verificación es <strong>responsabilidad del propietario</strong>.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancelar</button>
          <button
            onClick={onConfirm}
            disabled={!!loading}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Aprobando...' : 'Confirmar y aprobar'}
          </button>
        </div>
      </div>
    </div>
  )
}
