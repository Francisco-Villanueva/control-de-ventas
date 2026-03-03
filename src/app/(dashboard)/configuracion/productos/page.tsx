"use client"

import { ProductosTable } from "@/components/productos/ProductosTable"
import { Package, Info } from "lucide-react"
import Link from "next/link"

export default function ProductosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">
            Gestión de Productos
          </h1>
          <p className="mt-2 text-base text-[#6B7A94] dark:text-[#8E92A0]">
            Administra tus productos, precios y costos
          </p>
        </div>
        <div className="h-16 w-16 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-2xl flex items-center justify-center shadow-lg">
          <Package className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-[#00C9A7]/10 to-transparent border-2 border-[#00C9A7]/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-[#00C9A7] to-[#00DBB7] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
            <p className="mb-3">
              Los productos activos aparecen en el formulario de registro de ventas.
              Si desactivas un producto, no podrás registrar ventas para él, pero se
              mantendrán las ventas históricas.
            </p>
            <Link href="/configuracion/categorias" className="inline-flex items-center gap-2 font-semibold text-[#00C9A7] hover:text-[#00B396] link-underline">
              Gestionar categorías →
            </Link>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <ProductosTable />
    </div>
  )
}
