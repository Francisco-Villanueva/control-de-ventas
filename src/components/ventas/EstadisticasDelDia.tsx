"use client"

import { useEstadisticasDelDia } from "@/hooks/useEstadisticas"
import { format } from "date-fns"
import { ShoppingCart, DollarSign, TrendingUp, TrendingDown, Package } from "lucide-react"

interface EstadisticasDelDiaProps {
  fecha: Date
}

export function EstadisticasDelDia({ fecha }: EstadisticasDelDiaProps) {
  const fechaStr = format(fecha, "yyyy-MM-dd")
  const { data, isLoading } = useEstadisticasDelDia(fechaStr)

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1A1A2E] rounded-xl border border-[#E5E9F2] dark:border-[#252536] p-4 animate-pulse"
          >
            <div className="h-4 bg-[#F8F9FC] dark:bg-[#252536] rounded mb-2 w-3/4" />
            <div className="h-7 bg-[#F8F9FC] dark:bg-[#252536] rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!data) return null

  const { dia, promedio } = data
  const esMejor = promedio.comparacion >= 0
  const sinVentas = dia.cantidad === 0

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {/* Unidades vendidas */}
        <div className="bg-white dark:bg-[#1A1A2E] rounded-xl border border-[#E5E9F2] dark:border-[#252536] border-l-4 border-l-[#FF6B35] p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
              Unidades
            </p>
            <div className="h-8 w-8 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E] dark:text-white">
            {sinVentas ? "—" : dia.cantidad}
          </p>
          <p className="text-xs text-[#6B7A94] dark:text-[#8E92A0] mt-0.5">
            {sinVentas ? "Sin ventas registradas" : "vendidas"}
          </p>
        </div>

        {/* Ingresos */}
        <div className="bg-white dark:bg-[#1A1A2E] rounded-xl border border-[#E5E9F2] dark:border-[#252536] border-l-4 border-l-[#00C9A7] p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
              Ingresos
            </p>
            <div className="h-8 w-8 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E] dark:text-white">
            {sinVentas ? "—" : `$${dia.ingresos.toFixed(0)}`}
          </p>
          <p className="text-xs text-[#6B7A94] dark:text-[#8E92A0] mt-0.5">
            pesos argentinos
          </p>
        </div>

        {/* vs Promedio */}
        <div
          className={`bg-white dark:bg-[#1A1A2E] rounded-xl border border-[#E5E9F2] dark:border-[#252536] border-l-4 ${
            sinVentas
              ? "border-l-[#E5E9F2] dark:border-l-[#252536]"
              : esMejor
              ? "border-l-[#10D47C]"
              : "border-l-[#FF5757]"
          } p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
              vs Promedio
            </p>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                sinVentas
                  ? "bg-[#F8F9FC] dark:bg-[#252536]"
                  : esMejor
                  ? "bg-gradient-to-br from-[#10D47C] to-[#2BE592]"
                  : "bg-gradient-to-br from-[#FF5757] to-[#FF7777]"
              }`}
            >
              {esMejor && !sinVentas ? (
                <TrendingUp className="h-4 w-4 text-white" />
              ) : !sinVentas ? (
                <TrendingDown className="h-4 w-4 text-white" />
              ) : (
                <TrendingUp className="h-4 w-4 text-[#B8BCC8]" />
              )}
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${
              sinVentas
                ? "text-[#B8BCC8]"
                : esMejor
                ? "text-[#10D47C]"
                : "text-[#FF5757]"
            }`}
          >
            {sinVentas
              ? "—"
              : `${promedio.comparacion > 0 ? "+" : ""}${promedio.comparacion.toFixed(0)}%`}
          </p>
          <p className="text-xs text-[#6B7A94] dark:text-[#8E92A0] mt-0.5">
            Prom: {promedio.cantidad} unidades
          </p>
        </div>
      </div>

      {/* Banner producto más vendido */}
      {!sinVentas && dia.productoMasVendido && dia.productoMasVendido.cantidad > 0 && (
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                Mejor producto del día
              </p>
              <p className="text-base font-bold text-white leading-tight">
                {dia.productoMasVendido.nombre}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-white">{dia.productoMasVendido.cantidad}</p>
            <p className="text-xs text-white/80">unidades</p>
          </div>
        </div>
      )}
    </div>
  )
}
