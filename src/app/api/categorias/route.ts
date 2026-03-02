import { NextResponse } from "next/server"
import { getCategorias, createCategoria } from "@/lib/queries/categorias"
import { auth } from "@/lib/auth"
import { z } from "zod"

const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
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

    const categorias = await getCategorias(activoOnly)
    return NextResponse.json(categorias)
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json(
      { error: "Error al obtener categorías" },
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
    const validatedData = categoriaSchema.parse(body)

    const categoria = await createCategoria(validatedData)
    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error al crear categoría:", error)
    return NextResponse.json(
      { error: "Error al crear categoría" },
      { status: 500 }
    )
  }
}
