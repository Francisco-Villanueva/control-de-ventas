"use client"

import { StatsCards } from "@/components/dashboard/StatsCards"
import { VentasHoyWidget } from "@/components/dashboard/VentasHoyWidget"
import { ProduccionSugeridaWidget } from "@/components/dashboard/ProduccionSugeridaWidget"
import { AlertasCard } from "@/components/dashboard/AlertasCard"
import { BarChart3, TrendingUp, Package } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">
            Dashboard
          </h1>
          <p className="mt-2 text-base text-[#6B7A94] dark:text-[#8E92A0]">
            Vista general de tu rotisería
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/ventas"
            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Package className="h-5 w-5" />
            Registrar Ventas
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registro rápido de ventas */}
        <VentasHoyWidget />

        {/* Sugerencia de producción */}
        <ProduccionSugeridaWidget />
      </div>

      {/* Alertas */}
      <AlertasCard />

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/promedios"
          className="group bg-gradient-to-br from-[#8B5FBF]/5 to-transparent p-8 rounded-2xl shadow-md border-2 border-[#8B5FBF]/20 hover:border-[#8B5FBF]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-14 w-14 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <svg className="h-6 w-6 text-[#8B5FBF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-2">
            Ver Promedios
          </h3>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            Analiza las ventas promedio por día de la semana
          </p>
        </Link>

        <Link
          href="/reportes"
          className="group bg-gradient-to-br from-[#4ECDC4]/5 to-transparent p-8 rounded-2xl shadow-md border-2 border-[#4ECDC4]/20 hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-14 w-14 bg-gradient-to-br from-[#4ECDC4] to-[#6EDDD4] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <svg className="h-6 w-6 text-[#4ECDC4] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-2">
            Reportes
          </h3>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            Consulta reportes mensuales y anuales
          </p>
        </Link>

        <Link
          href="/configuracion/productos"
          className="group bg-gradient-to-br from-[#00C9A7]/5 to-transparent p-8 rounded-2xl shadow-md border-2 border-[#00C9A7]/20 hover:border-[#00C9A7]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-14 w-14 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Package className="h-7 w-7 text-white" />
            </div>
            <svg className="h-6 w-6 text-[#00C9A7] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-2">
            Productos
          </h3>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            Gestiona tu catálogo de productos
          </p>
        </Link>
      </div>
    </div>
  )
}
