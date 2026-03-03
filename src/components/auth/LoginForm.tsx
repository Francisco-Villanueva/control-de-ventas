"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Mail, Lock, ChefHat, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email o contraseña incorrectos")
        setLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Error al iniciar sesión")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white dark:bg-[#1A1A2E] shadow-2xl border-2 border-[#FF6B35]/10 rounded-2xl px-8 py-10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(255,107,53,0.15)]">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-2xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 text-center text-gradient">
          Bienvenido
        </h1>
        <p className="text-center text-[#6B7A94] dark:text-[#8E92A0] mb-8">
          Ingresa a tu cuenta para continuar
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#424C63] dark:text-[#B8BCC8] mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A94]">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                {...register("email")}
                type="email"
                id="email"
                className="pl-12"
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && (
              <Badge variant="destructive" className="mt-2">
                {errors.email.message}
              </Badge>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#424C63] dark:text-[#B8BCC8] mb-2"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A94]">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                {...register("password")}
                type="password"
                id="password"
                className="pl-12"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <Badge variant="destructive" className="mt-2">
                {errors.password.message}
              </Badge>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#FF5757]/10 border-2 border-[#FF5757]/20 text-[#FF5757] px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-[#6B7A94] dark:text-[#8E92A0]">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="text-[#FF6B35] hover:text-[#E85A2A] font-semibold link-underline transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
