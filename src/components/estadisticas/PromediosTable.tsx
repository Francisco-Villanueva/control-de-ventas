"use client"

import { usePromediosPorDiaSemana } from "@/hooks/useEstadisticas"
import { Loader2, TrendingUp, Calendar } from "lucide-react"

export function PromediosTable() {
  const { data: promedios, isLoading } = usePromediosPorDiaSemana()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!promedios || promedios.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">
          No hay suficientes datos para calcular promedios
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Registra ventas durante varios días para ver los promedios por día de la semana
        </p>
      </div>
    )
  }

  // Obtener el día actual de la semana (0 = Domingo, 6 = Sábado)
  const diaActual = new Date().getDay()

  // Obtener todos los productos únicos
  const todosLosProductos = new Set<string>()
  promedios.forEach((dia: any) => {
    dia.productos.forEach((prod: any) => {
      todosLosProductos.add(prod.productoNombre)
    })
  })
  const productosArray = Array.from(todosLosProductos)

  // Calcular totales por día
  const totalesPorDia = promedios.map((dia: any) => {
    const total = dia.productos.reduce(
      (sum: number, prod: any) => sum + prod.promedio,
      0
    )
    return { ...dia, total }
  })

  // Calcular totales por producto
  const totalesPorProducto: Record<string, number> = {}
  productosArray.forEach((producto) => {
    totalesPorProducto[producto] = 0
  })

  promedios.forEach((dia: any) => {
    dia.productos.forEach((prod: any) => {
      totalesPorProducto[prod.productoNombre] += prod.promedio
    })
  })

  // Encontrar el día con mayor venta
  const diaMayorVenta = totalesPorDia.reduce((max: any, dia: any) =>
    dia.total > max.total ? dia : max
  )

  return (
    <div className="space-y-4">
      {/* Indicador del día con mayor venta */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>{diaMayorVenta.diaNombre}</strong> es tu día de mayor venta
            promedio con <strong>{Math.round(diaMayorVenta.total)}</strong> unidades
          </p>
        </div>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">
                  Día
                </th>
                {productosArray.map((producto) => (
                  <th
                    key={producto}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {producto}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {totalesPorDia.map((dia: any) => {
                const esHoy = dia.diaSemana === diaActual
                return (
                  <tr
                    key={dia.diaSemana}
                    className={
                      esHoy
                        ? "bg-blue-50 dark:bg-blue-900/20 font-semibold"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white sticky left-0 bg-inherit z-10">
                      <div className="flex items-center gap-2">
                        {dia.diaNombre}
                        {esHoy && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            Hoy
                          </span>
                        )}
                      </div>
                    </td>
                    {productosArray.map((producto) => {
                      const prod = dia.productos.find(
                        (p: any) => p.productoNombre === producto
                      )
                      return (
                        <td
                          key={producto}
                          className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white"
                        >
                          {prod ? Math.round(prod.promedio) : "-"}
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30">
                      {Math.round(dia.total)}
                    </td>
                  </tr>
                )
              })}
              {/* Fila de totales */}
              <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white sticky left-0 bg-gray-100 dark:bg-gray-700 z-10">
                  Promedio Semanal
                </td>
                {productosArray.map((producto) => (
                  <td
                    key={producto}
                    className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white"
                  >
                    {Math.round(totalesPorProducto[producto] / 7)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40">
                  {Math.round(
                    totalesPorDia.reduce((sum: number, dia: any) => sum + dia.total, 0) / 7
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden space-y-4">
        {totalesPorDia.map((dia: any) => {
          const esHoy = dia.diaSemana === diaActual
          return (
            <div
              key={dia.diaSemana}
              className={`rounded-lg shadow-sm border overflow-hidden ${
                esHoy
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${
                  esHoy
                    ? "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dia.diaNombre}
                  </h3>
                  {esHoy && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      Hoy
                    </span>
                  )}
                </div>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(dia.total)}
                </p>
              </div>
              <div className="p-4 space-y-2">
                {dia.productos.map((prod: any) => (
                  <div
                    key={prod.productoId}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {prod.productoNombre}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {Math.round(prod.promedio)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
