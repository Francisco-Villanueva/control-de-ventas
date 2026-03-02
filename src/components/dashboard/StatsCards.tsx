"use client"

import { useEstadisticasHoy } from "@/hooks/useEstadisticas"
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Calendar } from "lucide-react"

export function StatsCards() {
  const { data, isLoading } = useEstadisticasHoy()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
          >
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!data) return null

  const comparacion = data.promedio.comparacion
  const esMejor = comparacion >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total ventas hoy */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ventas Hoy
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {data.hoy.cantidad}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              unidades vendidas
            </p>
          </div>
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Ingresos hoy */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ingresos Hoy
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              ${data.hoy.ingresos.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              pesos argentinos
            </p>
          </div>
          <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Total del mes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total del Mes
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {data.mes.cantidad}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ${data.mes.ingresos.toFixed(0)} en ingresos
            </p>
          </div>
          <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Comparación vs promedio */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              vs Promedio
            </p>
            <div className="flex items-center gap-2 mt-2">
              <p className={`text-3xl font-bold ${esMejor ? "text-green-600" : "text-red-600"}`}>
                {comparacion > 0 ? "+" : ""}
                {comparacion.toFixed(0)}%
              </p>
              {esMejor ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Promedio: {data.promedio.cantidad} unidades
            </p>
          </div>
          <div className={`h-12 w-12 ${esMejor ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"} rounded-lg flex items-center justify-center`}>
            <Package className={`h-6 w-6 ${esMejor ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} />
          </div>
        </div>
      </div>

      {/* Producto más vendido (si existe) */}
      {data.hoy.productoMasVendido && (
        <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                🏆 Producto Más Vendido Hoy
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                {data.hoy.productoMasVendido.nombre}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {data.hoy.productoMasVendido.cantidad} unidades vendidas
              </p>
            </div>
            <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
