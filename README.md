# Rotisería Ventas - Sistema de Control de Ventas

Aplicación web completa para gestionar y controlar las ventas de una rotisería, con análisis de promedios, reportes y configuración de productos.

## 🎯 Estado del Proyecto

### ✅ Completado

1. **Setup Inicial**
   - Proyecto Next.js 14+ con TypeScript
   - Configuración de TailwindCSS
   - Instalación de todas las dependencias necesarias

2. **Base de Datos**
   - Schema de Prisma completo (User, Categoria, Producto, Venta, Configuracion)
   - Queries reutilizables organizadas
   - Script de seed con datos de ejemplo

3. **Autenticación**
   - NextAuth.js v5 configurado
   - Páginas de login y register
   - Middleware para protección de rutas
   - Hash de contraseñas con bcrypt

4. **API Routes**
   - `/api/productos` - CRUD completo de productos
   - `/api/categorias` - CRUD completo de categorías
   - `/api/ventas` - Registro de ventas diarias
   - `/api/estadisticas/promedios` - Promedios por día de semana
   - `/api/estadisticas/resumen` - Resúmenes mensuales/anuales

5. **UI y Layout**
   - Navbar responsive con navegación móvil
   - Layout del dashboard
   - Páginas placeholder para todas las secciones
   - Componentes shadcn/ui instalados

### 🚧 Pendiente

6. **Dashboard Principal** - Implementar widgets y métricas
7. **Registro de Ventas** - Formulario interactivo para registrar ventas
8. **Página de Promedios** - Tabla y gráficos de promedios
9. **Reportes** - Gráficos y tablas de resúmenes
10. **Configuración** - CRUD completo de productos y categorías
11. **Sistema de Alertas** - Notificaciones y alertas
12. **Optimización Mobile** - Testing y ajustes finales

## 🚀 Instalación y Configuración

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
