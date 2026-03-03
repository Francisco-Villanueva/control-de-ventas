import dotenv from "dotenv";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Cargar variables de entorno desde .env.local
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Iniciando seed de base de datos...");

  // Limpiar datos existentes
  console.log("🧹 Limpiando datos existentes...");
  await prisma.venta.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.configuracion.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Datos limpiados");

  // Crear usuarios de prueba
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "admin@rotiseria.com",
      name: "Rotisería Central",
      password: hashedPassword,
    },
  });
  console.log("✅ Usuario 1 creado:", user1.email);

  const user2 = await prisma.user.create({
    data: {
      email: "norte@rotiseria.com",
      name: "Rotisería Norte",
      password: hashedPassword,
    },
  });
  console.log("✅ Usuario 2 creado:", user2.email);

  // Crear categorías para User 1
  const categoriaEmpanadas = await prisma.categoria.create({
    data: {
      userId: user1.id,
      nombre: "Empanadas",
      orden: 1,
      activo: true,
    },
  });

  const categoriaOtros = await prisma.categoria.create({
    data: {
      userId: user1.id,
      nombre: "Pizzas",
      orden: 2,
      activo: true,
    },
  });
  console.log("✅ Categorías creadas para User 1");

  // Crear productos para User 1
  const productos = [
    {
      userId: user1.id,
      nombre: "Empanada de Carne",
      precio: 1200,
      costo: 500,
      categoriaId: categoriaEmpanadas.id,
      orden: 1,
    },
    {
      userId: user1.id,
      nombre: "Empanada de Pollo",
      precio: 1100,
      costo: 450,
      categoriaId: categoriaEmpanadas.id,
      orden: 2,
    },
    {
      userId: user1.id,
      nombre: "Empanada de Jamón y Queso",
      precio: 1000,
      costo: 400,
      categoriaId: categoriaEmpanadas.id,
      orden: 3,
    },
    {
      userId: user1.id,
      nombre: "Empanada de Verdura",
      precio: 900,
      costo: 350,
      categoriaId: categoriaEmpanadas.id,
      orden: 4,
    },
    {
      userId: user1.id,
      nombre: "Empanada de Humita",
      precio: 1000,
      costo: 380,
      categoriaId: categoriaEmpanadas.id,
      orden: 5,
    },
    {
      userId: user1.id,
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
  console.log("✅ Productos creados para User 1");

  // Obtener productos creados para User 1
  const productosUser1 = await prisma.producto.findMany({
    where: { userId: user1.id },
  });

  // Crear ventas de ejemplo para User 1 (últimos 30 días)
  const today = new Date();
  const ventasDataUser1 = [];

  for (let i = 0; i < 30; i++) {
    const fecha = new Date(today);
    fecha.setDate(fecha.getDate() - i);

    // Obtener día de la semana (0 = domingo, 6 = sábado)
    const diaSemana = fecha.getDay();

    // Factores de venta según día de semana (fin de semana vende más)
    const factorDia = diaSemana === 0 || diaSemana === 6 ? 1.5 : 1.0;

    for (const producto of productosUser1) {
      // Base de ventas aleatoria entre 20 y 60
      const baseVenta = Math.floor(Math.random() * 40) + 20;
      const cantidad = Math.floor(baseVenta * factorDia);

      ventasDataUser1.push({
        userId: user1.id,
        fecha,
        productoId: producto.id,
        cantidad,
      });
    }
  }

  // Crear todas las ventas para User 1
  for (const venta of ventasDataUser1) {
    await prisma.venta.upsert({
      where: {
        userId_fecha_productoId: {
          userId: venta.userId,
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
    `✅ ${ventasDataUser1.length} ventas creadas para User 1 (últimos 30 días)`,
  );

  // Crear datos para User 2 (para probar aislamiento)
  const categoriaEmpanadasu2 = await prisma.categoria.create({
    data: {
      userId: user2.id,
      nombre: "Empanadas",
      orden: 1,
      activo: true,
    },
  });

  const categoriaPastasu2 = await prisma.categoria.create({
    data: {
      userId: user2.id,
      nombre: "Pastas",
      orden: 2,
      activo: true,
    },
  });

  const productosUser2Data = [
    {
      userId: user2.id,
      nombre: "Empanada de Carne",
      precio: 1300,
      costo: 550,
      categoriaId: categoriaEmpanadasu2.id,
      orden: 1,
    },
    {
      userId: user2.id,
      nombre: "Empanada de Pollo",
      precio: 1200,
      costo: 500,
      categoriaId: categoriaEmpanadasu2.id,
      orden: 2,
    },
    {
      userId: user2.id,
      nombre: "Ravioles",
      precio: 4000,
      costo: 2000,
      categoriaId: categoriaPastasu2.id,
      orden: 3,
    },
    {
      userId: user2.id,
      nombre: "Ñoquis",
      precio: 3500,
      costo: 1800,
      categoriaId: categoriaPastasu2.id,
      orden: 4,
    },
  ];

  for (const producto of productosUser2Data) {
    await prisma.producto.create({
      data: producto,
    });
  }
  console.log("✅ Productos creados para User 2");

  // Crear ventas para User 2 (últimos 30 días)
  const productosUser2 = await prisma.producto.findMany({
    where: { userId: user2.id },
  });

  const ventasDataUser2 = [];

  for (let i = 0; i < 30; i++) {
    const fecha = new Date(today);
    fecha.setDate(fecha.getDate() - i);

    const diaSemana = fecha.getDay();
    const factorDia = diaSemana === 0 || diaSemana === 6 ? 1.5 : 1.0;

    for (const producto of productosUser2) {
      const baseVenta = Math.floor(Math.random() * 40) + 20;
      const cantidad = Math.floor(baseVenta * factorDia);

      ventasDataUser2.push({
        userId: user2.id,
        fecha,
        productoId: producto.id,
        cantidad,
      });
    }
  }

  for (const venta of ventasDataUser2) {
    await prisma.venta.upsert({
      where: {
        userId_fecha_productoId: {
          userId: venta.userId,
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
    `✅ ${ventasDataUser2.length} ventas creadas para User 2 (últimos 30 días)`,
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
