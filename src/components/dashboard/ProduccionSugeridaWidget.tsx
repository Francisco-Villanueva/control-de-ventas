"use client";

import { usePrediccionProduccion } from "@/hooks/useEstadisticas";
import { Loader2, Lightbulb, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProduccionSugeridaWidget() {
  const { data, isLoading } = usePrediccionProduccion();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-6">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-[#00C9A7]" />
        </div>
      </div>
    );
  }

  if (!data || data.predicciones.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-6">
        <div className="text-center py-16">
          <div className="h-16 w-16 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <p className="text-[#1A1A2E] dark:text-white font-semibold text-lg mb-2">
            No hay suficiente información
          </p>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            Registra ventas durante al menos 2 semanas para ver sugerencias
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#00C9A7]/10 to-transparent rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#00C9A7]/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-xl flex items-center justify-center shadow-md">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-1">
              Sugerencia de Producción
            </h2>
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 w-fit"
            >
              <Calendar className="h-3 w-3" />
              <span className="capitalize">{data.diaSemana}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl p-4 mb-5 border-2 border-[#E5E9F2] dark:border-[#2D2D44]">
        <p className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
          Basado en el promedio histórico de los{" "}
          <span className="font-bold text-[#00C9A7]">{data.diaSemana}</span>, te
          sugerimos producir:
        </p>
      </div>

      {/* Lista de sugerencias */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {data.predicciones.map((pred: any, index: number) => {
          const esTop3 = index < 3;
          return (
            <div
              key={pred.productoId}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                esTop3
                  ? "bg-white dark:bg-[#1A1A2E] border-[#00C9A7]/40 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-[#00C9A7]/5 border-[#00C9A7]/20 hover:border-[#00C9A7]/30"
              }`}
            >
              <div className="flex items-center gap-4">
                {esTop3 && (
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#1A1A2E] dark:text-white mb-0.5">
                    {pred.nombre}
                  </p>
                  <p className="text-xs text-[#6B7A94] dark:text-[#8E92A0]">
                    Basado en {pred.basadoEnDias}{" "}
                    {pred.basadoEnDias === 1 ? "día" : "días"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-[#00C9A7]">
                  {pred.cantidadSugerida}
                </span>
                {esTop3 && <TrendingUp className="h-5 w-5 text-[#00C9A7]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 p-4 bg-[#00C9A7]/10 border-2 border-[#00C9A7]/20 rounded-xl">
        <p className="text-xs text-[#424C63] dark:text-[#B8BCC8]">
          <span className="text-lg mr-1">💡</span>
          <strong className="text-[#00C9A7]">Tip:</strong> Estas cantidades son
          estimaciones basadas en tu historial. Ajusta según eventos especiales
          o cambios en la demanda.
        </p>
      </div>
    </div>
  );
}
