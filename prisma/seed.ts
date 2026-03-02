import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Iniciando seed de base de datos...");

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "admin@rotiseria.com",
      name: "Administrador",
      password: hashedPassword,
    },
  });
  console.log("✅ Usuario creado:", user.email);

  // Crear categorías
  const categoriaEmpanadas = await prisma.categoria.create({
    data: {
      nombre: "Empanadas",
      orden: 1,
      activo: true,
    },
  });

  const categoriaOtros = await prisma.categoria.create({
    data: {
      nombre: "Pizzas",
      orden: 2,
      activo: true,
    },
  });
  console.log("✅ Categorías creadas");

  // Crear productos de empanadas
  const productos = [
    {
      nombre: "Empanada de Carne",
      precio: 1200,
      costo: 500,
      categoriaId: categoriaEmpanadas.id,
      orden: 1,
    },
    {
      nombre: "Empanada de Pollo",
      precio: 1100,
      costo: 450,
      categoriaId: categoriaEmpanadas.id,
      orden: 2,
    },
    {
      nombre: "Empanada de Jamón y Queso",
      precio: 1000,
      costo: 400,
      categoriaId: categoriaEmpanadas.id,
      orden: 3,
    },
    {
      nombre: "Empanada de Verdura",
      precio: 900,
      costo: 350,
      categoriaId: categoriaEmpanadas.id,
      orden: 4,
    },
    {
      nombre: "Empanada de Humita",
      precio: 1000,
      costo: 380,
      categoriaId: categoriaEmpanadas.id,
      orden: 5,
    },
    {
      nombre: "Tarta de Pollo",
      precio: 3500,
      costo: 1500,
      categoriaId: categoriaOtros.id,
      orden: 6,
    },
  ];

  for (const producto of productos) {
    await prisma.producto.create({
      data: producto,
    });
  }
  console.log("✅ Productos creados");

  // Obtener productos creados
  const productosCreados = await prisma.producto.findMany();

  // Crear ventas de ejemplo para los últimos 30 días
  const today = new Date();
  const ventasData = [];

  for (let i = 0; i < 30; i++) {
    const fecha = new Date(today);
    fecha.setDate(fecha.getDate() - i);

    // Obtener día de la semana (0 = domingo, 6 = sábado)
    const diaSemana = fecha.getDay();

    // Factores de venta según día de semana (fin de semana vende más)
    const factorDia = diaSemana === 0 || diaSemana === 6 ? 1.5 : 1.0;

    for (const producto of productosCreados) {
      // Base de ventas aleatoria entre 20 y 60
      const baseVenta = Math.floor(Math.random() * 40) + 20;
      const cantidad = Math.floor(baseVenta * factorDia);

      ventasData.push({
        fecha,
        productoId: producto.id,
        cantidad,
      });
    }
  }

  // Crear todas las ventas
  for (const venta of ventasData) {
    await prisma.venta.upsert({
      where: {
        fecha_productoId: {
          fecha: venta.fecha,
          productoId: venta.productoId,
        },
      },
      update: {
        cantidad: venta.cantidad,
      },
      create: venta,
    });
  }
  console.log(
    `✅ ${ventasData.length} ventas creadas para los últimos 30 días`,
  );

  console.log("🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
