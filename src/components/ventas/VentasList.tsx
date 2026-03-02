"use client"

import { useVentasRecientes } from "@/hooks/useVentas"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2, TrendingUp, Package } from "lucide-react"

export function VentasList() {
  const { data: ventas, isLoading } = useVentasRecientes(7)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!ventas || ventas.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">
          No hay ventas registradas en los últimos 7 días
        </p>
      </div>
    )
  }

  // Agrupar ventas por fecha
  const ventasPorFecha = ventas.reduce((acc: any, venta: any) => {
    const fecha = format(new Date(venta.fecha), "yyyy-MM-dd")
    if (!acc[fecha]) {
      acc[fecha] = {
        fecha: new Date(venta.fecha),
        ventas: [],
        total: 0,
      }
    }
    acc[fecha].ventas.push(venta)
    acc[fecha].total += venta.cantidad
    return acc
  }, {})

  // Convertir a array y ordenar por fecha descendente
  const ventasAgrupadas = Object.values(ventasPorFecha).sort(
    (a: any, b: any) => b.fecha.getTime() - a.fecha.getTime()
  )

  return (
    <div className="space-y-4">
      {ventasAgrupadas.map((grupo: any) => (
        <div
          key={grupo.fecha.toISOString()}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {format(grupo.fecha, "EEEE, d 'de' MMMM", { locale: es })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(grupo.fecha, "yyyy-MM-dd")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {grupo.total}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grupo.ventas.map((venta: any) => (
                <div
                  key={venta.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {venta.producto.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {venta.producto.categoria?.nombre || "Sin categoría"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {venta.cantidad}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      unidades
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
