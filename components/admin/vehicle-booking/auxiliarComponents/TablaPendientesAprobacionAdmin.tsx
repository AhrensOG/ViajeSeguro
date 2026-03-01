"use client"
/* eslint-disable @next/next/no-img-element */

import { MapPin, AlertTriangle, Check, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { fetchWithAuth } from "@/lib/functions"
import { BACKEND_URL } from "@/lib/constants"
import { motion, AnimatePresence } from "framer-motion"
import { VehicleBookingResponseAdmin } from "@/lib/api/admin/vehicle-bookings/vehicleBookings.types"

// Helpers para fechas (iguales a los que usa el partner)
const getDaysUntilStart = (startDate: string) => {
    const start = new Date(startDate)
    const today = new Date()
    const diffTime = start.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export interface TablaPendientesAprobacionAdminProps {
    rentals: VehicleBookingResponseAdmin[]
    onApprovalChange: (rentalId: string, newStatus: 'APPROVED' | 'DECLINED') => void
}

export function TablaPendientesAprobacionAdmin({ rentals, onApprovalChange }: TablaPendientesAprobacionAdminProps) {
    const [loading, setLoading] = useState<string | null>(null)
    const [expandedRentals, setExpandedRentals] = useState<Set<string>>(new Set())
    const [approveTargetId, setApproveTargetId] = useState<string | null>(null)
    const [showApproveModal, setShowApproveModal] = useState(false)

    // Filtrar solo alquileres en estado PENDING
    const pendingRentals = rentals.filter(rental => rental.status === 'PENDING')

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
            onApprovalChange(rentalId, 'APPROVED')
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
        } catch (error) {
            console.error('Error al rechazar:', error)
            alert('Error al rechazar el alquiler. Inténtalo de nuevo.')
        } finally {
            setLoading(null)
        }
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
                        const daysUntilStart = getDaysUntilStart(rental.startDate)

                        return (
                            <div
                                key={rental.id}
                                className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-5 hover:bg-white hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300"
                            >
                                <div
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer gap-4 md:gap-0"
                                    onClick={() => toggleExpanded(rental.id)}
                                >
                                    <div className="flex items-center gap-4 w-full md:w-auto border-b md:border-b-0 border-slate-100 pb-3 md:pb-0">
                                        <div className="relative shrink-0">
                                            <div className="w-16 h-12 bg-gray-200 flex items-center justify-center rounded-xl border-2 border-slate-200/60 shadow-md">
                                                <span className="text-xs font-bold text-gray-400">ADMIN</span>
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-sm"></div>
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 text-lg truncate pr-2">{rental.offer.vehicle.brand} {rental.offer.vehicle.model}</h4>
                                            <p className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-md inline-block">{rental.offer.vehicle.plate}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between w-full md:w-auto md:contents gap-4 md:gap-0">
                                        <div className="text-sm space-y-1 w-full md:w-auto">
                                            <p className="font-bold text-slate-800">{rental.renter.name} {rental.renter.lastName}</p>
                                            <p className="text-slate-500 text-xs">{rental.renter.email}</p>
                                        </div>

                                        <div className="text-sm md:text-center space-y-1 w-full md:w-auto border-y md:border-y-0 border-slate-100 py-3 md:py-0">
                                            <p className="font-bold text-slate-800">{new Date(rental.startDate).toLocaleDateString("es-ES")}</p>
                                            <p className="text-slate-500 text-xs">hasta {new Date(rental.endDate).toLocaleDateString("es-ES")}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse md:flex-row justify-between md:items-center w-full md:w-auto md:text-right gap-3 md:gap-0">
                                        <div className="flex items-center gap-2 md:hidden">
                                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                                Pendiente
                                            </span>
                                        </div>
                                        <div className="text-left md:text-right space-y-1 md:space-y-2 flex flex-row items-center justify-between md:block">
                                            <p className="font-black text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                €{rental.totalPrice.toFixed(2)}
                                            </p>
                                            <p className="text-[10px] text-gray-500 leading-3 mt-1">
                                                Incluye 200km/día. Exceso 0,50€/km
                                            </p>
                                            <div className="hidden md:flex items-center gap-2 justify-end">
                                                {getUrgencyIcon(daysUntilStart)}
                                                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                                    Pendiente
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="hidden md:flex flex-shrink-0 p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors"
                                    >
                                        <ChevronDown className="h-5 w-5 text-slate-600" />
                                    </motion.div>
                                </div>

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
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-white p-3 rounded-md shadow-sm border border-slate-100">
                                                        <h5 className="font-semibold text-gray-800 mb-2">Información del Vehículo</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Modelo:</span> {rental.offer.vehicle.brand} {rental.offer.vehicle.model}</p>
                                                            <p><span className="font-medium">Placa:</span> {rental.offer.vehicle.plate}</p>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                <span className="font-medium">Ubicación:</span> {rental.offer.withdrawLocation}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-3 rounded-md shadow-sm border border-slate-100">
                                                        <h5 className="font-semibold text-gray-800 mb-2">Información del Cliente</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                    <span className="text-xs font-medium text-gray-700">{rental.renter.name.charAt(0)}</span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{rental.renter.name} {rental.renter.lastName}</p>
                                                                    <p className="text-gray-600">{rental.renter.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mt-6">
                                                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
            <ApprovalReminderModalAdmin
                open={showApproveModal}
                onClose={() => { setShowApproveModal(false); setApproveTargetId(null) }}
                onConfirm={() => { if (approveTargetId) handleApprove(approveTargetId) }}
                loading={!!(approveTargetId && loading === `approve-${approveTargetId}`)}
            />
        </div>
    )
}

export function ApprovalReminderModalAdmin({
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
                <h4 className="text-lg font-bold text-slate-800 mb-2">Antes de aprobar (ADMIN)</h4>
                <p className="text-sm text-slate-700 mb-3">
                    Verificando aprobación administrativa del alquiler.
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
