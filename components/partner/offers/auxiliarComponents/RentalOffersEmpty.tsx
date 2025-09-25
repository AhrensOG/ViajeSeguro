"use client"

import { Plus, Car, DollarSign, Calendar } from "lucide-react"

interface RentalOffersEmptyProps {
  onCreateOffer: () => void
}

export function RentalOffersEmpty({ onCreateOffer }: RentalOffersEmptyProps) {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ofertas de Alquiler</h1>
          <p className="text-gray-600 mt-2">Gestiona las ofertas de alquiler de tus vehículos</p>
        </div>
        <button 
          onClick={onCreateOffer} 
          className="inline-flex items-center px-4 py-2 bg-custom-golden-500 hover:bg-custom-golden-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Oferta
        </button>
      </div>

      {/* Estado vacío */}
      <div className="border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-lg">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-24 h-24 bg-custom-golden-100 rounded-full flex items-center justify-center mb-6">
            <Car className="w-12 h-12 text-custom-golden-600" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Comienza a generar ingresos!</h3>

          <p className="text-gray-600 mb-8 max-w-md">
            Crea tu primera oferta de alquiler para tus vehículos aprobados. Define precios, disponibilidad y
            condiciones para empezar a recibir reservas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Selecciona tu vehículo</h4>
              <p className="text-sm text-gray-600 text-center">Elige entre tus vehículos aprobados</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Define tu precio</h4>
              <p className="text-sm text-gray-600 text-center">Establece tarifas competitivas</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Configura disponibilidad</h4>
              <p className="text-sm text-gray-600 text-center">Elige cuándo alquilar</p>
            </div>
          </div>

          <button 
            onClick={onCreateOffer} 
            className="inline-flex items-center px-6 py-3 bg-custom-golden-500 hover:bg-custom-golden-600 text-white rounded-lg font-medium transition-colors text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear mi primera oferta
          </button>
        </div>
      </div>
    </div>
  )
}
