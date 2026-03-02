import { useQuery } from "@tanstack/react-query"

export function usePromediosPorDiaSemana() {
  return useQuery({
    queryKey: ["estadisticas", "promedios"],
    queryFn: async () => {
      const response = await fetch("/api/estadisticas/promedios")
      if (!response.ok) throw new Error("Error al cargar promedios")
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useResumenMensual(fecha: string) {
  return useQuery({
    queryKey: ["estadisticas", "resumen", "mensual", fecha],
    queryFn: async () => {
      const response = await fetch(
        `/api/estadisticas/resumen?periodo=mensual&fecha=${fecha}`
      )
      if (!response.ok) throw new Error("Error al cargar resumen mensual")
      return response.json()
    },
    enabled: !!fecha,
  })
}

export function useResumenAnual(fecha: string) {
  return useQuery({
    queryKey: ["estadisticas", "resumen", "anual", fecha],
    queryFn: async () => {
      const response = await fetch(
        `/api/estadisticas/resumen?periodo=anual&fecha=${fecha}`
      )
      if (!response.ok) throw new Error("Error al cargar resumen anual")
      return response.json()
    },
    enabled: !!fecha,
  })
}
