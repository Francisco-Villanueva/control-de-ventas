import { NextResponse } from "next/server"
import {
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
} from "@/lib/queries/categorias"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateCategoriaSchema = z.object({
  nombre: z.string().min(1).optional(),
  orden: z.number().optional(),
  activo: z.boolean().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = await params
    const categoria = await getCategoriaById(userId, parseInt(id))

    return NextResponse.json(categoria)
  } catch (error: any) {
    if (error.message === "Categoría no encontrada") {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      )
    }

    console.error("Error al obtener categoría:", error)
    return NextResponse.json(
      { error: "Error al obtener categoría" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = await params
    const body = await request.json()
    const validatedData = updateCategoriaSchema.parse(body)

    const categoria = await updateCategoria(userId, parseInt(id), validatedData)
    return NextResponse.json(categoria)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }

    if (error.message === "Categoría no encontrada") {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      )
    }

    console.error("Error al actualizar categoría:", error)
    return NextResponse.json(
      { error: "Error al actualizar categoría" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = await params
    await deleteCategoria(userId, parseInt(id))
    return NextResponse.json({ message: "Categoría eliminada" })
  } catch (error: any) {
    if (error.message === "Categoría no encontrada") {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      )
    }

    console.error("Error al eliminar categoría:", error)
    return NextResponse.json(
      { error: error.message || "Error al eliminar categoría" },
      { status: 500 }
    )
  }
}
