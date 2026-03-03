import prisma from "@/lib/prisma";

import { subDays } from "date-fns";
import { toDateString, toUTCDate } from "@/lib/dateUtils";

export async function getVentasByFecha(fechaStr: string) {
  return await prisma.venta.findMany({
    where: {
      fecha: toUTCDate(fechaStr),
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
  const fechaInicioDate = subDays(new Date(), dias);
  const fechaInicio = toDateString(fechaInicioDate);

  return await prisma.venta.findMany({
    where: {
      fecha: {
        gte: toUTCDate(fechaInicio),
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
  fecha: string;
  productoId: number;
  cantidad: number;
}) {
  const fechaUTC = toUTCDate(data.fecha);

  return await prisma.venta.upsert({
    where: {
      fecha_productoId: {
        fecha: fechaUTC,
        productoId: data.productoId,
      },
    },
    update: {
      cantidad: data.cantidad,
    },
    create: {
      fecha: fechaUTC,
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
  fecha: string;
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

export async function deleteVenta(fechaStr: string, productoId: number) {
  return await prisma.venta.delete({
    where: {
      fecha_productoId: {
        fecha: toUTCDate(fechaStr),
        productoId,
      },
    },
  });
}
