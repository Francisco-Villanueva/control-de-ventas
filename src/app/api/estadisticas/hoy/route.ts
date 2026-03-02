import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    // Ventas de hoy
    const ventasHoy = await prisma.venta.findMany({
      where: {
        fecha: hoy,
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
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const ventasMes = await prisma.venta.findMany({
      where: {
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
    const diaSemana = hoy.getDay()
    const ventasDiaSemana = await prisma.venta.findMany({
      where: {
        fecha: {
          lt: hoy,
        },
      },
      include: {
        producto: true,
      },
    })

    // Filtrar solo las ventas del mismo día de la semana
    const ventasMismoDia = ventasDiaSemana.filter((v) => {
      const fecha = new Date(v.fecha)
      return fecha.getDay() === diaSemana
    })

    // Agrupar por fecha para calcular promedio
    const ventasPorFecha = ventasMismoDia.reduce((acc, v) => {
      const fechaKey = v.fecha.toISOString().split("T")[0]
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
