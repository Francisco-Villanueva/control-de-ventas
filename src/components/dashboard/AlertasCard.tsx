"use client"

import { useEstadisticasHoy } from "@/hooks/useEstadisticas"
import { AlertTriangle, CheckCircle2, TrendingDown, Loader2 } from "lucide-react"
import Link from "next/link"

export function AlertasCard() {
  const { data, isLoading } = useEstadisticasHoy()

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  const alertas = []

  // Alerta: Sin registro de ventas hoy
  if (data && data.hoy.cantidad === 0) {
    alertas.push({
      tipo: "warning",
      titulo: "Sin registro de ventas hoy",
      descripcion: "Aún no has registrado ventas para el día de hoy",
      accion: {
        texto: "Registrar ventas",
        href: "/ventas",
      },
    })
  }

  // Alerta: Venta baja (menos del 70% del promedio)
  if (data && data.hoy.cantidad > 0 && data.promedio.comparacion < -30) {
    alertas.push({
      tipo: "warning",
      titulo: "Ventas por debajo del promedio",
      descripcion: `Las ventas de hoy están ${Math.abs(data.promedio.comparacion).toFixed(0)}% por debajo del promedio habitual para este día (${data.promedio.cantidad} unidades)`,
      accion: null,
    })
  }

  // Si no hay alertas, mostrar estado positivo
  if (alertas.length === 0 && data && data.hoy.cantidad > 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-800 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              Todo en orden
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              Las ventas de hoy están dentro de lo esperado.
            </p>
            {data.promedio.comparacion > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  🎉 <strong>¡Excelente!</strong> Estás vendiendo un{" "}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {data.promedio.comparacion.toFixed(0)}%
                  </span>{" "}
                  más que el promedio habitual.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alertas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {alertas.length} {alertas.length === 1 ? "notificación" : "notificaciones"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alertas.map((alerta, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              alerta.tipo === "warning"
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {alerta.tipo === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium mb-1 ${
                  alerta.tipo === "warning"
                    ? "text-yellow-900 dark:text-yellow-100"
                    : "text-red-900 dark:text-red-100"
                }`}>
                  {alerta.titulo}
                </h3>
                <p className={`text-sm ${
                  alerta.tipo === "warning"
                    ? "text-yellow-700 dark:text-yellow-200"
                    : "text-red-700 dark:text-red-200"
                }`}>
                  {alerta.descripcion}
                </p>
                {alerta.accion && (
                  <Link
                    href={alerta.accion.href}
                    className={`inline-block mt-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      alerta.tipo === "warning"
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {alerta.accion.texto}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
