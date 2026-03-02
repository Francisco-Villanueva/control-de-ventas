"use client"

import { usePromediosPorDiaSemana } from "@/hooks/useEstadisticas"
import { TrendingUp, TrendingDown, Calendar, Package } from "lucide-react"

export function StatsCards() {
  const { data: promedios, isLoading } = usePromediosPorDiaSemana()

  if (isLoading || !promedios || promedios.length === 0) {
    return null
  }

  // Calcular estadísticas
  const totalesPorDia = promedios.map((dia: any) => ({
    dia: dia.diaNombre,
    total: dia.productos.reduce(
      (sum: number, prod: any) => sum + prod.promedio,
      0
    ),
  }))

  const diaMayorVenta = totalesPorDia.reduce((max: any, dia: any) =>
    dia.total > max.total ? dia : max
  )

  const diaMenorVenta = totalesPorDia.reduce((min: any, dia: any) =>
    dia.total < min.total ? dia : min
  )

  const promedioSemanal =
    totalesPorDia.reduce((sum: number, dia: any) => sum + dia.total, 0) / 7

  // Producto más vendido en promedio
  const ventasPorProducto: Record<string, number> = {}
  promedios.forEach((dia: any) => {
    dia.productos.forEach((prod: any) => {
      if (!ventasPorProducto[prod.productoNombre]) {
        ventasPorProducto[prod.productoNombre] = 0
      }
      ventasPorProducto[prod.productoNombre] += prod.promedio
    })
  })

  const productoMasVendido = Object.entries(ventasPorProducto).reduce(
    (max, [nombre, total]) =>
      total > max.total ? { nombre, total } : max,
    { nombre: "", total: 0 }
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Promedio Semanal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Promedio Semanal
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(promedioSemanal)}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              unidades/día
            </p>
          </div>
          <Calendar className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Día de Mayor Venta */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Día Pico
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
              {diaMayorVenta.dia}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {Math.round(diaMayorVenta.total)} unidades
            </p>
          </div>
          <TrendingUp className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
      </div>

      {/* Día de Menor Venta */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Día Valle
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {diaMenorVenta.dia}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {Math.round(diaMenorVenta.total)} unidades
            </p>
          </div>
          <TrendingDown className="h-10 w-10 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      {/* Producto Más Vendido */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Top Producto
            </p>
            <p className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400 truncate">
              {productoMasVendido.nombre}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {Math.round(productoMasVendido.total / 7)} unid/día
            </p>
          </div>
          <Package className="h-10 w-10 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" />
        </div>
      </div>
    </div>
  )
}
