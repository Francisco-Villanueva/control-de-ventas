import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reportes | Rotisería Ventas",
  description: "Reportes mensuales y anuales",
}

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Reportes
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400">
          Esta sección muestra reportes mensuales y anuales. (En desarrollo)
        </p>
      </div>
    </div>
  )
}
