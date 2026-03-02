"use client"

import { usePromediosPorDiaSemana } from "@/hooks/useEstadisticas"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Loader2 } from "lucide-react"

const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // green-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
]

export function PromediosChart() {
  const { data: promedios, isLoading } = usePromediosPorDiaSemana()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!promedios || promedios.length === 0) {
    return null
  }

  // Obtener todos los productos únicos
  const todosLosProductos = new Set<string>()
  promedios.forEach((dia: any) => {
    dia.productos.forEach((prod: any) => {
      todosLosProductos.add(prod.productoNombre)
    })
  })
  const productosArray = Array.from(todosLosProductos)

  // Transformar datos para Recharts
  const chartData = promedios.map((dia: any) => {
    const dataPoint: any = {
      dia: dia.diaNombre.substring(0, 3), // Abreviar días (Lun, Mar, etc.)
      diaCompleto: dia.diaNombre,
    }

    // Agregar cada producto como una propiedad
    dia.productos.forEach((prod: any) => {
      dataPoint[prod.productoNombre] = Math.round(prod.promedio)
    })

    return dataPoint
  })

  // Calcular el valor máximo para el eje Y
  const maxValue = Math.max(
    ...chartData.flatMap((dia: any) =>
      productosArray.map((prod) => dia[prod] || 0)
    )
  )
  const yAxisMax = Math.ceil(maxValue * 1.1) // 10% más para espaciado

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Promedios por Día de la Semana
      </h3>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="dia"
              tick={{ fill: "currentColor" }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              domain={[0, yAxisMax]}
              tick={{ fill: "currentColor" }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelFormatter={(value, payload) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload.diaCompleto
                }
                return value
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
            {productosArray.map((producto, index) => (
              <Bar
                key={producto}
                dataKey={producto}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
