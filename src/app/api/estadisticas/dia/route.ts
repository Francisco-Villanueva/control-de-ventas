import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { toUTCDate, fromPrismaDate, fromDateString } from "@/lib/dateUtils"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get("fecha")

    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return NextResponse.json(
        { error: "Parámetro fecha requerido en formato YYYY-MM-DD" },
        { status: 400 }
      )
    }

    const userId = session.user.id
    const fechaUTC = toUTCDate(fecha)
    const diaSemana = fromDateString(fecha).getDay()

    // Ventas del día seleccionado
    const ventasDia = await prisma.venta.findMany({
      where: { userId, fecha: fechaUTC },
      include: { producto: true },
    })

    const totalCantidad = ventasDia.reduce((sum, v) => sum + v.cantidad, 0)
    const totalIngresos = ventasDia.reduce(
      (sum, v) => sum + v.cantidad * Number(v.producto.precio),
      0
    )

    const productoMasVendido =
      ventasDia.length > 0
        ? ventasDia.reduce((max, v) => (v.cantidad > max.cantidad ? v : max))
        : null

    // Ventas anteriores al día seleccionado para calcular promedio del mismo día de semana
    const ventasAnteriores = await prisma.venta.findMany({
      where: {
        userId,
        fecha: { lt: fechaUTC },
      },
      select: { fecha: true, cantidad: true },
    })

    const ventasMismoDia = ventasAnteriores.filter((v) => {
      const fechaStr = fromPrismaDate(v.fecha)
      return fromDateString(fechaStr).getDay() === diaSemana
    })

    const ventasPorFecha = ventasMismoDia.reduce(
      (acc, v) => {
        const key = fromPrismaDate(v.fecha)
        acc[key] = (acc[key] ?? 0) + v.cantidad
        return acc
      },
      {} as Record<string, number>
    )

    const diasUnicos = Object.keys(ventasPorFecha).length
    const totalMismoDia = Object.values(ventasPorFecha).reduce(
      (sum, c) => sum + c,
      0
    )
    const promedioSemanal = diasUnicos > 0 ? totalMismoDia / diasUnicos : 0
    const comparacion =
      promedioSemanal > 0
        ? ((totalCantidad - promedioSemanal) / promedioSemanal) * 100
        : 0

    return NextResponse.json({
      dia: {
        cantidad: totalCantidad,
        ingresos: totalIngresos,
        productoMasVendido: productoMasVendido
          ? {
              nombre: productoMasVendido.producto.nombre,
              cantidad: productoMasVendido.cantidad,
            }
          : null,
      },
      promedio: {
        cantidad: Math.round(promedioSemanal),
        comparacion,
      },
    })
  } catch (error) {
    console.error("Error al obtener estadísticas del día:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
