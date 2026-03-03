"use client"

import Link from "next/link"
import { X, Home, ShoppingCart, BarChart3, FileText, Settings, ChefHat } from "lucide-react"
import { usePathname } from "next/navigation"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/ventas", label: "Ventas", icon: ShoppingCart },
    { href: "/promedios", label: "Promedios", icon: BarChart3 },
    { href: "/reportes", label: "Reportes", icon: FileText },
    { href: "/configuracion/productos", label: "Configuración", icon: Settings },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay with animation */}
      <div
        className={`fixed inset-0 bg-black z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "bg-opacity-60" : "bg-opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar with slide animation */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-gradient-to-br from-[#FF6B35]/10 via-[#4ECDC4]/10 to-[#8B5FBF]/10 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b-2 border-white/20">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">
              Menú
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-lg text-[#424C63] dark:text-[#B8BCC8] hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href ||
              (link.href === "/configuracion/productos" && pathname?.startsWith("/configuracion"))
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] text-white shadow-lg scale-105"
                    : "text-[#1A1A2E] dark:text-white bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 hover:scale-105"
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  isActive
                    ? "bg-white/20"
                    : "bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C61]/20"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
            <p className="text-xs text-[#424C63] dark:text-[#B8BCC8] text-center">
              <strong className="text-[#FF6B35]">Rotisería Ventas</strong>
              <br />
              Sistema de gestión moderna
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
