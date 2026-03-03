import prisma from "@/lib/prisma";

import { subDays } from "date-fns";
import { toDateString, toUTCDate } from "@/lib/dateUtils";

export async function getVentasByFecha(userId: string, fechaStr: string) {
  return await prisma.venta.findMany({
    where: {
      userId,
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

export async function getVentasRecientes(userId: string, dias = 7) {
  const fechaInicioDate = subDays(new Date(), dias);
  const fechaInicio = toDateString(fechaInicioDate);

  return await prisma.venta.findMany({
    where: {
      userId,
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

export async function createOrUpdateVenta(
  userId: string,
  data: {
    fecha: string;
    productoId: number;
    cantidad: number;
  },
) {
  const fechaUTC = toUTCDate(data.fecha);

  // Validar que el producto pertenece al usuario
  const producto = await prisma.producto.findFirst({
    where: { id: data.productoId, userId },
  });

  if (!producto) {
    throw new Error("Producto no encontrado");
  }

  return await prisma.venta.upsert({
    where: {
      userId_fecha_productoId: {
        userId,
        fecha: fechaUTC,
        productoId: data.productoId,
      },
    },
    update: {
      cantidad: data.cantidad,
    },
    create: {
      userId,
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

export async function createOrUpdateVentasBatch(
  userId: string,
  data: {
    fecha: string;
    ventas: Array<{ productoId: number; cantidad: number }>;
  },
) {
  const results = [];

  for (const venta of data.ventas) {
    const result = await createOrUpdateVenta(userId, {
      fecha: data.fecha,
      productoId: venta.productoId,
      cantidad: venta.cantidad,
    });
    results.push(result);
  }

  return results;
}

export async function deleteVenta(
  userId: string,
  fechaStr: string,
  productoId: number,
) {
  return await prisma.venta.delete({
    where: {
      userId_fecha_productoId: {
        userId,
        fecha: toUTCDate(fechaStr),
        productoId,
      },
    },
  });
}
