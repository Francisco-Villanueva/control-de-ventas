"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/ventas", label: "Ventas" },
    { href: "/promedios", label: "Promedios" },
    { href: "/reportes", label: "Reportes" },
    { href: "/configuracion/productos", label: "Productos" },
    { href: "/configuracion/categorias", label: "Categorías" },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Menú
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`block px-4 py-3 rounded-md mb-1 text-sm font-medium ${
                pathname === link.href
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
