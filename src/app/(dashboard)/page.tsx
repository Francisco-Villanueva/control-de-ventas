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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Vista general de tu rotisería
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/ventas"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors"
          >
            <Package className="h-4 w-4" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/promedios"
          className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Ver Promedios
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analiza las ventas promedio por día de la semana
          </p>
        </Link>

        <Link
          href="/reportes"
          className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Reportes
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Consulta reportes mensuales y anuales
          </p>
        </Link>

        <Link
          href="/configuracion/productos"
          className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Productos
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestiona tu catálogo de productos
          </p>
        </Link>
      </div>
    </div>
  )
}
