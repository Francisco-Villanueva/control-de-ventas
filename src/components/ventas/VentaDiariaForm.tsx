"use client"

import { useState, useEffect } from "react"
import { useProductos } from "@/hooks/useProductos"
import { useVentas, useGuardarVentas } from "@/hooks/useVentas"
import { toDateString } from "@/lib/dateUtils"
import { toast } from "sonner"
import { Save, Loader2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
        fecha: toDateString(fecha),
        ventas,
      })

      toast.success("Ventas guardadas exitosamente")
    } catch (error: any) {
      toast.error(error.message || "Error al guardar ventas")
    }
  }

  if (loadingProductos || loadingVentas) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF6B35]" />
      </div>
    )
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-8">
        <div className="h-16 w-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Save className="h-8 w-8 text-white" />
        </div>
        <p className="text-[#1A1A2E] dark:text-white font-semibold text-lg mb-2">
          No hay productos activos
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          Por favor, crea productos primero en la sección de configuración.
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
      <div className="bg-gradient-to-r from-[#FF6B35]/10 to-transparent border-2 border-[#FF6B35]/20 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7A94] dark:text-[#8E92A0] mb-1">
            Total unidades
          </p>
          <p className="text-3xl font-bold text-[#FF6B35]">
            {totalUnidades}
          </p>
        </div>
        <Badge variant="default" className="text-base px-5 py-2">
          {Object.values(cantidades).filter((c: number) => c > 0).length} productos
        </Badge>
      </div>

      {/* Productos agrupados por categoría */}
      <div className="space-y-6">
        {Object.entries(productosPorCategoria).map(([categoria, prods]: [string, any]) => (
          <div
            key={categoria}
            className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#FF6B35]/5 to-transparent px-6 py-4 border-b-2 border-[#E5E9F2] dark:border-[#2D2D44]">
              <Badge variant="outline" className="text-base font-bold">
                {categoria}
              </Badge>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prods.map((producto: any) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-[#E5E9F2] dark:border-[#2D2D44] hover:border-[#FF6B35]/30 dark:hover:border-[#FF6B35]/30 transition-all duration-200 bg-gradient-to-r from-transparent to-[#FF6B35]/5"
                  >
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`producto-${producto.id}`}
                        className="block text-sm font-bold text-[#1A1A2E] dark:text-white mb-1 cursor-pointer truncate"
                      >
                        {producto.nombre}
                      </label>
                      <p className="text-xs text-[#6B7A94] dark:text-[#8E92A0]">
                        ${producto.precio} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = cantidades[producto.id] || 0
                          if (currentValue > 0) {
                            handleCantidadChange(producto.id, String(currentValue - 1))
                          }
                        }}
                        className="h-9 w-9 rounded-lg bg-[#F8F9FC] dark:bg-[#252536] hover:bg-[#E5E9F2] dark:hover:bg-[#2D2D44] flex items-center justify-center transition-colors flex-shrink-0"
                      >
                        <Minus className="h-4 w-4 text-[#6B7A94]" />
                      </button>
                      <input
                        type="number"
                        id={`producto-${producto.id}`}
                        min="0"
                        value={cantidades[producto.id] || 0}
                        onChange={(e) =>
                          handleCantidadChange(producto.id, e.target.value)
                        }
                        className="w-20 px-3 py-2 text-center text-lg font-bold border-2 border-[#E5E9F2] dark:border-[#2D2D44] rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 bg-white dark:bg-[#1A1A2E] text-[#1A1A2E] dark:text-white transition-all duration-200 flex-shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = cantidades[producto.id] || 0
                          handleCantidadChange(producto.id, String(currentValue + 1))
                        }}
                        className="h-9 w-9 rounded-lg bg-[#FF6B35] hover:bg-[#E85A2A] flex items-center justify-center transition-colors shadow-md flex-shrink-0"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón guardar */}
      <Button
        type="submit"
        disabled={guardarVentas.isPending}
        variant="gradient"
        size="xl"
        className="w-full"
      >
        {guardarVentas.isPending ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="h-6 w-6" />
            Guardar Ventas
          </>
        )}
      </Button>
    </form>
  )
}
