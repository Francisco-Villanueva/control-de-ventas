import { NextResponse } from "next/server"
import {
  getVentasByFecha,
  getVentasRecientes,
  createOrUpdateVentasBatch,
} from "@/lib/queries/ventas"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { getTodayString } from "@/lib/dateUtils"

const ventaBatchSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha debe ser YYYY-MM-DD"),
  ventas: z.array(
    z.object({
      productoId: z.number(),
      cantidad: z.number().min(0),
    })
  ),
})

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get("fecha")
    const dias = searchParams.get("dias")

    if (fecha) {
      const ventas = await getVentasByFecha(fecha)
      return NextResponse.json(ventas)
    }

    if (dias) {
      const ventas = await getVentasRecientes(parseInt(dias))
      return NextResponse.json(ventas)
    }

    // Por defecto, últimos 7 días
    const ventas = await getVentasRecientes(7)
    return NextResponse.json(ventas)
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    return NextResponse.json(
      { error: "Error al obtener ventas" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ventaBatchSchema.parse(body)

    // Verificar que la fecha no sea futura
    const hoy = getTodayString()
    const fechaVenta = validatedData.fecha

    if (fechaVenta > hoy) {
      return NextResponse.json(
        { error: "No se pueden registrar ventas futuras" },
        { status: 400 }
      )
    }

    const ventas = await createOrUpdateVentasBatch({
      fecha: validatedData.fecha,
      ventas: validatedData.ventas,
    })

    return NextResponse.json(ventas, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error al crear/actualizar ventas:", error)
    return NextResponse.json(
      { error: "Error al crear/actualizar ventas" },
      { status: 500 }
    )
  }
}
