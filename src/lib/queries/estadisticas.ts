import prisma from "@/lib/prisma";

import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";

export async function getPromediosPorDiaSemana() {
  // Obtener todas las ventas
  const ventas = await prisma.venta.findMany({
    include: {
      producto: true,
    },
  });

  // Agrupar por día de semana y producto
  const promedios: Record<
    number,
    Record<number, { total: number; count: number; productoNombre: string }>
  > = {};

  ventas.forEach((venta) => {
    const fecha = new Date(venta.fecha);
    const diaSemana = fecha.getDay(); // 0 = Domingo, 6 = Sábado

    if (!promedios[diaSemana]) {
      promedios[diaSemana] = {};
    }

    if (!promedios[diaSemana][venta.productoId]) {
      promedios[diaSemana][venta.productoId] = {
        total: 0,
        count: 0,
        productoNombre: venta.producto.nombre,
      };
    }

    promedios[diaSemana][venta.productoId].total += venta.cantidad;
    promedios[diaSemana][venta.productoId].count += 1;
  });

  // Calcular promedios
  const resultado: Array<{
    diaSemana: number;
    diaNombre: string;
    productos: Array<{
      productoId: number;
      productoNombre: string;
      promedio: number;
    }>;
  }> = [];

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  for (let dia = 0; dia < 7; dia++) {
    const productosDelDia = promedios[dia] || {};
    const productos = Object.entries(productosDelDia).map(
      ([productoId, data]) => ({
        productoId: parseInt(productoId),
        productoNombre: data.productoNombre,
        promedio: Math.round(data.total / data.count),
      }),
    );

    resultado.push({
      diaSemana: dia,
      diaNombre: nombresDias[dia],
      productos,
    });
  }

  return resultado;
}

export async function getResumenMensual(fecha: Date) {
  const inicio = startOfMonth(fecha);
  const fin = endOfMonth(fecha);

  const ventas = await prisma.venta.findMany({
    where: {
      fecha: {
        gte: inicio,
        lte: fin,
      },
    },
    include: {
      producto: true,
    },
  });

  // Agrupar por producto
  const resumenPorProducto: Record<
    number,
    {
      productoId: number;
      productoNombre: string;
      totalCantidad: number;
      precio: number;
      costo: number;
    }
  > = {};

  ventas.forEach((venta) => {
    if (!resumenPorProducto[venta.productoId]) {
      resumenPorProducto[venta.productoId] = {
        productoId: venta.productoId,
        productoNombre: venta.producto.nombre,
        totalCantidad: 0,
        precio: Number(venta.producto.precio),
        costo: Number(venta.producto.costo),
      };
    }

    resumenPorProducto[venta.productoId].totalCantidad += venta.cantidad;
  });

  // Calcular totales
  const productos = Object.values(resumenPorProducto).map((producto) => ({
    ...producto,
    ingresos: producto.totalCantidad * producto.precio,
    ganancias: producto.totalCantidad * (producto.precio - producto.costo),
  }));

  const totales = productos.reduce(
    (acc, producto) => ({
      totalCantidad: acc.totalCantidad + producto.totalCantidad,
      totalIngresos: acc.totalIngresos + producto.ingresos,
      totalGanancias: acc.totalGanancias + producto.ganancias,
    }),
    { totalCantidad: 0, totalIngresos: 0, totalGanancias: 0 },
  );

  return {
    mes: format(fecha, "yyyy-MM"),
    productos,
    totales,
  };
}

export async function getResumenAnual(fecha: Date) {
  const inicio = startOfYear(fecha);
  const fin = endOfYear(fecha);

  const ventas = await prisma.venta.findMany({
    where: {
      fecha: {
        gte: inicio,
        lte: fin,
      },
    },
    include: {
      producto: true,
    },
  });

  // Agrupar por mes
  const resumenPorMes: Record<
    string,
    {
      mes: string;
      totalCantidad: number;
      totalIngresos: number;
      totalGanancias: number;
    }
  > = {};

  ventas.forEach((venta) => {
    const mes = format(new Date(venta.fecha), "yyyy-MM");

    if (!resumenPorMes[mes]) {
      resumenPorMes[mes] = {
        mes,
        totalCantidad: 0,
        totalIngresos: 0,
        totalGanancias: 0,
      };
    }

    const precio = Number(venta.producto.precio);
    const costo = Number(venta.producto.costo);

    resumenPorMes[mes].totalCantidad += venta.cantidad;
    resumenPorMes[mes].totalIngresos += venta.cantidad * precio;
    resumenPorMes[mes].totalGanancias += venta.cantidad * (precio - costo);
  });

  return Object.values(resumenPorMes).sort((a, b) =>
    a.mes.localeCompare(b.mes),
  );
}

export async function getVentasDelDia(fecha: Date) {
  const ventas = await prisma.venta.findMany({
    where: {
      fecha: startOfMonth(fecha),
    },
    include: {
      producto: true,
    },
  });

  const totalCantidad = ventas.reduce((acc, venta) => acc + venta.cantidad, 0);
  const totalIngresos = ventas.reduce(
    (acc, venta) => acc + venta.cantidad * Number(venta.producto.precio),
    0,
  );

  return {
    fecha: format(fecha, "yyyy-MM-dd"),
    totalCantidad,
    totalIngresos,
    ventas,
  };
}
