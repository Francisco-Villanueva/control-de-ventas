"use client"

import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toDateString, fromDateString, getTodayString } from "@/lib/dateUtils"

interface CalendarioSelectorProps {
  fecha: Date
  onFechaChange: (fecha: Date) => void
}

export function CalendarioSelector({
  fecha,
  onFechaChange,
}: CalendarioSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value // HTML input gives "yyyy-MM-dd"
    const nuevaFecha = fromDateString(dateStr) // Convert to Date at LOCAL midnight
    onFechaChange(nuevaFecha)
  }

  const handleQuickJump = (days: number) => {
    if (days === 0) {
      onFechaChange(fromDateString(getTodayString()))
    } else {
      const targetDate = subDays(new Date(), days)
      onFechaChange(fromDateString(toDateString(targetDate)))
    }
  }

  const handleNavigation = (direction: "prev" | "next") => {
    const currentDateStr = toDateString(fecha)
    const [year, month, day] = currentDateStr.split('-').map(Number)
    const currentDate = new Date(year, month - 1, day)

    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const todayStr = getTodayString()
    const newDateStr = toDateString(currentDate)
    if (newDateStr <= todayStr) {
      onFechaChange(fromDateString(newDateStr))
    }
  }

  const formatoFecha = format(fecha, "yyyy-MM-dd")
  const fechaMaxima = format(new Date(), "yyyy-MM-dd")
  const esHoy = formatoFecha === fechaMaxima
  const puedeAvanzar = !esHoy

  return (
    <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-6">
      {/* Header with date display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-xl flex items-center justify-center shadow-md">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7A94] dark:text-[#8E92A0] mb-1">
              Fecha de registro
            </p>
            <p className="text-xl font-bold text-[#1A1A2E] dark:text-white capitalize">
              {format(fecha, "EEEE, d 'de' MMMM", { locale: es })}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavigation("prev")}
            className="h-10 w-10 rounded-lg bg-[#F8F9FC] dark:bg-[#252536] hover:bg-[#E5E9F2] dark:hover:bg-[#2D2D44] flex items-center justify-center transition-colors"
            aria-label="Día anterior"
          >
            <ChevronLeft className="h-5 w-5 text-[#424C63] dark:text-[#B8BCC8]" />
          </button>
          <button
            onClick={() => handleNavigation("next")}
            disabled={!puedeAvanzar}
            className="h-10 w-10 rounded-lg bg-[#F8F9FC] dark:bg-[#252536] hover:bg-[#E5E9F2] dark:hover:bg-[#2D2D44] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Día siguiente"
          >
            <ChevronRight className="h-5 w-5 text-[#424C63] dark:text-[#B8BCC8]" />
          </button>
        </div>
      </div>

      {/* Date input and quick jump buttons */}
      <div className="space-y-4">
        {/* Custom date picker */}
        <input
          type="date"
          id="fecha"
          value={formatoFecha}
          max={fechaMaxima}
          onChange={handleChange}
          className="w-full h-11 px-4 py-2 text-base font-semibold border-2 border-[#E5E9F2] dark:border-[#2D2D44] rounded-lg shadow-sm focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 bg-white dark:bg-[#1A1A2E] text-[#1A1A2E] dark:text-white transition-all duration-200"
        />

        {/* Quick jump buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#6B7A94] dark:text-[#8E92A0] uppercase tracking-wider">
            Salto rápido:
          </span>
          <Button
            type="button"
            variant={esHoy ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickJump(0)}
            className={esHoy ? "" : "hover:border-[#FF6B35]"}
          >
            Hoy
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickJump(1)}
            className="hover:border-[#FF6B35]"
          >
            Ayer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickJump(7)}
            className="hover:border-[#FF6B35]"
          >
            Hace 7 días
          </Button>
        </div>
      </div>
    </div>
  )
}
