import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"

interface VentaInput {
  productoId: number
  cantidad: number
}

interface VentaBatchInput {
  fecha: string
  ventas: VentaInput[]
}

export function useVentas(fecha?: Date) {
  const fechaStr = fecha ? format(fecha, "yyyy-MM-dd") : undefined

  return useQuery({
    queryKey: ["ventas", fechaStr],
    queryFn: async () => {
      const url = fechaStr
        ? `/api/ventas?fecha=${fechaStr}`
        : `/api/ventas?dias=7`
      const response = await fetch(url)
      if (!response.ok) throw new Error("Error al cargar ventas")
      return response.json()
    },
    enabled: !!fechaStr || !fecha,
  })
}

export function useVentasRecientes(dias: number = 7) {
  return useQuery({
    queryKey: ["ventas", "recientes", dias],
    queryFn: async () => {
      const response = await fetch(`/api/ventas?dias=${dias}`)
      if (!response.ok) throw new Error("Error al cargar ventas recientes")
      return response.json()
    },
  })
}

export function useGuardarVentas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: VentaBatchInput) => {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al guardar ventas")
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["ventas"] })
      queryClient.invalidateQueries({ queryKey: ["estadisticas"] })
    },
  })
}
