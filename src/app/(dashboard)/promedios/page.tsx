"use client"

import { StatsCards } from "@/components/estadisticas/StatsCards"
import { PromediosTable } from "@/components/estadisticas/PromediosTable"
import { PromediosChart } from "@/components/estadisticas/PromediosChart"
import { BarChart3, Info } from "lucide-react"

export default function PromediosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Promedios por Día de Semana
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Analiza tus ventas promedio para planificar mejor tu producción
          </p>
        </div>
        <BarChart3 className="h-8 w-8 text-blue-600" />
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">¿Cómo usar estos promedios?</p>
            <p>
              Los promedios te ayudan a predecir cuánto debes producir cada día. Por
              ejemplo, si el promedio del lunes es 50 empanadas de carne, considera
              producir esa cantidad (o un poco más) para el próximo lunes.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Gráfico */}
      <PromediosChart />

      {/* Tabla Detallada */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tabla Detallada
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Promedios de ventas por producto y día de la semana
          </p>
        </div>
        <PromediosTable />
      </div>

      {/* Nota al pie */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Nota:</strong> Los promedios se calculan basándose en todas las
          ventas históricas registradas. Cuantos más datos tengas, más precisos serán
          los promedios. El día actual está resaltado en azul.
        </p>
      </div>
    </div>
  )
}
