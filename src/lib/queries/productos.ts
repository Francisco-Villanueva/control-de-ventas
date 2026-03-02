import prisma from "@/lib/prisma";

export async function getProductos(activoOnly = false) {
  return await prisma.producto.findMany({
    where: activoOnly ? { activo: true } : undefined,
    include: {
      categoria: true,
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });
}

export async function getProductoById(id: number) {
  return await prisma.producto.findUnique({
    where: { id },
    include: {
      categoria: true,
    },
  });
}

export async function createProducto(data: {
  nombre: string;
  categoriaId?: number;
  precio: number;
  costo: number;
  orden?: number;
}) {
  return await prisma.producto.create({
    data: {
      nombre: data.nombre,
      categoriaId: data.categoriaId,
      precio: data.precio,
      costo: data.costo,
      orden: data.orden || 0,
      activo: true,
    },
    include: {
      categoria: true,
    },
  });
}

export async function updateProducto(
  id: number,
  data: {
    nombre?: string;
    categoriaId?: number;
    precio?: number;
    costo?: number;
    orden?: number;
    activo?: boolean;
  },
) {
  return await prisma.producto.update({
    where: { id },
    data,
    include: {
      categoria: true,
    },
  });
}

export async function deleteProducto(id: number) {
  // Soft delete
  return await prisma.producto.update({
    where: { id },
    data: { activo: false },
  });
}
