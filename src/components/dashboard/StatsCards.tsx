"use client";

import { useEstadisticasHoy } from "@/hooks/useEstadisticas";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Calendar,
} from "lucide-react";

export function StatsCards() {
  const { data, isLoading } = useEstadisticasHoy();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md border-l-4 border-[#E5E9F2] p-6 animate-pulse"
          >
            <div className="h-16 bg-[#F8F9FC] dark:bg-[#252536] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const comparacion = data.promedio.comparacion;
  const esMejor = comparacion >= 0;

  console.log("Datos de estadísticas:", data);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Total ventas hoy */}
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#FF6B35] p-6 group cursor-pointer hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
            Ventas Hoy
          </p>
          <div className="h-12 w-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-4xl font-bold text-[#1A1A2E] dark:text-white mb-1">
          {data.hoy.cantidad}
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          unidades vendidas
        </p>
      </div>

      {/* Ingresos hoy */}
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#00C9A7] p-6 group cursor-pointer hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
            Ingresos Hoy
          </p>
          <div className="h-12 w-12 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-4xl font-bold text-[#1A1A2E] dark:text-white mb-1">
          ${data.hoy.ingresos.toFixed(0)}
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          pesos argentinos
        </p>
      </div>

      {/* Total del mes */}
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#8B5FBF] p-6 group cursor-pointer hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
            Total del Mes
          </p>
          <div className="h-12 w-12 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Calendar className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-4xl font-bold text-[#1A1A2E] dark:text-white mb-1">
          {data.mes.cantidad}
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          ${data.mes.ingresos.toFixed(0)} en ingresos
        </p>
      </div>

      {/* Comparación vs promedio */}
      <div
        className={`bg-white dark:bg-[#1A1A2E] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${esMejor ? "border-[#10D47C]" : "border-[#FF5757]"} p-6 group cursor-pointer hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#424C63] dark:text-[#B8BCC8]">
            vs Promedio
          </p>
          <div
            className={`h-12 w-12 ${esMejor ? "bg-gradient-to-br from-[#10D47C] to-[#2BE592]" : "bg-gradient-to-br from-[#FF5757] to-[#FF7777]"} rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
          >
            {esMejor ? (
              <TrendingUp className="h-6 w-6 text-white" />
            ) : (
              <TrendingDown className="h-6 w-6 text-white" />
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <p
            className={`text-4xl font-bold ${esMejor ? "text-[#10D47C]" : "text-[#FF5757]"}`}
          >
            {comparacion > 0 ? "+" : ""}
            {comparacion.toFixed(0)}%
          </p>
        </div>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          Promedio: {data.promedio.cantidad} unidades
        </p>
      </div>

      {/* Producto más vendido (si existe) */}
      {data.hoy.productoMasVendido &&
        data.hoy.productoMasVendido.cantidad > 0 && (
          <div className="md:col-span-2 xl:col-span-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] rounded-2xl shadow-xl border-2 border-[#FF6B35]/20 p-8 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl animate-pulse">🏆</span>
                  <p className="text-sm font-bold uppercase tracking-wider text-white/90">
                    Producto Más Vendido Hoy
                  </p>
                </div>
                <p className="text-3xl font-bold text-white mt-2 mb-2 drop-shadow-md">
                  {data.hoy.productoMasVendido.nombre}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Package className="h-5 w-5 text-white" />
                  <span className="text-base font-semibold text-white">
                    {data.hoy.productoMasVendido.cantidad} unidades vendidas
                  </span>
                </div>
              </div>
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Package className="h-10 w-10 text-[#FF6B35]" />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
