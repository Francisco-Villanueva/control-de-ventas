import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const hoy = new Date()
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)
    const diaSemanaManana = manana.getDay()

    // Obtener todas las ventas históricas del usuario
    const ventas = await prisma.venta.findMany({
      where: {
        userId,
      },
      include: {
        producto: true,
      },
    })

    // Filtrar ventas del mismo día de la semana que mañana
    const ventasMismoDia = ventas.filter((v) => {
      const fecha = new Date(v.fecha)
      return fecha.getDay() === diaSemanaManana
    })

    // Agrupar por producto y calcular promedio
    const promediosPorProducto = ventasMismoDia.reduce((acc, v) => {
      if (!acc[v.productoId]) {
        acc[v.productoId] = {
          producto: v.producto,
          totalCantidad: 0,
          cantidadDias: 0,
        }
      }
      acc[v.productoId].totalCantidad += v.cantidad
      return acc
    }, {} as Record<number, { producto: any; totalCantidad: number; cantidadDias: number }>)

    // Contar días únicos por producto
    const diasPorProducto = ventasMismoDia.reduce((acc, v) => {
      const fechaKey = `${v.productoId}-${v.fecha.toISOString().split("T")[0]}`
      if (!acc[fechaKey]) {
        acc[fechaKey] = true
        if (promediosPorProducto[v.productoId]) {
          promediosPorProducto[v.productoId].cantidadDias++
        }
      }
      return acc
    }, {} as Record<string, boolean>)

    // Calcular promedios y crear respuesta
    const predicciones = Object.values(promediosPorProducto)
      .map((p) => ({
        productoId: p.producto.id,
        nombre: p.producto.nombre,
        cantidadSugerida:
          p.cantidadDias > 0
            ? Math.round(p.totalCantidad / p.cantidadDias)
            : 0,
        basadoEnDias: p.cantidadDias,
      }))
      .filter((p) => p.cantidadSugerida > 0)
      .sort((a, b) => b.cantidadSugerida - a.cantidadSugerida)

    // Nombres de días en español
    const nombresDias = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ]

    return NextResponse.json({
      fecha: manana.toISOString().split("T")[0],
      diaSemana: nombresDias[diaSemanaManana],
      predicciones,
    })
  } catch (error) {
    console.error("Error al obtener predicción:", error)
    return NextResponse.json(
      { error: "Error al obtener predicción" },
      { status: 500 }
    )
  }
}
