"use client"

import { useState } from "react"
import { useCategorias, useEliminarCategoria } from "@/hooks/useCategorias"
import { CategoriaForm } from "./CategoriaForm"
import { toast } from "sonner"
import { Loader2, Edit, Trash2, Plus, Package } from "lucide-react"

export function CategoriasTable() {
  const { data: categorias, isLoading } = useCategorias(false)
  const eliminarCategoria = useEliminarCategoria()

  const [categoriaEditar, setCategoriaEditar] = useState<any>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const handleEliminar = async (id: number, nombre: string, cantidadProductos: number) => {
    if (cantidadProductos > 0) {
      toast.error(`No puedes eliminar "${nombre}" porque tiene ${cantidadProductos} productos asociados`)
      return
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) return

    try {
      await eliminarCategoria.mutateAsync(id)
      toast.success("Categoría eliminada")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleEditar = (categoria: any) => {
    setCategoriaEditar(categoria)
    setMostrarFormulario(true)
  }

  const handleNuevo = () => {
    setCategoriaEditar(null)
    setMostrarFormulario(true)
  }

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false)
    setCategoriaEditar(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No hay categorías registradas
        </p>
        <button
          onClick={handleNuevo}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
        >
          <Plus className="h-5 w-5" />
          Crear Primera Categoría
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header con botón */}
        <div className="flex items-center justify-end">
          <button
            onClick={handleNuevo}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </button>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categorias.map((categoria: any) => (
                  <tr
                    key={categoria.id}
                    className={
                      categoria.activo
                        ? "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        : "bg-gray-100 dark:bg-gray-700/30 opacity-60"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {categoria.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {categoria._count?.productos || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {categoria.orden}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          categoria.activo
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {categoria.activo ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditar(categoria)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleEliminar(
                              categoria.id,
                              categoria.nombre,
                              categoria._count?.productos || 0
                            )
                          }
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Eliminar"
                          disabled={categoria._count?.productos > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards Mobile */}
        <div className="md:hidden space-y-4">
          {categorias.map((categoria: any) => (
            <div
              key={categoria.id}
              className={`rounded-lg shadow-sm border overflow-hidden ${
                categoria.activo
                  ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  : "bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600 opacity-60"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {categoria.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <Package className="h-4 w-4" />
                      {categoria._count?.productos || 0} productos
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      categoria.activo
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {categoria.activo ? "Activa" : "Inactiva"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(categoria)}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      handleEliminar(
                        categoria.id,
                        categoria.nombre,
                        categoria._count?.productos || 0
                      )
                    }
                    disabled={categoria._count?.productos > 0}
                    className="flex-1 px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Nota:</strong> No puedes eliminar una categoría que tenga productos asociados.
            Primero debes mover o eliminar los productos de esa categoría.
          </p>
        </div>
      </div>

      {/* Formulario Modal */}
      {mostrarFormulario && (
        <CategoriaForm
          categoria={categoriaEditar}
          onClose={handleCerrarFormulario}
          onSuccess={handleCerrarFormulario}
        />
      )}
    </>
  )
}
