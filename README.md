# Rotisería Ventas 🥟

> Sistema web completo para gestionar y controlar las ventas de una rotisería, con análisis de promedios, predicciones inteligentes y configuración de productos.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎉 Estado del Proyecto

**✅ VERSIÓN 1.0 BETA - FUNCIONAL Y LISTA PARA USO DIARIO**

La aplicación está completamente operativa con el 75% de las funcionalidades planificadas implementadas. Incluye todas las características esenciales para la gestión diaria de la rotisería.

### 📊 Progreso

```
████████████████████████████████████░░░░░░░░░░░  75% Completado (9/12 tareas)
```

## ✨ Características Implementadas

### 🏠 Dashboard Principal (NUEVO)
- **Métricas en tiempo real** con auto-refresh cada 5 minutos
- **Registro rápido** de ventas del día desde el dashboard
- **Predicciones inteligentes** de producción para mañana
- **Sistema de alertas** (sin ventas, ventas bajas, feedback positivo)
- Accesos directos a todas las secciones

### 📝 Registro de Ventas
- Selector de fecha con calendario en español
- Formulario con productos agrupados por categoría
- Historial de últimos 7 días
- Edición de ventas existentes
- Validaciones y confirmaciones

### 📊 Análisis de Promedios
- Tabla detallada con promedios por día de semana
- Gráfico de barras interactivo (Recharts)
- Identificación de días de mayor/menor venta
- Producto más vendido de la semana
- 100% responsive (tabla → cards en móvil)

### ⚙️ Configuración
- **Productos**: CRUD completo con cálculo de margen de ganancia
- **Categorías**: Gestión con validación de dependencias
- Soft delete (mantiene historial)
- Activar/desactivar productos

### 🔐 Autenticación
- Login seguro con email y contraseña
- Registro de nuevos usuarios
- Sesiones JWT con NextAuth.js v5
- Protección de rutas

### 📱 Responsive Design
- Mobile-first design
- Menú hamburguesa en móvil
- Tablas que se convierten en cards
- Optimizado para tablets y desktop

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- PostgreSQL database (tienes la URL)
- npm o yarn

### Pasos de Configuración

1. **Clonar o navegar al proyecto**
   ```bash
   cd rotiseria-ventas
   ```

2. **Instalar dependencias** (ya están instaladas)
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Edita el archivo `.env.local` y configura:

   ```env
   # Tu URL de PostgreSQL
   DATABASE_URL="postgresql://user:password@host:port/database"

   # Genera un secret con: openssl rand -base64 32
   NEXTAUTH_SECRET="tu-secret-aqui"
   NEXTAUTH_URL="http://localhost:3000"

   NODE_ENV="development"
   ```

4. **Ejecutar migraciones de base de datos**
   ```bash
   npx prisma db push
   ```

5. **Poblar la base de datos con datos de ejemplo**
   ```bash
   npm run db:seed
   ```

   Esto creará:
   - Usuario de prueba: `admin@rotiseria.com` / `password123`
   - 2 categorías: Empanadas, Otros
   - 6 productos con precios
   - 30 días de ventas de ejemplo

6. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

7. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciales de Prueba

- **Email**: admin@rotiseria.com
- **Contraseña**: password123

## 📁 Estructura del Proyecto

```
rotiseria-ventas/
├── prisma/
│   ├── schema.prisma          # Schema de la base de datos
│   └── seed.ts                # Datos de ejemplo
├── src/
│   ├── app/
│   │   ├── (auth)/            # Páginas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Páginas protegidas
│   │   │   ├── page.tsx       # Dashboard principal
│   │   │   ├── ventas/
│   │   │   ├── promedios/
│   │   │   ├── reportes/
│   │   │   └── configuracion/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── productos/
│   │   │   ├── categorias/
│   │   │   ├── ventas/
│   │   │   └── estadisticas/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                # Componentes shadcn/ui
│   │   ├── layout/            # Navbar, MobileNav
│   │   └── auth/              # LoginForm, RegisterForm
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma
│   │   ├── auth.ts            # Configuración NextAuth
│   │   ├── utils.ts           # Utilidades
│   │   └── queries/           # Queries de base de datos
│   └── middleware.ts          # Protección de rutas
└── .env.local                 # Variables de entorno
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev           # Inicia servidor de desarrollo

# Build
npm run build         # Build para producción
npm start             # Ejecuta build de producción

# Base de datos
npm run db:push       # Sincroniza schema con DB
npm run db:seed       # Pobla la DB con datos de ejemplo
npm run db:studio     # Abre Prisma Studio (GUI)

# Otros
npm run lint          # Ejecuta linter
```

## 🔧 Tecnologías Utilizadas

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js v5
- **UI**: TailwindCSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Notificaciones**: Sonner

## 📝 Próximos Pasos

Para continuar con el desarrollo:

1. Implementar el Dashboard con widgets reales
2. Crear el formulario de registro de ventas
3. Implementar la página de promedios con gráficos
4. Crear los reportes mensuales/anuales
5. Completar el CRUD de productos y categorías
6. Agregar sistema de alertas
7. Optimizar para mobile
8. Deploy a Vercel

## 🐛 Solución de Problemas

### Error de conexión a la base de datos

Verifica que:
- La `DATABASE_URL` en `.env.local` sea correcta
- La base de datos PostgreSQL esté corriendo
- Tengas permisos para crear tablas

### Error "NextAuth Secret"

Genera un nuevo secret:
```bash
openssl rand -base64 32
```
Y agrégalo a `NEXTAUTH_SECRET` en `.env.local`

### Error al ejecutar seed

Asegúrate de haber ejecutado primero:
```bash
npx prisma db push
```

## 📄 Licencia

Este proyecto es privado y está desarrollado para uso exclusivo de la rotisería.

## 🤝 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.
