"use client"

import { usePromediosPorDiaSemana } from "@/hooks/useEstadisticas"
import { Loader2, TrendingUp, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PromediosTable() {
  const { data: promedios, isLoading } = usePromediosPorDiaSemana()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-[#8B5FBF]" />
      </div>
    )
  }

  if (!promedios || promedios.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-8">
        <div className="h-16 w-16 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Calendar className="h-8 w-8 text-white" />
        </div>
        <p className="text-[#1A1A2E] dark:text-white font-semibold text-lg mb-2">
          No hay suficientes datos
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
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
      <div className="bg-gradient-to-r from-[#10D47C]/10 to-transparent border-2 border-[#10D47C]/20 rounded-xl p-5 flex items-center gap-4">
        <div className="h-12 w-12 bg-gradient-to-br from-[#10D47C] to-[#2BE592] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
          <strong className="text-[#10D47C] text-base">{diaMayorVenta.diaNombre}</strong> es tu día de mayor venta
          promedio con <strong className="text-[#10D47C] text-base">{Math.round(diaMayorVenta.total)}</strong> unidades
        </p>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] overflow-hidden">
          <table className="min-w-full divide-y-2 divide-[#E5E9F2] dark:divide-[#2D2D44]">
            <thead className="bg-gradient-to-r from-[#8B5FBF]/10 to-transparent sticky top-0 z-20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider sticky left-0 bg-gradient-to-r from-[#8B5FBF]/10 to-transparent z-10">
                  Día
                </th>
                {productosArray.map((producto) => (
                  <th
                    key={producto}
                    className="px-6 py-4 text-center text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider"
                  >
                    {producto}
                  </th>
                ))}
                <th className="px-6 py-4 text-center text-xs font-bold text-[#8B5FBF] uppercase tracking-wider bg-[#8B5FBF]/10">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1A1A2E] divide-y-2 divide-[#E5E9F2] dark:divide-[#2D2D44]">
              {totalesPorDia.map((dia: any) => {
                const esHoy = dia.diaSemana === diaActual
                return (
                  <tr
                    key={dia.diaSemana}
                    className={
                      esHoy
                        ? "bg-gradient-to-r from-[#8B5FBF]/10 to-transparent font-semibold shadow-[inset_0_0_0_2px_rgba(139,95,191,0.2)]"
                        : "hover:bg-[#F8F9FC] dark:hover:bg-[#252536] transition-colors"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1A2E] dark:text-white sticky left-0 bg-inherit z-10">
                      <div className="flex items-center gap-3">
                        <span className={esHoy ? "text-[#8B5FBF] font-bold text-base" : ""}>
                          {dia.diaNombre}
                        </span>
                        {esHoy && (
                          <Badge variant="default" className="bg-[#8B5FBF] text-xs">
                            Hoy
                          </Badge>
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
                          className="px-6 py-4 whitespace-nowrap text-sm text-center text-[#1A1A2E] dark:text-white font-mono"
                        >
                          {prod ? Math.round(prod.promedio) : "-"}
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-base text-center font-bold text-[#8B5FBF] bg-[#8B5FBF]/10">
                      {Math.round(dia.total)}
                    </td>
                  </tr>
                )
              })}
              {/* Fila de totales */}
              <tr className="bg-gradient-to-r from-[#8B5FBF]/20 to-transparent font-bold">
                <td className="px-6 py-5 whitespace-nowrap text-sm text-[#1A1A2E] dark:text-white sticky left-0 bg-gradient-to-r from-[#8B5FBF]/20 to-transparent z-10">
                  Promedio Semanal
                </td>
                {productosArray.map((producto) => (
                  <td
                    key={producto}
                    className="px-6 py-5 whitespace-nowrap text-sm text-center text-[#1A1A2E] dark:text-white font-mono"
                  >
                    {Math.round(totalesPorProducto[producto] / 7)}
                  </td>
                ))}
                <td className="px-6 py-5 whitespace-nowrap text-lg text-center font-bold text-[#8B5FBF] bg-[#8B5FBF]/20">
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
      <div className="lg:hidden space-y-5">
        {totalesPorDia.map((dia: any) => {
          const esHoy = dia.diaSemana === diaActual
          return (
            <div
              key={dia.diaSemana}
              className={`rounded-2xl shadow-md border-2 overflow-hidden transition-all duration-300 ${
                esHoy
                  ? "bg-gradient-to-br from-[#8B5FBF]/10 to-transparent border-[#8B5FBF]/40 shadow-lg"
                  : "bg-white dark:bg-[#1A1A2E] border-[#E5E9F2] dark:border-[#2D2D44]"
              }`}
            >
              <div
                className={`px-5 py-4 border-b-2 flex items-center justify-between ${
                  esHoy
                    ? "bg-gradient-to-r from-[#8B5FBF]/20 to-transparent border-[#8B5FBF]/20"
                    : "bg-gradient-to-r from-[#F8F9FC] to-transparent dark:from-[#252536] dark:to-transparent border-[#E5E9F2] dark:border-[#2D2D44]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <h3 className={`text-xl font-bold ${esHoy ? "text-[#8B5FBF]" : "text-[#1A1A2E] dark:text-white"}`}>
                    {dia.diaNombre}
                  </h3>
                  {esHoy && (
                    <Badge variant="default" className="bg-[#8B5FBF]">
                      Hoy
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-[#8B5FBF]">
                  {Math.round(dia.total)}
                </p>
              </div>
              <div className="p-5 space-y-3">
                {dia.productos.map((prod: any) => (
                  <div
                    key={prod.productoId}
                    className="flex items-center justify-between py-3 px-4 rounded-lg bg-gradient-to-r from-[#F8F9FC] to-transparent dark:from-[#252536] dark:to-transparent border border-[#E5E9F2] dark:border-[#2D2D44]"
                  >
                    <span className="text-sm font-semibold text-[#424C63] dark:text-[#B8BCC8]">
                      {prod.productoNombre}
                    </span>
                    <span className="text-lg font-bold text-[#1A1A2E] dark:text-white font-mono">
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
