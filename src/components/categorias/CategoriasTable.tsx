"use client";

import { useState } from "react";
import { useCategorias, useEliminarCategoria } from "@/hooks/useCategorias";
import { CategoriaForm } from "./CategoriaForm";
import { toast } from "sonner";
import { Loader2, Edit, Trash2, Plus, Package, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CategoriasTable() {
  const { data: categorias, isLoading } = useCategorias(false);
  const eliminarCategoria = useEliminarCategoria();

  const [categoriaEditar, setCategoriaEditar] = useState<any>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleEliminar = async (
    id: number,
    nombre: string,
    cantidadProductos: number,
  ) => {
    if (cantidadProductos > 0) {
      toast.error(
        `No puedes eliminar "${nombre}" porque tiene ${cantidadProductos} productos asociados`,
      );
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) return;

    try {
      await eliminarCategoria.mutateAsync(id);
      toast.success("Categoría eliminada");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEditar = (categoria: any) => {
    setCategoriaEditar(categoria);
    setMostrarFormulario(true);
  };

  const handleNuevo = () => {
    setCategoriaEditar(null);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setCategoriaEditar(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-[#8B5FBF]" />
      </div>
    );
  }

  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-8">
        <div className="h-16 w-16 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FolderOpen className="h-8 w-8 text-white" />
        </div>
        <p className="text-[#1A1A2E] dark:text-white font-semibold text-lg mb-2">
          No hay categorías registradas
        </p>
        <Button
          onClick={handleNuevo}
          variant="default"
          size="lg"
          className="mt-4 bg-[#8B5FBF] hover:bg-[#7A4EAE]"
        >
          <Plus className="h-5 w-5" />
          Crear Primera Categoría
        </Button>

        {mostrarFormulario && (
          <CategoriaForm
            categoria={categoriaEditar}
            onClose={handleCerrarFormulario}
            onSuccess={handleCerrarFormulario}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header con botón */}
        <div className="flex items-center justify-end">
          <Button
            onClick={handleNuevo}
            variant="default"
            size="lg"
            className="bg-[#8B5FBF] hover:bg-[#7A4EAE] shadow-md"
          >
            <Plus className="h-5 w-5" />
            Nueva Categoría
          </Button>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] overflow-hidden">
            <table className="min-w-full divide-y-2 divide-[#E5E9F2] dark:divide-[#2D2D44]">
              <thead className="bg-gradient-to-r from-[#8B5FBF]/10 to-transparent sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1A1A2E] divide-y-2 divide-[#E5E9F2] dark:divide-[#2D2D44]">
                {categorias.map((categoria: any) => (
                  <tr
                    key={categoria.id}
                    className={
                      categoria.activo
                        ? "hover:bg-[#F8F9FC] dark:hover:bg-[#252536] transition-colors"
                        : "bg-[#F8F9FC]/50 dark:bg-[#252536]/50 opacity-60"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#1A1A2E] dark:text-white">
                        {categoria.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Package className="h-4 w-4 text-[#6B7A94]" />
                        <span className="text-sm font-semibold text-[#1A1A2E] dark:text-white">
                          {categoria._count?.productos || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-[#1A1A2E] dark:text-white font-mono">
                        {categoria.orden}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge
                        variant={categoria.activo ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {categoria.activo ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditar(categoria)}
                          className="p-2 rounded-lg text-[#8B5FBF] hover:bg-[#8B5FBF]/10 transition-all"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleEliminar(
                              categoria.id,
                              categoria.nombre,
                              categoria._count?.productos || 0,
                            )
                          }
                          className={`p-2 rounded-lg transition-all ${
                            categoria._count?.productos > 0
                              ? "text-[#6B7A94] opacity-50 cursor-not-allowed"
                              : "text-[#FF5757] hover:bg-[#FF5757]/10"
                          }`}
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
        <div className="md:hidden space-y-5">
          {categorias.map((categoria: any) => (
            <div
              key={categoria.id}
              className={`rounded-2xl shadow-md border-2 overflow-hidden transition-all duration-300 ${
                categoria.activo
                  ? "bg-white dark:bg-[#1A1A2E] border-[#E5E9F2] dark:border-[#2D2D44]"
                  : "bg-[#F8F9FC]/50 dark:bg-[#252536]/50 border-[#E5E9F2]/50 dark:border-[#2D2D44]/50 opacity-60"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-2 truncate">
                      {categoria.nombre}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[#6B7A94] dark:text-[#8E92A0]">
                      <Package className="h-4 w-4" />
                      <span>{categoria._count?.productos || 0} productos</span>
                    </div>
                  </div>
                  <Badge
                    variant={categoria.activo ? "secondary" : "outline"}
                    className="ml-2 flex-shrink-0"
                  >
                    {categoria.activo ? "Activa" : "Inactiva"}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleEditar(categoria)}
                    className="flex-1 bg-[#8B5FBF] hover:bg-[#7A4EAE]"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    onClick={() =>
                      handleEliminar(
                        categoria.id,
                        categoria.nombre,
                        categoria._count?.productos || 0,
                      )
                    }
                    disabled={categoria._count?.productos > 0}
                    variant="outline"
                    className="flex-1 border-[#FF5757] text-[#FF5757] hover:bg-[#FF5757]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-gradient-to-br from-[#FFB627]/10 to-transparent border-2 border-[#FFB627]/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-[#FFB627] to-[#FFC857] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-lg">!</span>
            </div>
            <p className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
              <strong className="font-bold">Nota:</strong> No puedes eliminar una categoría que tenga
              productos asociados. Primero debes mover o eliminar los productos de
              esa categoría.
            </p>
          </div>
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
  );
}
