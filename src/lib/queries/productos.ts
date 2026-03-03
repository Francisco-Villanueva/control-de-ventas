import prisma from "@/lib/prisma";

export async function getProductos(userId: string, activoOnly = false) {
  return await prisma.producto.findMany({
    where: {
      userId,
      ...(activoOnly ? { activo: true } : {}),
    },
    include: {
      categoria: true,
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });
}

export async function getProductoById(userId: string, id: number) {
  const producto = await prisma.producto.findFirst({
    where: { id, userId },
    include: {
      categoria: true,
    },
  });

  if (!producto) {
    throw new Error("Producto no encontrado");
  }

  return producto;
}

export async function createProducto(
  userId: string,
  data: {
    nombre: string;
    categoriaId?: number;
    precio: number;
    costo: number;
    orden?: number;
  },
) {
  return await prisma.producto.create({
    data: {
      userId,
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
  userId: string,
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
  // Validar ownership
  await getProductoById(userId, id);

  return await prisma.producto.update({
    where: { id },
    data,
    include: {
      categoria: true,
    },
  });
}

export async function deleteProducto(userId: string, id: number) {
  // Validar ownership
  await getProductoById(userId, id);

  // Soft delete
  return await prisma.producto.update({
    where: { id },
    data: { activo: false },
  });
}
