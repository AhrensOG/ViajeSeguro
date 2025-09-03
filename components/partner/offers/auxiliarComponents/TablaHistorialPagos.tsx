"use client"

import { DollarSign, Download, Filter } from "lucide-react"

interface RegistroPago {
  id: number
  vehicleName: string
  renterName: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  paymentMethod: string
  transactionId: string
}

interface TablaHistorialPagosProps {
  payments: RegistroPago[]
}

export function TablaHistorialPagos({ payments }: TablaHistorialPagosProps) {
  const getStatusBadge = (status: RegistroPago["status"]) => {
    switch (status) {
      case "completed":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Completado</span>
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pendiente</span>
      case "failed":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Fallido</span>
    }
  }

  const totalEarnings = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  
  // Calcular ganancias reales del partner (78% después de comisión del 22%)
  const calculatePartnerEarnings = (totalAmount: number) => {
    return totalAmount * 0.78
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Historial de Pagos
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Ganancias netas (78%): <span className="font-bold text-green-600">${calculatePartnerEarnings(totalEarnings).toLocaleString()}</span>
          <br />
          <span className="text-xs text-gray-400">Total bruto: ${totalEarnings.toLocaleString()}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-600">Vehículo</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Cliente</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Monto Total</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Ganancias (78%)</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Fecha</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Estado</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Método</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">ID Transacción</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{payment.vehicleName}</td>
                  <td className="py-3 px-2">{payment.renterName}</td>
                  <td className="py-3 px-2 font-bold text-blue-600">${payment.amount}</td>
                  <td className="py-3 px-2 font-bold text-green-600">${calculatePartnerEarnings(payment.amount).toFixed(2)}</td>
                  <td className="py-3 px-2 text-gray-600">{payment.date}</td>
                  <td className="py-3 px-2">{getStatusBadge(payment.status)}</td>
                  <td className="py-3 px-2 text-gray-600">{payment.paymentMethod}</td>
                  <td className="py-3 px-2 text-xs text-gray-600 font-mono">{payment.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
