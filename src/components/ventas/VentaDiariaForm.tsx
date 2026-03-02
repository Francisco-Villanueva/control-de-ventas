"use client"

import { useState, useEffect } from "react"
import { useProductos } from "@/hooks/useProductos"
import { useVentas, useGuardarVentas } from "@/hooks/useVentas"
import { format } from "date-fns"
import { toast } from "sonner"
import { Save, Loader2 } from "lucide-react"

interface VentaDiariaFormProps {
  fecha: Date
}

export function VentaDiariaForm({ fecha }: VentaDiariaFormProps) {
  const { data: productos, isLoading: loadingProductos } = useProductos(true)
  const { data: ventasExistentes, isLoading: loadingVentas } = useVentas(fecha)
  const guardarVentas = useGuardarVentas()

  const [cantidades, setCantidades] = useState<Record<number, number>>({})

  // Cargar cantidades existentes cuando cambien las ventas o productos
  useEffect(() => {
    if (ventasExistentes && productos) {
      const cantidadesMap: Record<number, number> = {}

      // Inicializar todos los productos en 0
      productos.forEach((producto: any) => {
        cantidadesMap[producto.id] = 0
      })

      // Llenar con las ventas existentes
      ventasExistentes.forEach((venta: any) => {
        cantidadesMap[venta.productoId] = venta.cantidad
      })

      setCantidades(cantidadesMap)
    } else if (productos) {
      // Si no hay ventas, inicializar en 0
      const cantidadesMap: Record<number, number> = {}
      productos.forEach((producto: any) => {
        cantidadesMap[producto.id] = 0
      })
      setCantidades(cantidadesMap)
    }
  }, [ventasExistentes, productos])

  const handleCantidadChange = (productoId: number, valor: string) => {
    const cantidad = parseInt(valor) || 0
    setCantidades((prev) => ({
      ...prev,
      [productoId]: cantidad,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
        fecha: format(fecha, "yyyy-MM-dd"),
        ventas,
      })

      toast.success("Ventas guardadas exitosamente")
    } catch (error: any) {
      toast.error(error.message || "Error al guardar ventas")
    }
  }

  if (loadingProductos || loadingVentas) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No hay productos activos. Por favor, crea productos primero en la sección de configuración.
        </p>
      </div>
    )
  }

  // Agrupar productos por categoría
  const productosPorCategoria = productos.reduce((acc: any, producto: any) => {
    const categoriaNombre = producto.categoria?.nombre || "Sin categoría"
    if (!acc[categoriaNombre]) {
      acc[categoriaNombre] = []
    }
    acc[categoriaNombre].push(producto)
    return acc
  }, {})

  const totalUnidades = Object.values(cantidades).reduce(
    (sum: number, cant: number) => sum + cant,
    0
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumen rápido */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Total unidades:</strong> {totalUnidades}
        </p>
      </div>

      {/* Productos agrupados por categoría */}
      {Object.entries(productosPorCategoria).map(([categoria, prods]: [string, any]) => (
        <div
          key={categoria}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {categoria}
            </h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {prods.map((producto: any) => (
              <div
                key={producto.id}
                className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor={`producto-${producto.id}`}
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {producto.nombre}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ${producto.precio} c/u
                    </p>
                  </div>
                  <input
                    type="number"
                    id={`producto-${producto.id}`}
                    min="0"
                    value={cantidades[producto.id] || 0}
                    onChange={(e) =>
                      handleCantidadChange(producto.id, e.target.value)
                    }
                    className="w-24 px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg font-semibold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Botón guardar */}
      <button
        type="submit"
        disabled={guardarVentas.isPending}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {guardarVentas.isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Guardar Ventas
          </>
        )}
      </button>
    </form>
  )
}
