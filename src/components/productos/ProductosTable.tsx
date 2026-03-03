"use client";

import { useState } from "react";
import {
  useProductos,
  useEliminarProducto,
  useActualizarProducto,
} from "@/hooks/useProductos";
import { ProductoForm } from "./ProductoForm";
import { toast } from "sonner";
import { Loader2, Edit, Trash2, Eye, EyeOff, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-[#00C9A7]" />
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] p-8">
        <div className="h-16 w-16 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Package className="h-8 w-8 text-white" />
        </div>
        <p className="text-[#1A1A2E] dark:text-white font-semibold text-lg mb-2">
          {mostrarInactivos
            ? "No hay productos inactivos"
            : "No hay productos registrados"}
        </p>
        {!mostrarInactivos && (
          <Button
            onClick={handleNuevo}
            variant="default"
            size="lg"
            className="mt-4 bg-[#00C9A7] hover:bg-[#00B396]"
          >
            <Plus className="h-5 w-5" />
            Crear Primer Producto
          </Button>
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
      <div className="space-y-6">
        {/* Header con botones */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setMostrarInactivos(!mostrarInactivos)}
            variant="outline"
            size="sm"
            className="border-2 border-[#00C9A7]/30 text-[#00C9A7] hover:bg-[#00C9A7]/10"
          >
            {mostrarInactivos ? (
              <>
                <EyeOff className="h-4 w-4" />
                Ocultar inactivos
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Mostrar inactivos
              </>
            )}
          </Button>
          <Button
            onClick={handleNuevo}
            variant="default"
            size="lg"
            className="bg-[#00C9A7] hover:bg-[#00B396] shadow-md"
          >
            <Plus className="h-5 w-5" />
            Nuevo Producto
          </Button>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-md border-2 border-[#E5E9F2] dark:border-[#2D2D44] overflow-hidden">
            <table className="min-w-full divide-y-2 divide-[#E5E9F2] dark:divide-[#2D2D44]">
              <thead className="bg-gradient-to-r from-[#00C9A7]/10 to-transparent sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#1A1A2E] dark:text-white uppercase tracking-wider">
                    Margen
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
                          ? "hover:bg-[#F8F9FC] dark:hover:bg-[#252536] transition-colors"
                          : "bg-[#F8F9FC]/50 dark:bg-[#252536]/50 opacity-60"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-[#1A1A2E] dark:text-white">
                          {producto.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {producto.categoria?.nombre ? (
                          <Badge variant="outline" className="text-xs">
                            {producto.categoria.nombre}
                          </Badge>
                        ) : (
                          <span className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-[#1A1A2E] dark:text-white font-mono">
                          ${Number(producto.precio).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-[#1A1A2E] dark:text-white font-mono">
                          ${Number(producto.costo).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge
                          variant={margen >= 50 ? "success" : margen >= 30 ? "warning" : "destructive"}
                          className="text-xs"
                        >
                          {margen.toFixed(0)}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge
                          variant={producto.activo ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {producto.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActivo(producto)}
                            className="p-2 rounded-lg text-[#6B7A94] hover:bg-[#00C9A7]/10 hover:text-[#00C9A7] transition-all"
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
                            className="p-2 rounded-lg text-[#00C9A7] hover:bg-[#00C9A7]/10 transition-all"
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
        <div className="md:hidden space-y-5">
          {productos.map((producto: any) => {
            const margen =
              producto.precio > 0
                ? ((producto.precio - producto.costo) / producto.precio) * 100
                : 0;

            return (
              <div
                key={producto.id}
                className={`rounded-2xl shadow-md border-2 overflow-hidden transition-all duration-300 ${
                  producto.activo
                    ? "bg-white dark:bg-[#1A1A2E] border-[#E5E9F2] dark:border-[#2D2D44]"
                    : "bg-[#F8F9FC]/50 dark:bg-[#252536]/50 border-[#E5E9F2]/50 dark:border-[#2D2D44]/50 opacity-60"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-1 truncate">
                        {producto.nombre}
                      </h3>
                      {producto.categoria?.nombre ? (
                        <Badge variant="outline" className="text-xs">
                          {producto.categoria.nombre}
                        </Badge>
                      ) : (
                        <span className="text-sm text-[#6B7A94] dark:text-[#8E92A0]">
                          Sin categoría
                        </span>
                      )}
                    </div>
                    <Badge
                      variant={producto.activo ? "secondary" : "outline"}
                      className="ml-2 flex-shrink-0"
                    >
                      {producto.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-[#00C9A7]/5 to-transparent rounded-lg p-3 border border-[#00C9A7]/20">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7A94] dark:text-[#8E92A0] mb-1">
                        Precio
                      </p>
                      <p className="text-base font-bold text-[#1A1A2E] dark:text-white font-mono">
                        ${Number(producto.precio).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#FF6B35]/5 to-transparent rounded-lg p-3 border border-[#FF6B35]/20">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7A94] dark:text-[#8E92A0] mb-1">
                        Costo
                      </p>
                      <p className="text-base font-bold text-[#1A1A2E] dark:text-white font-mono">
                        ${Number(producto.costo).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#8B5FBF]/5 to-transparent rounded-lg p-3 border border-[#8B5FBF]/20">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7A94] dark:text-[#8E92A0] mb-1">
                        Margen
                      </p>
                      <p className="text-base font-bold text-[#1A1A2E] dark:text-white">
                        {margen.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleToggleActivo(producto)}
                      variant="outline"
                      className="flex-1"
                    >
                      {producto.activo ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Activar
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleEditar(producto)}
                      className="flex-1 bg-[#00C9A7] hover:bg-[#00B396]"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
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
