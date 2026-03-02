"use client"

import { usePrediccionProduccion } from "@/hooks/useEstadisticas"
import { Loader2, Lightbulb, TrendingUp, Calendar } from "lucide-react"

export function ProduccionSugeridaWidget() {
  const { data, isLoading } = usePrediccionProduccion()

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (!data || data.predicciones.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No hay suficiente información para generar predicciones
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Registra ventas durante al menos 2 semanas para ver sugerencias
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-green-900 dark:text-green-100">
            Sugerencia de Producción
          </h2>
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <Calendar className="h-4 w-4" />
            <span className="capitalize">{data.diaSemana}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Basado en el promedio histórico de los <span className="font-semibold">{data.diaSemana}s</span>,
          te sugerimos producir:
        </p>
      </div>

      {/* Lista de sugerencias */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
        {data.predicciones.map((pred: any, index: number) => {
          const esTop3 = index < 3
          return (
            <div
              key={pred.productoId}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                esTop3
                  ? "bg-white dark:bg-gray-800 border-green-300 dark:border-green-700 shadow-sm"
                  : "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {esTop3 && (
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-700 dark:text-green-300">
                      {index + 1}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {pred.nombre}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Basado en {pred.basadoEnDias} {pred.basadoEnDias === 1 ? "día" : "días"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {pred.cantidadSugerida}
                </span>
                {esTop3 && <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
        <p className="text-xs text-green-800 dark:text-green-200">
          💡 <strong>Tip:</strong> Estas cantidades son estimaciones basadas en tu historial.
          Ajusta según eventos especiales o cambios en la demanda.
        </p>
      </div>
    </div>
  )
}
