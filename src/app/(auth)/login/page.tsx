import { LoginForm } from "@/components/auth/LoginForm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión | Rotisería Ventas",
  description: "Inicia sesión en tu cuenta",
}

export default async function LoginPage() {
  const session = await auth()

  // Si ya está logueado, redirigir al dashboard
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF6B35]/5 via-[#4ECDC4]/5 to-[#8B5FBF]/5 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}
