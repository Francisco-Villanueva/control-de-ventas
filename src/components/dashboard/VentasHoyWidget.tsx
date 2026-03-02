"use client"

import { useState, useEffect } from "react"
import { useProductos } from "@/hooks/useProductos"
import { useVentas, useGuardarVentas } from "@/hooks/useVentas"
import { toast } from "sonner"
import { Save, Loader2, CheckCircle2 } from "lucide-react"
import { startOfDay, format } from "date-fns"
import { es } from "date-fns/locale"

export function VentasHoyWidget() {
  const hoy = startOfDay(new Date())
  const { data: productos, isLoading: isLoadingProductos } = useProductos(true)
  const { data: ventasExistentes, isLoading: isLoadingVentas } = useVentas(hoy)
  const guardarVentas = useGuardarVentas()

  const [cantidades, setCantidades] = useState<Record<number, number>>({})

  // Cargar ventas existentes cuando estén disponibles
  useEffect(() => {
    if (ventasExistentes && ventasExistentes.length > 0) {
      const cantidadesIniciales: Record<number, number> = {}
      ventasExistentes.forEach((v: any) => {
        cantidadesIniciales[v.productoId] = v.cantidad
      })
      setCantidades(cantidadesIniciales)
    }
  }, [ventasExistentes])

  const handleCantidadChange = (productoId: number, valor: string) => {
    const cantidad = parseInt(valor) || 0
    setCantidades((prev) => ({
      ...prev,
      [productoId]: cantidad,
    }))
  }

  const handleGuardar = async () => {
    const ventas = Object.entries(cantidades)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([productoId, cantidad]) => ({
        productoId: parseInt(productoId),
        cantidad,
      }))

    if (ventas.length === 0) {
      toast.error("Debes ingresar al menos una venta")
      return
    }

    try {
      await guardarVentas.mutateAsync({
        fecha: format(hoy, "yyyy-MM-dd"),
        ventas,
      })
      toast.success("Ventas registradas correctamente")
    } catch (error: any) {
      toast.error(error.message || "Error al guardar ventas")
    }
  }

  const totalUnidades = Object.values(cantidades).reduce((sum, cant) => sum + cant, 0)
  const hayVentas = totalUnidades > 0

  if (isLoadingProductos || isLoadingVentas) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Agrupar por categoría
  const productosPorCategoria = productos?.reduce((acc: any, producto: any) => {
    const categoriaNombre = producto.categoria?.nombre || "Sin categoría"
    if (!acc[categoriaNombre]) {
      acc[categoriaNombre] = []
    }
    acc[categoriaNombre].push(producto)
    return acc
  }, {})

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Registro Rápido
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {format(hoy, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>
        {hayVentas && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
              {totalUnidades} unidades
            </span>
          </div>
        )}
      </div>

      {/* Formulario simplificado */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {productosPorCategoria &&
          Object.entries(productosPorCategoria).map(([categoria, prods]: [string, any]) => (
            <div key={categoria} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 sticky top-0 bg-white dark:bg-gray-800 py-1">
                {categoria}
              </h3>
              {prods.map((producto: any) => (
                <div
                  key={producto.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <label
                    htmlFor={`producto-${producto.id}`}
                    className="flex-1 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                  >
                    {producto.nombre}
                  </label>
                  <input
                    id={`producto-${producto.id}`}
                    type="number"
                    min="0"
                    value={cantidades[producto.id] || ""}
                    onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                    className="w-20 px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Botón guardar */}
      <button
        onClick={handleGuardar}
        disabled={!hayVentas || guardarVentas.isPending}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
      >
        {guardarVentas.isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Guardar Ventas de Hoy
          </>
        )}
      </button>
    </div>
  )
}
