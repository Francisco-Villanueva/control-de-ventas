"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, LogOut, User, ChefHat } from "lucide-react"
import { useState } from "react"
import { MobileNav } from "./MobileNav"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/ventas", label: "Ventas" },
    { href: "/promedios", label: "Promedios" },
    { href: "/reportes", label: "Reportes" },
    { href: "/configuracion/productos", label: "Configuración" },
  ]

  return (
    <>
      <nav className="bg-white dark:bg-[#1A1A2E] shadow-md border-b-2 border-[#E5E9F2] dark:border-[#2D2D44] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18">
            <div className="flex items-center gap-8">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-[#424C63] dark:text-[#B8BCC8] hover:bg-[#F8F9FC] dark:hover:bg-[#252536] focus:outline-none transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient hidden sm:block">
                  Rotisería Ventas
                </span>
              </Link>

              {/* Desktop navigation */}
              <div className="hidden lg:flex lg:space-x-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href ||
                    (link.href === "/configuracion/productos" && pathname?.startsWith("/configuracion"))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] text-white shadow-md"
                          : "text-[#424C63] dark:text-[#B8BCC8] hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* User menu */}
            {session && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F8F9FC] dark:bg-[#252536]">
                  <div className="h-8 w-8 bg-gradient-to-br from-[#8B5FBF] to-[#A47FD5] rounded-full flex items-center justify-center shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#1A1A2E] dark:text-white">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#FF5757] text-[#FF5757] hover:bg-[#FF5757] hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
