import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface ProductoInput {
  nombre: string
  categoriaId?: number
  precio: number
  costo: number
  orden?: number
}

export function useProductos(activoOnly: boolean = true) {
  return useQuery({
    queryKey: ["productos", activoOnly],
    queryFn: async () => {
      const url = activoOnly ? "/api/productos?activo=true" : "/api/productos"
      const response = await fetch(url)
      if (!response.ok) throw new Error("Error al cargar productos")
      return response.json()
    },
  })
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ["productos", id],
    queryFn: async () => {
      const response = await fetch(`/api/productos/${id}`)
      if (!response.ok) throw new Error("Error al cargar producto")
      return response.json()
    },
    enabled: !!id,
  })
}

export function useCrearProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProductoInput) => {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear producto")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}

export function useActualizarProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ProductoInput & { activo?: boolean }> }) => {
      const response = await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al actualizar producto")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}

export function useEliminarProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar producto")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}
