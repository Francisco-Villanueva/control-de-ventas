"use client"

import { usePromediosPorDiaSemana } from "@/hooks/useEstadisticas"
import { TrendingUp, TrendingDown, Calendar, Package } from "lucide-react"

export function StatsCards({ mes }: { mes?: string }) {
  const { data: promedios, isLoading } = usePromediosPorDiaSemana(mes)

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Promedio Semanal */}
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#8B5FBF] p-6 group cursor-pointer hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
            Promedio Semanal
          </p>
          <div className="h-12 w-12 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Calendar className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-4xl font-bold text-[#1A1A2E] dark:text-white mb-1">
          {Math.round(promedioSemanal)}
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          unidades/día
        </p>
      </div>

      {/* Día de Mayor Venta */}
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#10D47C] p-6 group cursor-pointer hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
            Día Pico
          </p>
          <div className="h-12 w-12 bg-gradient-to-br from-[#10D47C] to-[#2BE592] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-3xl font-bold text-[#10D47C] mb-1">
          {diaMayorVenta.dia}
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          {Math.round(diaMayorVenta.total)} unidades
        </p>
      </div>

      {/* Día de Menor Venta */}
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#FFB627] p-6 group cursor-pointer hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
            Día Valle
          </p>
          <div className="h-12 w-12 bg-gradient-to-br from-[#FFB627] to-[#FFA500] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-3xl font-bold text-[#FFB627] mb-1">
          {diaMenorVenta.dia}
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          {Math.round(diaMenorVenta.total)} unidades
        </p>
      </div>

      {/* Producto Más Vendido */}
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#FF6B35] p-6 group cursor-pointer hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
            Top Producto
          </p>
          <div className="h-12 w-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Package className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-1 truncate">
          {productoMasVendido.nombre}
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          {Math.round(productoMasVendido.total / 7)} unid/día
        </p>
      </div>
    </div>
  )
}
