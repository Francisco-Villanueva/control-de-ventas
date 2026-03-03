"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCategorias } from "@/hooks/useCategorias"
import { useCrearProducto, useActualizarProducto } from "@/hooks/useProductos"
import { toast } from "sonner"
import { X, Save, Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  categoriaId: z.number().optional(),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  costo: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  orden: z.number().optional(),
})

type ProductoFormData = z.infer<typeof productoSchema>

interface ProductoFormProps {
  producto?: any
  onClose: () => void
  onSuccess?: () => void
}

export function ProductoForm({ producto, onClose, onSuccess }: ProductoFormProps) {
  const isEditing = !!producto
  const { data: categorias } = useCategorias(true)
  const crearProducto = useCrearProducto()
  const actualizarProducto = useActualizarProducto()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: producto?.nombre || "",
      categoriaId: producto?.categoriaId || undefined,
      precio: producto?.precio ? Number(producto.precio) : 0,
      costo: producto?.costo ? Number(producto.costo) : 0,
      orden: producto?.orden || 0,
    },
  })

  const precio = watch("precio")
  const costo = watch("costo")
  const margen = precio && costo ? ((precio - costo) / precio) * 100 : 0

  const onSubmit = async (data: ProductoFormData) => {
    try {
      if (isEditing) {
        await actualizarProducto.mutateAsync({
          id: producto.id,
          data,
        })
        toast.success("Producto actualizado exitosamente")
      } else {
        await crearProducto.mutateAsync(data)
        toast.success("Producto creado exitosamente")
      }
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Error al guardar producto")
    }
  }

  const isPending = crearProducto.isPending || actualizarProducto.isPending

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-[#E5E9F2] dark:border-[#2D2D44] custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#E5E9F2] dark:border-[#2D2D44] bg-gradient-to-r from-[#00C9A7]/5 to-transparent sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-xl flex items-center justify-center shadow-md">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] dark:text-white">
              {isEditing ? "Editar Producto" : "Nuevo Producto"}
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
              Nombre del Producto *
            </label>
            <Input
              {...register("nombre")}
              type="text"
              id="nombre"
              placeholder="Ej: Empanada de Carne"
            />
            {errors.nombre && (
              <Badge variant="destructive" className="mt-2 text-xs">
                {errors.nombre.message}
              </Badge>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label
              htmlFor="categoriaId"
              className="block text-sm font-bold text-[#1A1A2E] dark:text-white mb-2"
            >
              Categoría
            </label>
            <select
              {...register("categoriaId", {
                setValueAs: (v) => (v === "" ? undefined : parseInt(v)),
              })}
              id="categoriaId"
              className="w-full h-11 px-4 py-2 border-2 border-[#E5E9F2] dark:border-[#2D2D44] rounded-lg bg-white dark:bg-[#1A1A2E] text-[#1A1A2E] dark:text-white focus:outline-none focus:border-[#00C9A7] focus:ring-4 focus:ring-[#00C9A7]/10 transition-all duration-200"
            >
              <option value="">Sin categoría</option>
              {categorias?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Precio y Costo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="precio"
                className="block text-sm font-bold text-[#1A1A2E] dark:text-white mb-2"
              >
                Precio de Venta *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A94] dark:text-[#8E92A0] font-semibold">
                  $
                </span>
                <Input
                  {...register("precio", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="precio"
                  className="pl-8 font-mono"
                  placeholder="0.00"
                />
              </div>
              {errors.precio && (
                <Badge variant="destructive" className="mt-2 text-xs">
                  {errors.precio.message}
                </Badge>
              )}
            </div>

            <div>
              <label
                htmlFor="costo"
                className="block text-sm font-bold text-[#1A1A2E] dark:text-white mb-2"
              >
                Costo *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A94] dark:text-[#8E92A0] font-semibold">
                  $
                </span>
                <Input
                  {...register("costo", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="costo"
                  className="pl-8 font-mono"
                  placeholder="0.00"
                />
              </div>
              {errors.costo && (
                <Badge variant="destructive" className="mt-2 text-xs">
                  {errors.costo.message}
                </Badge>
              )}
            </div>
          </div>

          {/* Margen de ganancia */}
          {precio > 0 && costo >= 0 && (
            <div className="bg-gradient-to-br from-[#00C9A7]/10 to-transparent border-2 border-[#00C9A7]/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white font-bold text-sm">{margen.toFixed(0)}%</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7A94] dark:text-[#8E92A0]">
                    Margen de Ganancia
                  </p>
                  <p className="text-base font-bold text-[#1A1A2E] dark:text-white font-mono">
                    ${(precio - costo).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              Los productos se ordenan de menor a mayor
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
              className="flex-1 bg-gradient-to-r from-[#00C9A7] to-[#00DBB7] hover:from-[#00B396] hover:to-[#00C9A7] shadow-lg"
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
