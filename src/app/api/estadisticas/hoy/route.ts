import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getTodayString, toUTCDate, fromPrismaDate, fromDateString } from "@/lib/dateUtils"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const hoyStr = getTodayString()
    const hoyUTC = toUTCDate(hoyStr)

    // Ventas de hoy
    const ventasHoy = await prisma.venta.findMany({
      where: {
        userId,
        fecha: hoyUTC,
      },
      include: {
        producto: true,
      },
    })

    // Calcular totales de hoy
    const cantidadTotal = ventasHoy.reduce((sum, v) => sum + v.cantidad, 0)
    const ingresosHoy = ventasHoy.reduce(
      (sum, v) => sum + v.cantidad * Number(v.producto.precio),
      0
    )

    // Producto más vendido hoy
    const productoMasVendido = ventasHoy.length > 0
      ? ventasHoy.reduce((max, v) => (v.cantidad > max.cantidad ? v : max))
      : null

    // Ventas del mes actual
    const ahora = new Date()
    const inicioMesStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-01`
    const inicioMes = toUTCDate(inicioMesStr)

    const ventasMes = await prisma.venta.findMany({
      where: {
        userId,
        fecha: {
          gte: inicioMes,
        },
      },
      include: {
        producto: true,
      },
    })

    const cantidadMes = ventasMes.reduce((sum, v) => sum + v.cantidad, 0)
    const ingresosMes = ventasMes.reduce(
      (sum, v) => sum + v.cantidad * Number(v.producto.precio),
      0
    )

    // Promedio del día de la semana actual
    const diaSemana = new Date().getDay()
    const ventasDiaSemana = await prisma.venta.findMany({
      where: {
        userId,
        fecha: {
          lt: hoyUTC,
        },
      },
      include: {
        producto: true,
      },
    })

    // Filtrar solo las ventas del mismo día de la semana
    const ventasMismoDia = ventasDiaSemana.filter((v) => {
      const fechaStr = fromPrismaDate(v.fecha)
      const fecha = fromDateString(fechaStr)
      return fecha.getDay() === diaSemana
    })

    // Agrupar por fecha para calcular promedio
    const ventasPorFecha = ventasMismoDia.reduce((acc, v) => {
      const fechaKey = fromPrismaDate(v.fecha)
      if (!acc[fechaKey]) {
        acc[fechaKey] = 0
      }
      acc[fechaKey] += v.cantidad
      return acc
    }, {} as Record<string, number>)

    const diasUnicos = Object.keys(ventasPorFecha).length
    const totalVentasMismoDia = Object.values(ventasPorFecha).reduce(
      (sum, cantidad) => sum + cantidad,
      0
    )
    const promedioSemanal = diasUnicos > 0 ? totalVentasMismoDia / diasUnicos : 0

    // Comparación con promedio
    const comparacionPromedio =
      promedioSemanal > 0 ? ((cantidadTotal - promedioSemanal) / promedioSemanal) * 100 : 0

    return NextResponse.json({
      hoy: {
        cantidad: cantidadTotal,
        ingresos: ingresosHoy,
        productoMasVendido: productoMasVendido
          ? {
              nombre: productoMasVendido.producto.nombre,
              cantidad: productoMasVendido.cantidad,
            }
          : null,
      },
      mes: {
        cantidad: cantidadMes,
        ingresos: ingresosMes,
      },
      promedio: {
        cantidad: Math.round(promedioSemanal),
        comparacion: comparacionPromedio,
      },
    })
  } catch (error) {
    console.error("Error al obtener estadísticas de hoy:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
