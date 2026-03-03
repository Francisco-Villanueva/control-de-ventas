"use client"

import { useEstadisticasHoy } from "@/hooks/useEstadisticas"
import { AlertTriangle, CheckCircle2, TrendingDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AlertasCard() {
  const { data, isLoading } = useEstadisticasHoy()

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-[#FFB627]" />
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
      <div className="bg-gradient-to-br from-[#10D47C]/10 to-transparent rounded-2xl shadow-md border-2 border-[#10D47C]/20 p-8">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-[#10D47C] to-[#2BE592] rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircle2 className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#1A1A2E] dark:text-white mb-2">
              ¡Todo en orden!
            </h3>
            <p className="text-base text-[#424C63] dark:text-[#B8BCC8] mb-4">
              Las ventas de hoy están dentro de lo esperado.
            </p>
            {data.promedio.comparacion > 0 && (
              <div className="bg-white dark:bg-[#1A1A2E] rounded-xl p-4 border-2 border-[#E5E9F2] dark:border-[#2D2D44]">
                <p className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
                  <span className="text-2xl mr-2">🎉</span>
                  <strong className="text-[#10D47C]">¡Excelente!</strong> Estás vendiendo un{" "}
                  <span className="font-bold text-[#10D47C] text-lg">
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
    <div className="bg-gradient-to-br from-[#FFB627]/10 to-transparent rounded-2xl shadow-md border-2 border-[#FFB627]/20 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 bg-gradient-to-br from-[#FFB627] to-[#FFA500] rounded-xl flex items-center justify-center shadow-md">
          <AlertTriangle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1A1A2E] dark:text-white">
            Alertas
          </h2>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            {alertas.length} {alertas.length === 1 ? "notificación" : "notificaciones"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alertas.map((alerta, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl border-2 transition-all duration-200 ${
              alerta.tipo === "warning"
                ? "bg-[#FFB627]/10 border-[#FFB627]/30 hover:shadow-md"
                : "bg-[#FF5757]/10 border-[#FF5757]/30 hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 mt-0.5 h-10 w-10 rounded-full flex items-center justify-center ${
                alerta.tipo === "warning"
                  ? "bg-gradient-to-br from-[#FFB627] to-[#FFA500]"
                  : "bg-gradient-to-br from-[#FF5757] to-[#FF7777]"
              } shadow-md`}>
                {alerta.tipo === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-white" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#1A1A2E] dark:text-white mb-1.5 text-base">
                  {alerta.titulo}
                </h3>
                <p className="text-sm text-[#424C63] dark:text-[#B8BCC8] mb-3">
                  {alerta.descripcion}
                </p>
                {alerta.accion && (
                  <Button
                    asChild
                    variant={alerta.tipo === "warning" ? "default" : "destructive"}
                    size="sm"
                    className="mt-2"
                  >
                    <Link href={alerta.accion.href}>
                      {alerta.accion.texto}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
