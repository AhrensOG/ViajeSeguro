"use client"

import { CalendarDays, DollarSign, TrendingUp, Users } from "lucide-react"

interface RentalData {
  id: number
  endDate: string
  status: "PENDING" | "APPROVED" | "DELIVERED" | "ACTIVE" | "RETURNED" | "FINISHED" | "CANCELLED" | "DECLINED" | "COMPLETED"
}

interface EstadisticasDashboardProps {
  totalEarnings: number
  monthlyEarnings: number
  userVehicles: unknown[] // Array de vehículos del usuario
  rentals: RentalData[] // Array de todas las reservas
  earningsGrowthPercentage?: number
}

export function EstadisticasDashboardAlquileres({
  totalEarnings,
  monthlyEarnings,
  userVehicles,
  rentals,
  earningsGrowthPercentage = 12,
}: EstadisticasDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Las ganancias ya llegan netas desde el padre; no recalcular aquí

  // Calcular estadísticas basadas en datos reales con validaciones
  const totalVehicles = userVehicles?.length || 0
  const activeRentals = rentals?.filter(rental => rental.status === 'ACTIVE').length || 0
  const upcomingReturns = activeRentals // Mismo número que alquileres activos
  
  // Encontrar la fecha más próxima de devolución
  const getNextReturnDate = () => {
    if (!rentals || rentals.length === 0) return null
    
    const activeRentalsWithDates = rentals
      .filter(rental => rental.status === 'ACTIVE')
      .map(rental => new Date(rental.endDate))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())
    
    return activeRentalsWithDates.length > 0 ? activeRentalsWithDates[0] : null
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    try {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short'
      })
    } catch {
      return 'N/A'
    }
  }

  const getMonthName = () => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    const currentDate = new Date()
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  }

  const nextReturnDate = getNextReturnDate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-400/5 border border-blue-500/20 rounded-lg shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <h3 className="text-sm font-medium text-gray-600">Ganancias Totales</h3>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </div>
        <div className="px-6 pb-6">
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalEarnings)}</div>
          <p className="text-xs text-gray-400">Total neto</p>
          <p className="text-xs text-gray-500">
            {earningsGrowthPercentage >= 0 ? '+' : ''}{earningsGrowthPercentage}% desde el mes pasado
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/10 to-green-400/5 border border-green-500/20 rounded-lg shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <h3 className="text-sm font-medium text-gray-600">Ganancias del Mes</h3>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
        <div className="px-6 pb-6">
          <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyEarnings)}</div>
          <p className="text-xs text-gray-400">Neto del mes</p>
          <p className="text-xs text-gray-500">En {getMonthName()}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-purple-400/5 border border-purple-500/20 rounded-lg shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <h3 className="text-sm font-medium text-gray-600">Vehículos Publicados</h3>
          <Users className="h-4 w-4 text-purple-600" />
        </div>
        <div className="px-6 pb-6">
          <div className="text-2xl font-bold text-purple-600">{totalVehicles}</div>
          <p className="text-xs text-gray-500">{activeRentals} actualmente alquilados</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500/10 to-orange-400/5 border border-orange-500/20 rounded-lg shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <h3 className="text-sm font-medium text-gray-600">Vehículos por Devolver</h3>
          <CalendarDays className="h-4 w-4 text-orange-500" />
        </div>
        <div className="px-6 pb-6">
          <div className="text-2xl font-bold text-orange-500">{upcomingReturns}</div>
          <p className="text-xs text-gray-500">Próxima: {formatDate(nextReturnDate)}</p>
        </div>
      </div>
    </div>
  )
}
