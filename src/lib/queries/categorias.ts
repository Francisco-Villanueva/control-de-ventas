import prisma from "@/lib/prisma";

export async function getCategorias(userId: string, activoOnly = false) {
  return await prisma.categoria.findMany({
    where: {
      userId,
      ...(activoOnly ? { activo: true } : {}),
    },
    include: {
      _count: {
        select: { productos: true },
      },
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });
}

export async function getCategoriaById(userId: string, id: number) {
  const categoria = await prisma.categoria.findFirst({
    where: { id, userId },
    include: {
      productos: true,
      _count: {
        select: { productos: true },
      },
    },
  });

  if (!categoria) {
    throw new Error("Categoría no encontrada");
  }

  return categoria;
}

export async function createCategoria(
  userId: string,
  data: {
    nombre: string;
    orden?: number;
  },
) {
  return await prisma.categoria.create({
    data: {
      userId,
      nombre: data.nombre,
      orden: data.orden || 0,
      activo: true,
    },
  });
}

export async function updateCategoria(
  userId: string,
  id: number,
  data: {
    nombre?: string;
    orden?: number;
    activo?: boolean;
  },
) {
  // Validar ownership
  await getCategoriaById(userId, id);

  return await prisma.categoria.update({
    where: { id },
    data,
  });
}

export async function deleteCategoria(userId: string, id: number) {
  // Validar ownership y verificar si tiene productos
  const categoria = await getCategoriaById(userId, id);

  if (categoria._count.productos > 0) {
    throw new Error(
      "No se puede eliminar una categoría con productos asociados",
    );
  }

  // Soft delete
  return await prisma.categoria.update({
    where: { id },
    data: { activo: false },
  });
}
