"use client"

import { CategoriasTable } from "@/components/categorias/CategoriasTable"
import { FolderOpen, Info } from "lucide-react"
import Link from "next/link"

export default function CategoriasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Categorías
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Organiza tus productos en categorías
          </p>
        </div>
        <FolderOpen className="h-8 w-8 text-blue-600" />
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p>
              Las categorías te ayudan a organizar tus productos. Por ejemplo, puedes
              crear categorías como "Empanadas", "Tartas", "Bebidas", etc.
            </p>
            <p className="mt-2">
              <Link href="/configuracion/productos" className="font-medium underline hover:text-blue-900 dark:hover:text-blue-100">
                Gestionar productos
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de categorías */}
      <CategoriasTable />
    </div>
  )
}
