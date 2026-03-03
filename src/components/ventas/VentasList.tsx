"use client";

import { useVentasRecientes } from "@/hooks/useVentas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Package, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fromPrismaDate, fromDateString } from "@/lib/dateUtils";

export function VentasList() {
  const { data: ventas, isLoading } = useVentasRecientes(7);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  if (!ventas || ventas.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-8">
        <div className="h-16 w-16 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Package className="h-8 w-8 text-white" />
        </div>
        <p className="text-[#1A1A2E] dark:text-white font-semibold text-lg mb-2">
          Sin ventas recientes
        </p>
        <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          No hay ventas registradas en los últimos 7 días
        </p>
      </div>
    );
  }

  // Agrupar ventas por fecha

  const ventasPorFecha = ventas.reduce((acc: any, venta: any) => {
    const fechaStr = fromPrismaDate(venta.fecha);
    if (!acc[fechaStr]) {
      acc[fechaStr] = {
        fecha: fromDateString(fechaStr),
        fechaStr: fechaStr,
        ventas: [],
        total: 0,
      };
    }
    acc[fechaStr].ventas.push(venta);
    acc[fechaStr].total += venta.cantidad;
    return acc;
  }, {});
  // Convertir a array y ordenar por fecha descendente
  const ventasAgrupadas = Object.values(ventasPorFecha).sort(
    (a: any, b: any) => b.fecha.getTime() - a.fecha.getTime(),
  );

  return (
    <div className="space-y-6">
      {ventasAgrupadas.map((grupo: any, index: number) => (
        <div
          key={grupo.fechaStr}
          className="relative"
        >
          {/* Timeline connector */}
          {index < ventasAgrupadas.length - 1 && (
            <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B35] to-[#FF6B35]/20 -mb-6" />
          )}

          <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#E5E9F2] dark:border-[#2D2D44] overflow-hidden">
            {/* Date header - sticky */}
            <div className="sticky top-0 bg-gradient-to-r from-[#FF6B35]/10 to-transparent px-6 py-4 border-b-2 border-[#E5E9F2] dark:border-[#2D2D44] z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1A1A2E] dark:text-white capitalize">
                      {format(grupo.fecha, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-xs text-[#6B7A94] dark:text-[#8E92A0] font-mono">
                      {format(grupo.fecha, "yyyy-MM-dd")}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {grupo.total}
                </Badge>
              </div>
            </div>

            {/* Products list */}
            <div className="p-6">
              <div className="space-y-3">
                {grupo.ventas.map((venta: any) => (
                  <div
                    key={venta.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F8F9FC] to-transparent dark:from-[#252536] dark:to-transparent rounded-xl border-2 border-[#E5E9F2] dark:border-[#2D2D44] hover:border-[#FF6B35]/30 dark:hover:border-[#FF6B35]/30 transition-all duration-200 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1A1A2E] dark:text-white truncate group-hover:text-[#FF6B35] transition-colors">
                        {venta.producto.nombre}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {venta.producto.categoria?.nombre || "Sin categoría"}
                      </Badge>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-2xl font-bold text-[#FF6B35]">
                        {venta.cantidad}
                      </p>
                      <p className="text-xs text-[#6B7A94] dark:text-[#8E92A0] uppercase tracking-wider">
                        unidades
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
