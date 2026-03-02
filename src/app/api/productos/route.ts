import { NextResponse } from "next/server"
import { getProductos, createProducto } from "@/lib/queries/productos"
import { auth } from "@/lib/auth"
import { z } from "zod"

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  categoriaId: z.number().optional(),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  costo: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  orden: z.number().optional(),
})

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const activoOnly = searchParams.get("activo") === "true"

    const productos = await getProductos(activoOnly)
    return NextResponse.json(productos)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json(
      { error: "Error al obtener productos" },
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
    const validatedData = productoSchema.parse(body)

    const producto = await createProducto(validatedData)
    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error al crear producto:", error)
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    )
  }
}
