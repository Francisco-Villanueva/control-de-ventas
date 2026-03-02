import { RegisterForm } from "@/components/auth/RegisterForm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registrarse | Rotisería Ventas",
  description: "Crea una nueva cuenta",
}

export default async function RegisterPage() {
  const session = await auth()

  // Si ya está logueado, redirigir al dashboard
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  )
}
