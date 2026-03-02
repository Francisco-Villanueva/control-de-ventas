"use client";

import { useState } from "react";
import {
  useProductos,
  useEliminarProducto,
  useActualizarProducto,
} from "@/hooks/useProductos";
import { ProductoForm } from "./ProductoForm";
import { toast } from "sonner";
import { Loader2, Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react";

export function ProductosTable() {
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const { data: productos, isLoading } = useProductos(!mostrarInactivos);
  const eliminarProducto = useEliminarProducto();
  const actualizarProducto = useActualizarProducto();

  const [productoEditar, setProductoEditar] = useState<any>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de desactivar "${nombre}"?`)) return;

    try {
      await eliminarProducto.mutateAsync(id);
      toast.success("Producto desactivado");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleActivo = async (producto: any) => {
    try {
      await actualizarProducto.mutateAsync({
        id: producto.id,
        data: { activo: !producto.activo },
      });
      toast.success(
        producto.activo ? "Producto desactivado" : "Producto activado",
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEditar = (producto: any) => {
    setProductoEditar(producto);
    setMostrarFormulario(true);
  };

  const handleNuevo = () => {
    setProductoEditar(null);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditar(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {mostrarInactivos
            ? "No hay productos inactivos"
            : "No hay productos registrados"}
        </p>
        {!mostrarInactivos && (
          <button
            onClick={handleNuevo}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
          >
            <Plus className="h-5 w-5" />
            Crear Primer Producto
          </button>
        )}

        {mostrarFormulario && (
          <ProductoForm
            producto={productoEditar}
            onClose={handleCerrarFormulario}
            onSuccess={handleCerrarFormulario}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header con botones */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMostrarInactivos(!mostrarInactivos)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {mostrarInactivos ? "Ocultar inactivos" : "Mostrar inactivos"}
          </button>
          <button
            onClick={handleNuevo}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </button>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Margen
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
                {productos.map((producto: any) => {
                  const margen =
                    producto.precio > 0
                      ? ((producto.precio - producto.costo) / producto.precio) *
                        100
                      : 0;

                  return (
                    <tr
                      key={producto.id}
                      className={
                        producto.activo
                          ? "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          : "bg-gray-100 dark:bg-gray-700/30 opacity-60"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {producto.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {producto.categoria?.nombre || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${Number(producto.precio).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${Number(producto.costo).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            margen >= 50
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : margen >= 30
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {margen.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            producto.activo
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {producto.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActivo(producto)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            title={producto.activo ? "Desactivar" : "Activar"}
                          >
                            {producto.activo ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditar(producto)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards Mobile */}
        <div className="md:hidden space-y-4">
          {productos.map((producto: any) => {
            const margen =
              producto.precio > 0
                ? ((producto.precio - producto.costo) / producto.precio) * 100
                : 0;

            return (
              <div
                key={producto.id}
                className={`rounded-lg shadow-sm border overflow-hidden ${
                  producto.activo
                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    : "bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600 opacity-60"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {producto.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {producto.categoria?.nombre || "Sin categoría"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        producto.activo
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {producto.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Precio
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${Number(producto.precio).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Costo
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${Number(producto.costo).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Margen
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {margen.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActivo(producto)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                    >
                      {producto.activo ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => handleEditar(producto)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Formulario Modal */}
      {mostrarFormulario && (
        <ProductoForm
          producto={productoEditar}
          onClose={handleCerrarFormulario}
          onSuccess={handleCerrarFormulario}
        />
      )}
    </>
  );
}
