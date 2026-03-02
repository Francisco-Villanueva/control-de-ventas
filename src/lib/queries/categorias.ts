import prisma from "@/lib/prisma";

export async function getCategorias(activoOnly = false) {
  return await prisma.categoria.findMany({
    where: activoOnly ? { activo: true } : undefined,
    include: {
      _count: {
        select: { productos: true },
      },
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });
}

export async function getCategoriaById(id: number) {
  return await prisma.categoria.findUnique({
    where: { id },
    include: {
      productos: true,
      _count: {
        select: { productos: true },
      },
    },
  });
}

export async function createCategoria(data: {
  nombre: string;
  orden?: number;
}) {
  return await prisma.categoria.create({
    data: {
      nombre: data.nombre,
      orden: data.orden || 0,
      activo: true,
    },
  });
}

export async function updateCategoria(
  id: number,
  data: {
    nombre?: string;
    orden?: number;
    activo?: boolean;
  },
) {
  return await prisma.categoria.update({
    where: { id },
    data,
  });
}

export async function deleteCategoria(id: number) {
  // Verificar si tiene productos
  const categoria = await prisma.categoria.findUnique({
    where: { id },
    include: {
      _count: {
        select: { productos: true },
      },
    },
  });

  if (categoria && categoria._count.productos > 0) {
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
