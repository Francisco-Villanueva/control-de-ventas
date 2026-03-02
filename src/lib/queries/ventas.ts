import prisma from "@/lib/prisma";

import { startOfDay, endOfDay, subDays } from "date-fns";

export async function getVentasByFecha(fecha: Date) {
  return await prisma.venta.findMany({
    where: {
      fecha: startOfDay(fecha),
    },
    include: {
      producto: {
        include: {
          categoria: true,
        },
      },
    },
    orderBy: {
      producto: {
        orden: "asc",
      },
    },
  });
}

export async function getVentasRecientes(dias = 7) {
  const fechaInicio = subDays(new Date(), dias);

  return await prisma.venta.findMany({
    where: {
      fecha: {
        gte: startOfDay(fechaInicio),
      },
    },
    include: {
      producto: {
        include: {
          categoria: true,
        },
      },
    },
    orderBy: {
      fecha: "desc",
    },
  });
}

export async function createOrUpdateVenta(data: {
  fecha: Date;
  productoId: number;
  cantidad: number;
}) {
  return await prisma.venta.upsert({
    where: {
      fecha_productoId: {
        fecha: startOfDay(data.fecha),
        productoId: data.productoId,
      },
    },
    update: {
      cantidad: data.cantidad,
    },
    create: {
      fecha: startOfDay(data.fecha),
      productoId: data.productoId,
      cantidad: data.cantidad,
    },
    include: {
      producto: {
        include: {
          categoria: true,
        },
      },
    },
  });
}

export async function createOrUpdateVentasBatch(data: {
  fecha: Date;
  ventas: Array<{ productoId: number; cantidad: number }>;
}) {
  const results = [];

  for (const venta of data.ventas) {
    const result = await createOrUpdateVenta({
      fecha: data.fecha,
      productoId: venta.productoId,
      cantidad: venta.cantidad,
    });
    results.push(result);
  }

  return results;
}

export async function deleteVenta(fecha: Date, productoId: number) {
  return await prisma.venta.delete({
    where: {
      fecha_productoId: {
        fecha: startOfDay(fecha),
        productoId,
      },
    },
  });
}
