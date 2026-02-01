"use client"
/* eslint-disable @next/next/no-img-element */

import { CalendarDays, MapPin, Phone, MessageCircle, ChevronDown, User, CreditCard, Clock, Image as ImageIcon } from "lucide-react"
import { useState } from "react"
import { getDeliveryPhotos } from "@/lib/api/vehicle-booking"
import { motion, AnimatePresence } from "framer-motion"
import { DateTime } from "luxon"

interface RentalHistory {
  id: string
  vehicleName: string
  vehicleImage: string
  vehiclePlate?: string
  renterName: string
  renterAvatar?: string
  renterPhone: string
  renterEmail?: string
  startDate: string
  endDate: string
  totalAmount: number
  status: "PENDING" | "APPROVED" | "DELIVERED" | "ACTIVE" | "RETURNED" | "FINISHED" | "CANCELLED" | "DECLINED" | "COMPLETED"
  location: string
  paymentMethod?: string
  createdAt: string
  returnLocation?: string
  agencyFee?: number
  pricePerDay?: number
  depositAmount?: number
}

interface RentalHistoryTableProps {
  rentals: RentalHistory[]
}

export function RentalHistoryTable({ rentals }: RentalHistoryTableProps) {
  const [expandedRentals, setExpandedRentals] = useState<Set<string>>(new Set())
  const [photosByRental, setPhotosByRental] = useState<Record<string, string[]>>({})
  const [loadingPhotos, setLoadingPhotos] = useState<Set<string>>(new Set())

  // Calcular ganancias reales del partner EXCLUYENDO fianza (la fianza se devuelve al cliente)
  const calculatePartnerEarnings = (totalAmount: number, agencyFee: number | undefined, depositAmount: number | undefined) => {
    const deposit = Number(depositAmount || 0)
    const base = Math.max(0, Number(totalAmount || 0) - deposit)
    if (agencyFee !== undefined) return Math.max(0, base - Number(agencyFee))
    // Si no viene agencyFee, usar 21% para empresa → 79% para partner
    return Math.max(0, base * 0.79)
  }

  console.log('📋 RentalHistoryTable DEBUG:', {
    totalRentals: rentals.length,
    rentalsData: rentals,
    statuses: rentals.map(r => ({ id: r.id, status: r.status, type: typeof r.status }))
  })

  // Mostrar TODAS las reservas independientemente del estado
  const historyRentals = rentals

  console.log('📊 All rental history:', historyRentals)

  // Si no hay reservas, no renderizar el componente
  if (historyRentals.length === 0) {
    console.log('❌ No rentals found, component will not render')
    return null
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
    // Cargar fotos al expandir por primera vez
    if (!expandedRentals.has(rentalId) && !photosByRental[rentalId]) {
      loadDeliveryPhotos(rentalId)
    }
  }

  const loadDeliveryPhotos = async (rentalId: string) => {
    try {
      setLoadingPhotos(prev => new Set(prev).add(rentalId))
      const urls = await getDeliveryPhotos(rentalId)
      setPhotosByRental(prev => ({ ...prev, [rentalId]: urls || [] }))
    } catch (e) {
      console.warn('No se pudieron cargar fotos de entrega para', rentalId, e)
      setPhotosByRental(prev => ({ ...prev, [rentalId]: [] }))
    } finally {
      setLoadingPhotos(prev => {
        const s = new Set(prev)
        s.delete(rentalId)
        return s
      })
    }
  }

  const getStatusBadge = (status: RentalHistory["status"]) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pendiente</span>
      case "APPROVED":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Aprobada</span>
      case "DELIVERED":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Entregada</span>
      case "ACTIVE":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Activa</span>
      case "RETURNED":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Devuelta</span>
      case "FINISHED":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Finalizada</span>
      case "COMPLETED":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Completada</span>
      case "CANCELLED":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Cancelada</span>
      case "DECLINED":
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Declinada</span>
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'

    try {
      // Intentar con diferentes formatos
      let date = DateTime.fromISO(dateString)

      if (!date.isValid) {
        // Intentar como timestamp
        date = DateTime.fromMillis(Number(dateString))
      }

      if (!date.isValid) {
        // Intentar como fecha JavaScript
        date = DateTime.fromJSDate(new Date(dateString))
      }

      if (date.isValid) {
        return date.toFormat('dd/MM/yyyy')
      } else {
        console.warn('Invalid date format:', dateString)
        return dateString
      }
    } catch (error) {
      console.warn('Error formatting date:', dateString, error)
      return dateString
    }
  }

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0

    try {
      let start = DateTime.fromISO(startDate)
      let end = DateTime.fromISO(endDate)

      // Si no son válidas, intentar otros formatos
      if (!start.isValid) {
        start = DateTime.fromJSDate(new Date(startDate))
      }
      if (!end.isValid) {
        end = DateTime.fromJSDate(new Date(endDate))
      }

      if (start.isValid && end.isValid) {
        return Math.ceil(end.diff(start, 'days').days)
      } else {
        console.warn('Invalid dates for calculation:', { startDate, endDate })
        return 0
      }
    } catch (error) {
      console.warn('Error calculating days:', error)
      return 0
    }
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
      <div className="p-6 pb-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          Historial de Alquileres
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
            {historyRentals.length}
          </span>
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {historyRentals.map((rental) => (
            <div key={rental.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                onClick={() => toggleExpanded(rental.id)}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img
                    src={rental.vehicleImage || "/placeholder.svg"}
                    alt={rental.vehicleName}
                    className="w-16 h-12 object-cover rounded-md shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate pr-2">{rental.vehicleName}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{rental.location}</span>
                    </div>
                    {rental.vehiclePlate && (
                      <p className="text-xs text-gray-500">Placa: {rental.vehiclePlate}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                        {rental.renterAvatar ? (
                          <img src={rental.renterAvatar} alt={rental.renterName} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">{rental.renterName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{rental.renterName}</p>
                        <p className="text-gray-600 text-xs md:text-sm">{rental.renterPhone}</p>
                      </div>
                    </div>

                    <div className="text-sm text-right md:hidden">
                      <p className="font-medium">{formatDate(rental.startDate)}</p>
                      <p className="text-gray-600 text-xs">hasta {formatDate(rental.endDate)}</p>
                    </div>
                  </div>

                  <div className="hidden md:block text-sm text-center">
                    <p className="font-medium">{formatDate(rental.startDate)}</p>
                    <p className="text-gray-600">hasta {formatDate(rental.endDate)}</p>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:block md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                    <div className="md:hidden">
                      {getStatusBadge(rental.status)}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${calculatePartnerEarnings(rental.totalAmount, rental.agencyFee, rental.depositAmount).toFixed(2)}</p>
                      <p className="text-[10px] text-gray-500 leading-3 mt-1">
                        Incluye 200km/día. Exceso 0,50€/km
                      </p>
                      <p className="text-xs text-gray-400">Ganancias</p>
                      <div className="hidden md:block mt-1">
                        {getStatusBadge(rental.status)}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: expandedRentals.has(rental.id) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden md:block" // Ocultar flecha en móvil para ganar espacio (el touch area es toda la tarjeta)
                  >
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {expandedRentals.has(rental.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100 bg-gray-50"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Información del Cliente */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-600" />
                          Información del Cliente
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nombre:</span>
                            <span className="font-medium">{rental.renterName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Teléfono:</span>
                            <span className="font-medium">{rental.renterPhone}</span>
                          </div>
                          {rental.renterEmail && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium">{rental.renterEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Detalles del Alquiler */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-purple-600" />
                          Detalles del Alquiler
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duración:</span>
                            <span className="font-medium">{calculateDays(rental.startDate, rental.endDate)} días</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fecha inicio:</span>
                            <span className="font-medium">{formatDate(rental.startDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fecha fin:</span>
                            <span className="font-medium">{formatDate(rental.endDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Creado:</span>
                            <span className="font-medium">{formatDate(rental.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Información Financiera */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-purple-600" />
                          Información Financiera
                        </h5>
                        <div className="space-y-3 text-sm">
                          {/* Desglose detallado */}
                          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                            <h6 className="font-medium text-gray-800 text-xs uppercase tracking-wide">Desglose de Pagos</h6>

                            <div className="flex justify-between">
                              <span className="text-gray-600">Lo que pagó el cliente:</span>
                              <span className="font-bold text-blue-600">${rental.totalAmount}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600">Fianza pagada por cliente:</span>
                              <span className="font-medium">${Number(rental.depositAmount || 0).toFixed(2)}</span>
                            </div>

                            {rental.pricePerDay && (
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-xs">Precio por día:</span>
                                <span className="text-gray-500 text-xs">${rental.pricePerDay}</span>
                              </div>
                            )}

                            <div className="border-t border-gray-200 pt-2 space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Base (sin fianza):</span>
                                <span className="font-medium">${(Number(rental.totalAmount || 0) - Number(rental.depositAmount || 0)).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Empresa se lleva (21%):</span>
                                <span className="font-medium text-red-600">
                                  {rental.agencyFee
                                    ? `$${rental.agencyFee}`
                                    : `$${(Math.max(0, Number(rental.totalAmount || 0) - Number(rental.depositAmount || 0)) * 0.21).toFixed(2)}`}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-green-600">Partner recibe (79%):</span>
                                <span className="font-medium text-green-600">
                                  ${calculatePartnerEarnings(rental.totalAmount, rental.agencyFee, rental.depositAmount).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Total final destacado */}
                          <div className="bg-green-50 border-2 border-green-200 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-green-800">TUS GANANCIAS TOTALES:</span>
                              <span className="font-bold text-green-700 text-lg">
                                ${calculatePartnerEarnings(rental.totalAmount, rental.agencyFee, rental.depositAmount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {rental.paymentMethod && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Método pago:</span>
                              <span className="font-medium">{rental.paymentMethod}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ubicaciones */}
                      {rental.returnLocation && (
                        <div className="space-y-3 md:col-span-2 lg:col-span-3">
                          <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-600" />
                            Ubicaciones
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Recogida:</span>
                              <span className="font-medium">{rental.location}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Devolución:</span>
                              <span className="font-medium">{rental.returnLocation}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fotos de Entrega */}
                      {(loadingPhotos.has(rental.id) || (photosByRental[rental.id] && photosByRental[rental.id].length > 0)) && (
                        <div className="space-y-3 md:col-span-2 lg:col-span-3">
                          <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-purple-600" />
                            Fotos de entrega
                          </h5>
                          {loadingPhotos.has(rental.id) ? (
                            <div className="text-sm text-gray-500">Cargando fotos...</div>
                          ) : photosByRental[rental.id] && photosByRental[rental.id].length > 0 ? (
                            <div className="flex gap-3 overflow-x-auto snap-x pb-2">
                              {photosByRental[rental.id].map((url, idx) => (
                                <div key={idx} className="min-w-[160px] snap-start">
                                  <img src={url} alt={`Entrega ${idx + 1}`} className="w-40 h-28 object-cover rounded border" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">No hay fotos registradas para esta entrega.</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="px-6 pb-4 flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${rental.renterPhone}`, '_self');
                        }}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="Llamar cliente"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="Enviar mensaje"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
