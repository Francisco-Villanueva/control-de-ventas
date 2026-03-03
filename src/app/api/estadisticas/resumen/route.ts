import { NextResponse } from "next/server"
import {
  getResumenMensual,
  getResumenAnual,
} from "@/lib/queries/estadisticas"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const periodo = searchParams.get("periodo") // 'mensual' o 'anual'
    const fecha = searchParams.get("fecha") // formato: 'YYYY-MM' o 'YYYY'

    if (!periodo || !fecha) {
      return NextResponse.json(
        { error: "Se requieren los parámetros 'periodo' y 'fecha'" },
        { status: 400 }
      )
    }

    const fechaObj = new Date(fecha)

    if (periodo === "mensual") {
      const resumen = await getResumenMensual(userId, fechaObj)
      return NextResponse.json(resumen)
    } else if (periodo === "anual") {
      const resumen = await getResumenAnual(userId, fechaObj)
      return NextResponse.json(resumen)
    } else {
      return NextResponse.json(
        { error: "Periodo inválido. Use 'mensual' o 'anual'" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error al obtener resumen:", error)
    return NextResponse.json(
      { error: "Error al obtener resumen" },
      { status: 500 }
    )
  }
}
