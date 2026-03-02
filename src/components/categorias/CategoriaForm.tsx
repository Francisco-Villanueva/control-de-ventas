"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCrearCategoria, useActualizarCategoria } from "@/hooks/useCategorias"
import { toast } from "sonner"
import { X, Save, Loader2 } from "lucide-react"

const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  orden: z.number().optional(),
})

type CategoriaFormData = z.infer<typeof categoriaSchema>

interface CategoriaFormProps {
  categoria?: any
  onClose: () => void
  onSuccess?: () => void
}

export function CategoriaForm({ categoria, onClose, onSuccess }: CategoriaFormProps) {
  const isEditing = !!categoria
  const crearCategoria = useCrearCategoria()
  const actualizarCategoria = useActualizarCategoria()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: categoria?.nombre || "",
      orden: categoria?.orden || 0,
    },
  })

  const onSubmit = async (data: CategoriaFormData) => {
    try {
      if (isEditing) {
        await actualizarCategoria.mutateAsync({
          id: categoria.id,
          data,
        })
        toast.success("Categoría actualizada exitosamente")
      } else {
        await crearCategoria.mutateAsync(data)
        toast.success("Categoría creada exitosamente")
      }
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Error al guardar categoría")
    }
  }

  const isPending = crearCategoria.isPending || actualizarCategoria.isPending

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nombre de la Categoría *
            </label>
            <input
              {...register("nombre")}
              type="text"
              id="nombre"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Empanadas"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          {/* Orden */}
          <div>
            <label
              htmlFor="orden"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Orden de visualización
            </label>
            <input
              {...register("orden", { valueAsNumber: true })}
              type="number"
              id="orden"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Las categorías se ordenan de menor a mayor
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Actualizar" : "Crear"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
