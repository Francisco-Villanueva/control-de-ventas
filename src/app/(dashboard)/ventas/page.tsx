"use client";

import { useState } from "react";
import { CalendarioSelector } from "@/components/ventas/CalendarioSelector";
import { VentaDiariaForm } from "@/components/ventas/VentaDiariaForm";
import { VentasList } from "@/components/ventas/VentasList";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function VentasPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());

  console.log("fecha seleccionad", {
    ORIGNAL: fechaSeleccionada,
    FORMATED: format(fechaSeleccionada, "yyyy-MM-dd"),
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">
            Registro de Ventas
          </h1>
          <p className="mt-2 text-base text-[#6B7A94] dark:text-[#8E92A0]">
            Registra las ventas diarias por producto
          </p>
        </div>
        <div className="h-16 w-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-2xl flex items-center justify-center shadow-lg">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1A1A2E] dark:text-white mb-2">
              Registrar Ventas
            </h2>
            <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
              Ingresa la cantidad vendida de cada producto
            </p>
          </div>
          <VentaDiariaForm fecha={fechaSeleccionada} />
        </div>

        {/* Historial de ventas */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1A1A2E] dark:text-white mb-2">
              Últimas Ventas
            </h2>
            <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
              Historial de los últimos 7 días
            </p>
          </div>
          <VentasList />
        </div>
      </div>
    </div>
  );
}
