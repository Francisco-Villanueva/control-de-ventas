"use client"

import { useState } from "react"
import { CalendarioSelector } from "@/components/ventas/CalendarioSelector"
import { VentaDiariaForm } from "@/components/ventas/VentaDiariaForm"
import { VentasList } from "@/components/ventas/VentasList"
import { TrendingUp } from "lucide-react"

export default function VentasPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Registro de Ventas
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Registra las ventas diarias por producto
          </p>
        </div>
        <TrendingUp className="h-8 w-8 text-blue-600" />
      </div>

      {/* Selector de fecha */}
      <CalendarioSelector
        fecha={fechaSeleccionada}
        onFechaChange={setFechaSeleccionada}
      />

      {/* Grid con formulario e historial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de registro */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Registrar Ventas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ingresa la cantidad vendida de cada producto
            </p>
          </div>
          <VentaDiariaForm fecha={fechaSeleccionada} />
        </div>

        {/* Historial de ventas */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Últimas Ventas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Historial de los últimos 7 días
            </p>
          </div>
          <VentasList />
        </div>
      </div>
    </div>
  )
}
