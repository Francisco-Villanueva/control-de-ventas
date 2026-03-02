import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface CategoriaInput {
  nombre: string
  orden?: number
}

export function useCategorias(activoOnly: boolean = false) {
  return useQuery({
    queryKey: ["categorias", activoOnly],
    queryFn: async () => {
      const url = activoOnly ? "/api/categorias?activo=true" : "/api/categorias"
      const response = await fetch(url)
      if (!response.ok) throw new Error("Error al cargar categorías")
      return response.json()
    },
  })
}

export function useCategoria(id: number) {
  return useQuery({
    queryKey: ["categorias", id],
    queryFn: async () => {
      const response = await fetch(`/api/categorias/${id}`)
      if (!response.ok) throw new Error("Error al cargar categoría")
      return response.json()
    },
    enabled: !!id,
  })
}

export function useCrearCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CategoriaInput) => {
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear categoría")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
    },
  })
}

export function useActualizarCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CategoriaInput> }) => {
      const response = await fetch(`/api/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al actualizar categoría")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
    },
  })
}

export function useEliminarCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/categorias/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar categoría")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}
