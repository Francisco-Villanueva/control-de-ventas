"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCrearCategoria, useActualizarCategoria } from "@/hooks/useCategorias"
import { toast } from "sonner"
import { X, Save, Loader2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-[#E5E9F2] dark:border-[#2D2D44] custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#E5E9F2] dark:border-[#2D2D44] bg-gradient-to-r from-[#8B5FBF]/5 to-transparent sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-xl flex items-center justify-center shadow-md">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] dark:text-white">
              {isEditing ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B7A94] hover:bg-[#F8F9FC] dark:hover:bg-[#252536] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-bold text-[#1A1A2E] dark:text-white mb-2"
            >
              Nombre de la Categoría *
            </label>
            <Input
              {...register("nombre")}
              type="text"
              id="nombre"
              placeholder="Ej: Empanadas"
            />
            {errors.nombre && (
              <Badge variant="destructive" className="mt-2 text-xs">
                {errors.nombre.message}
              </Badge>
            )}
          </div>

          {/* Orden */}
          <div>
            <label
              htmlFor="orden"
              className="block text-sm font-bold text-[#1A1A2E] dark:text-white mb-2"
            >
              Orden de visualización
            </label>
            <Input
              {...register("orden", { valueAsNumber: true })}
              type="number"
              id="orden"
              className="font-mono"
              placeholder="0"
            />
            <p className="mt-2 text-xs text-[#6B7A94] dark:text-[#8E92A0]">
              Las categorías se ordenan de menor a mayor
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="flex-1 bg-gradient-to-r from-[#8B5FBF] to-[#A47FD5] hover:from-[#7A4EAE] hover:to-[#8B5FBF] shadow-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {isEditing ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
