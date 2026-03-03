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
          <h1 className="text-4xl font-bold text-gradient">
            Gestión de Categorías
          </h1>
          <p className="mt-2 text-base text-[#6B7A94] dark:text-[#8E92A0]">
            Organiza tus productos en categorías
          </p>
        </div>
        <div className="h-16 w-16 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-2xl flex items-center justify-center shadow-lg">
          <FolderOpen className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-[#8B5FBF]/10 to-transparent border-2 border-[#8B5FBF]/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div className="text-sm text-[#424C63] dark:text-[#B8BCC8]">
            <p className="mb-3">
              Las categorías te ayudan a organizar tus productos. Por ejemplo, puedes
              crear categorías como "Empanadas", "Tartas", "Bebidas", etc.
            </p>
            <Link href="/configuracion/productos" className="inline-flex items-center gap-2 font-semibold text-[#8B5FBF] hover:text-[#7A4EAE] link-underline">
              Gestionar productos →
            </Link>
          </div>
        </div>
      </div>

      {/* Tabla de categorías */}
      <CategoriasTable />
    </div>
  )
}
