"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCategorias } from "@/hooks/useCategorias"
import { useCrearProducto, useActualizarProducto } from "@/hooks/useProductos"
import { toast } from "sonner"
import { X, Save, Loader2 } from "lucide-react"

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
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
              Nombre del Producto *
            </label>
            <input
              {...register("nombre")}
              type="text"
              id="nombre"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Empanada de Carne"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label
              htmlFor="categoriaId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Categoría
            </label>
            <select
              {...register("categoriaId", {
                setValueAs: (v) => (v === "" ? undefined : parseInt(v)),
              })}
              id="categoriaId"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Precio de Venta *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  {...register("precio", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="precio"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              {errors.precio && (
                <p className="mt-1 text-sm text-red-600">{errors.precio.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="costo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Costo *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  {...register("costo", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="costo"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              {errors.costo && (
                <p className="mt-1 text-sm text-red-600">{errors.costo.message}</p>
              )}
            </div>
          </div>

          {/* Margen de ganancia */}
          {precio > 0 && costo >= 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Margen de ganancia:</strong>{" "}
                {margen.toFixed(1)}% (${(precio - costo).toFixed(2)})
              </p>
            </div>
          )}

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
              Los productos se ordenan de menor a mayor
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
