import { NextResponse } from "next/server"
import {
  getProductoById,
  updateProducto,
  deleteProducto,
} from "@/lib/queries/productos"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateProductoSchema = z.object({
  nombre: z.string().min(1).optional(),
  categoriaId: z.number().optional(),
  precio: z.number().min(0).optional(),
  costo: z.number().min(0).optional(),
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
    const producto = await getProductoById(userId, parseInt(id))

    return NextResponse.json(producto)
  } catch (error: any) {
    if (error.message === "Producto no encontrado") {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    console.error("Error al obtener producto:", error)
    return NextResponse.json(
      { error: "Error al obtener producto" },
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
    const validatedData = updateProductoSchema.parse(body)

    const producto = await updateProducto(userId, parseInt(id), validatedData)
    return NextResponse.json(producto)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }

    if (error.message === "Producto no encontrado") {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    console.error("Error al actualizar producto:", error)
    return NextResponse.json(
      { error: "Error al actualizar producto" },
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
    await deleteProducto(userId, parseInt(id))
    return NextResponse.json({ message: "Producto eliminado" })
  } catch (error: any) {
    if (error.message === "Producto no encontrado") {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    console.error("Error al eliminar producto:", error)
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    )
  }
}
