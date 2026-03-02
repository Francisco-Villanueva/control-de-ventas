"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "lucide-react"

interface CalendarioSelectorProps {
  fecha: Date
  onFechaChange: (fecha: Date) => void
}

export function CalendarioSelector({
  fecha,
  onFechaChange,
}: CalendarioSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = new Date(e.target.value + "T00:00:00")
    onFechaChange(nuevaFecha)
  }

  const formatoFecha = format(fecha, "yyyy-MM-dd")
  const fechaMaxima = format(new Date(), "yyyy-MM-dd")

  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <Calendar className="h-5 w-5 text-gray-500" />
      <div className="flex-1">
        <label
          htmlFor="fecha"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Fecha de registro
        </label>
        <input
          type="date"
          id="fecha"
          value={formatoFecha}
          max={fechaMaxima}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {format(fecha, "EEEE", { locale: es })}
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {format(fecha, "d 'de' MMMM", { locale: es })}
        </p>
      </div>
    </div>
  )
}
