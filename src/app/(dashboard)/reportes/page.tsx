import type { Metadata } from "next"
import { FileText, Info, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Reportes | Rotisería Ventas",
  description: "Reportes mensuales y anuales",
}

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">
            Reportes
          </h1>
          <p className="mt-2 text-base text-[#6B7A94] dark:text-[#8E92A0]">
            Reportes mensuales y anuales de ventas
          </p>
        </div>
        <div className="h-16 w-16 bg-gradient-to-br from-[#4ECDC4] to-[#6FE3DA] rounded-2xl flex items-center justify-center shadow-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Info Card - En desarrollo */}
      <div className="bg-gradient-to-br from-[#4ECDC4]/10 to-transparent border-2 border-[#4ECDC4]/20 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-[#4ECDC4] to-[#6FE3DA] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A2E] dark:text-white mb-2">
              Sección En Desarrollo
            </h3>
            <p className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
              Esta sección mostrará reportes mensuales y anuales de ventas, con
              visualizaciones de tendencias, comparaciones y análisis detallados.
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder cards para futuras funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A2E] dark:text-white">
              Reportes Mensuales
            </h3>
          </div>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            Visualiza el desempeño de ventas mes a mes, con gráficos de barras,
            totales y comparaciones con meses anteriores.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A2E] dark:text-white">
              Reportes Anuales
            </h3>
          </div>
          <p className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
            Analiza tendencias anuales, identifica productos estrella y
            estacionalidades en las ventas de tu rotisería.
          </p>
        </div>
      </div>
    </div>
  )
}
