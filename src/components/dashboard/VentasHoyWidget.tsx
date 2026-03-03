"use client"

import { useState, useEffect } from "react"
import { useProductos } from "@/hooks/useProductos"
import { useVentas, useGuardarVentas } from "@/hooks/useVentas"
import { toast } from "sonner"
import { Save, Loader2, CheckCircle2, Plus, Minus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getTodayString, fromDateString } from "@/lib/dateUtils"

export function VentasHoyWidget() {
  const hoy = fromDateString(getTodayString())
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
        fecha: getTodayString(),
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
      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[#F8F9FC] dark:bg-[#252536] rounded-lg w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[#F8F9FC] dark:bg-[#252536] rounded-xl"></div>
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
    <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-1">
            Registro Rápido
          </h2>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            {format(hoy, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>
        {hayVentas && (
          <Badge variant="secondary" className="flex items-center gap-1.5 px-4 py-2">
            <CheckCircle2 className="h-4 w-4" />
            {totalUnidades} unidades
          </Badge>
        )}
      </div>

      {/* Formulario mejorado */}
      <div className="space-y-5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {productosPorCategoria &&
          Object.entries(productosPorCategoria).map(([categoria, prods]: [string, any]) => (
            <div key={categoria} className="space-y-3">
              <div className="sticky top-0 bg-white dark:bg-[#1A1A2E] py-2 z-10">
                <Badge variant="outline" className="font-semibold">
                  {categoria}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {prods.map((producto: any) => (
                  <div
                    key={producto.id}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-[#E5E9F2] dark:border-[#2D2D44] hover:border-[#FF6B35]/30 dark:hover:border-[#FF6B35]/30 transition-all duration-200 bg-gradient-to-r from-transparent to-[#FF6B35]/5"
                  >
                    <label
                      htmlFor={`producto-${producto.id}`}
                      className="flex-1 text-sm font-semibold text-[#1A1A2E] dark:text-white cursor-pointer"
                    >
                      {producto.nombre}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = cantidades[producto.id] || 0
                          if (currentValue > 0) {
                            handleCantidadChange(producto.id, String(currentValue - 1))
                          }
                        }}
                        className="h-8 w-8 rounded-lg bg-[#F8F9FC] dark:bg-[#252536] hover:bg-[#E5E9F2] dark:hover:bg-[#2D2D44] flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-4 w-4 text-[#6B7A94]" />
                      </button>
                      <input
                        id={`producto-${producto.id}`}
                        type="number"
                        min="0"
                        value={cantidades[producto.id] || ""}
                        onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                        className="w-16 px-3 py-2 text-center text-base font-bold border-2 border-[#E5E9F2] dark:border-[#2D2D44] rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 bg-white dark:bg-[#1A1A2E] text-[#1A1A2E] dark:text-white transition-all duration-200"
                        placeholder="0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = cantidades[producto.id] || 0
                          handleCantidadChange(producto.id, String(currentValue + 1))
                        }}
                        className="h-8 w-8 rounded-lg bg-[#FF6B35] hover:bg-[#E85A2A] flex items-center justify-center transition-colors shadow-md"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Botón guardar */}
      <Button
        onClick={handleGuardar}
        disabled={!hayVentas || guardarVentas.isPending}
        variant="gradient"
        size="lg"
        className="w-full mt-6"
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
      </Button>
    </div>
  )
}
