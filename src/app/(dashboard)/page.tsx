import { auth } from "@/lib/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Rotisería Ventas",
  description: "Panel de control de ventas",
}

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Bienvenido, {session?.user.name}
        </p>
      </div>

      {/* Stats Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Ventas de Hoy
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            -
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total del Mes
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            -
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Ingresos del Mes
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            -
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Bienvenido al Sistema de Control de Ventas
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Esta aplicación está configurada y lista para usar. Aquí puedes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Registrar ventas diarias de productos</li>
          <li>Ver promedios de ventas por día de la semana</li>
          <li>Generar reportes mensuales y anuales</li>
          <li>Configurar productos y categorías</li>
        </ul>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Nota importante:</strong> Antes de usar la aplicación, asegúrate de:
          </p>
          <ol className="list-decimal list-inside mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>Configurar la DATABASE_URL en el archivo .env.local</li>
            <li>Ejecutar: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">npx prisma db push</code></li>
            <li>Ejecutar: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">npm run db:seed</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}
