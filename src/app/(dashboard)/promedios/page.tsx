"use client";

import { StatsCards } from "@/components/estadisticas/StatsCards";
import { PromediosTable } from "@/components/estadisticas/PromediosTable";
import { PromediosChart } from "@/components/estadisticas/PromediosChart";
import { BarChart3, Info } from "lucide-react";

export default function PromediosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">
            Promedios por Día de Semana
          </h1>
          <p className="mt-2 text-base text-[#6B7A94] dark:text-[#8E92A0]">
            Analiza tus ventas promedio para planificar mejor tu producción
          </p>
        </div>
        <div className="h-16 w-16 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-2xl flex items-center justify-center shadow-lg">
          <BarChart3 className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-[#8B5FBF]/10 to-transparent border-2 border-[#8B5FBF]/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
            <p className="font-bold text-base text-[#1A1A2E] dark:text-white mb-2">
              ¿Cómo usar estos promedios?
            </p>
            <p>
              Los promedios te ayudan a predecir cuánto debes producir cada día.
              Por ejemplo, si el promedio del lunes es 50 empanadas de carne,
              considera producir esa cantidad (o un poco más) para el próximo
              lunes.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />
      {/* Tabla Detallada */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1A1A2E] dark:text-white mb-2">
            Tabla Detallada
          </h2>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            Promedios de ventas por producto y día de la semana
          </p>
        </div>
        <PromediosTable />
      </div>
      {/* Gráfico */}
      <PromediosChart />

      {/* Nota al pie */}
      <div className="bg-gradient-to-r from-[#8B5FBF]/5 to-transparent border-2 border-[#8B5FBF]/10 rounded-xl p-5">
        <p className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
          <span className="font-bold text-[#8B5FBF]">Nota:</span> Los promedios
          se calculan basándose en todas las ventas históricas registradas.
          Cuantos más datos tengas, más precisos serán los promedios. El día
          actual está resaltado con lavender.
        </p>
      </div>
    </div>
  );
}
