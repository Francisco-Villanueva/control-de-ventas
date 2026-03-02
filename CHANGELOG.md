# Changelog - Rotisería Ventas

Todos los cambios notables en este proyecto están documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [1.0.0-beta] - 2026-03-02

### 🎉 Primera Versión Beta - Funcional

Esta versión incluye todas las funcionalidades core para operación diaria de la rotisería.

### ✨ Added (Agregado)

#### Dashboard Principal
- **StatsCards**: 4 tarjetas de métricas con datos en tiempo real
  - Total de ventas hoy (cantidad e ingresos)
  - Total del mes actual
  - Comparación vs promedio histórico (%)
  - Producto más vendido del día
- **VentasHoyWidget**: Formulario de registro rápido para ventas del día
  - Pre-carga ventas existentes para edición
  - Productos agrupados por categoría
  - Contador de unidades totales
- **ProduccionSugeridaWidget**: Predicciones inteligentes para producción de mañana
  - Basado en promedios históricos por día de semana
  - Ranking de productos (Top 3 destacados)
  - Indicador de confianza (basado en N días de historial)
- **AlertasCard**: Sistema de notificaciones inteligentes
  - Alerta "Sin registro hoy"
  - Alerta "Ventas bajas" (< 70% del promedio)
  - Feedback positivo cuando ventas van bien
- Quick links a todas las secciones principales

#### API Endpoints
- `GET /api/estadisticas/hoy`: Métricas del día en tiempo real
  - Ventas hoy (cantidad, ingresos, mejor producto)
  - Ventas del mes actual
  - Promedio histórico y comparación
- `GET /api/estadisticas/prediccion`: Sugerencias de producción
  - Calcula cantidades sugeridas para mañana
  - Basado en historial del mismo día de la semana
  - Ranking por volumen

#### Hooks
- `useEstadisticasHoy()`: Obtiene métricas del día con auto-refresh (5min)
- `usePrediccionProduccion()`: Obtiene predicciones con cache de 30min

#### Mejoras de UX
- Dashboard completamente interactivo
- Auto-refresh de métricas cada 5 minutos
- Loading states con skeletons
- Diseño responsive optimizado
- Animaciones y transiciones suaves
- Colores y badges para mejor visualización de datos

### 🔧 Changed (Cambiado)

- `src/app/(dashboard)/page.tsx`: Reemplazado placeholder por dashboard funcional
- Estructura del dashboard ahora es client-side para interactividad
- Mejoras en el sistema de colores y contraste

### 📝 Documentation (Documentación)

- Actualizado `TAREAS_PENDIENTES.md` con progreso 75%
- Creado `ESTADO_PROYECTO.md` con resumen ejecutivo
- Creado `CHANGELOG.md` para tracking de cambios

---

## [0.9.0] - 2026-03-01

### ✨ Added

#### Configuración de Productos y Categorías
- **ProductoForm**: Modal para crear/editar productos
  - Cálculo automático de margen de ganancia en tiempo real
  - Selector de categoría con datos en vivo
  - Validación con Zod
- **ProductosTable**: Tabla CRUD completa
  - Vista desktop: tabla con todas las columnas
  - Vista móvil: cards apiladas
  - Soft delete (activar/desactivar)
  - Indicador visual de margen (verde/amarillo/rojo)
  - Filtro para mostrar/ocultar inactivos
- **CategoriaForm**: Modal para crear/editar categorías
  - Campo de orden personalizable
- **CategoriasTable**: Gestión de categorías
  - Contador de productos por categoría
  - Validación: no permite eliminar si tiene productos
  - Responsive (tabla → cards)

#### Hooks
- `useCrearProducto()`: Mutación para crear productos
- `useActualizarProducto()`: Mutación para editar productos
- `useEliminarProducto()`: Mutación para soft delete
- `useCrearCategoria()`: Mutación para crear categorías
- `useActualizarCategoria()`: Mutación para editar categorías
- `useEliminarCategoria()`: Mutación para eliminar categorías

#### Páginas
- `/configuracion/productos`: Gestión completa de productos
- `/configuracion/categorias`: Gestión completa de categorías

### 🔧 Changed

- Extendido `useProductos` con mutations
- Creado nuevo hook `useCategorias` con CRUD completo
- Mejorada navegación en navbar con links a configuración

---

## [0.8.0] - 2026-02-28

### ✨ Added

#### Página de Promedios
- **PromediosTable**: Tabla detallada con promedios por día de semana
  - 7 filas (lun-dom) × N productos
  - Columnas sticky para scroll horizontal
  - Highlight del día actual (fondo azul)
  - Vista responsive (cards en móvil)
  - Totales por día y por producto
- **PromediosChart**: Gráfico de barras con Recharts
  - 7 colores diferentes para productos
  - Leyenda interactiva
  - Responsive
  - Tooltip con información detallada
- **StatsCards**: 4 tarjetas con métricas clave
  - Promedio semanal general
  - Día de mayor venta
  - Día de menor venta
  - Producto más vendido
- Info cards con explicaciones y consejos

#### API
- `GET /api/estadisticas/promedios`: Cálculo de promedios por día de semana

#### Hooks
- `usePromediosPorDiaSemana()`: Obtiene promedios con cache de 5min

#### Página
- `/promedios`: Vista completa de análisis de promedios

---

## [0.7.0] - 2026-02-27

### ✨ Added

#### Registro de Ventas
- **CalendarioSelector**: Selector de fecha con date-picker
  - Locale en español
  - No permite fechas futuras
  - Navegación intuitiva
- **VentaDiariaForm**: Formulario completo de ventas
  - Productos agrupados por categoría
  - Headers sticky al hacer scroll
  - Campos numéricos con validación
  - Contador total de unidades
  - Pre-carga ventas existentes para edición
  - Validación: al menos 1 producto con cantidad > 0
- **VentasList**: Historial de últimos 7 días
  - Vista en cards con fecha y totales
  - Formato de fecha en español
  - Indicador de día actual
  - Click para editar (cambia fecha en selector)

#### API
- `POST /api/ventas`: Crear o actualizar ventas por fecha
  - Usa upsert por constraint único [fecha, productoId]
  - Validación con Zod
  - Transacción atómica

#### Hooks
- `useVentas(fecha)`: Obtiene ventas de una fecha específica
- `useGuardarVentas()`: Mutación con invalidación de cache

#### Página
- `/ventas`: Página completa de registro de ventas

---

## [0.6.0] - 2026-02-26

### ✨ Added

#### UI Components (shadcn/ui)
- Instalados componentes base:
  - Button, Input, Form, Label
  - Table, Card, Dialog, Sheet
  - Select, Tabs, Badge
  - Calendar, Popover
  - Toast (Sonner)

#### Layout y Navegación
- **Navbar**: Barra de navegación responsive
  - Logo y título
  - Links de navegación principales
  - Dropdown de usuario con logout
  - Indicador de usuario actual
- **MobileNav**: Menú hamburguesa para móvil
  - Sheet lateral con animación
  - Todos los links principales
  - Botón de logout
  - Auto-close al navegar

#### Dashboard Layout
- Layout base en `(dashboard)/layout.tsx`
- Protección de rutas con auth check
- Estructura responsive
- Dark mode soportado

---

## [0.5.0] - 2026-02-25

### ✨ Added

#### API Routes
- `GET /api/productos`: Listar productos (con filtro activo)
- `POST /api/productos`: Crear producto
- `PUT /api/productos/[id]`: Actualizar producto
- `DELETE /api/productos/[id]`: Soft delete producto
- `GET /api/categorias`: Listar categorías
- `POST /api/categorias`: Crear categoría
- `PUT /api/categorias/[id]`: Actualizar categoría
- `DELETE /api/categorias/[id]`: Eliminar categoría (con validación)
- `POST /api/ventas`: Crear/actualizar ventas
- `GET /api/estadisticas/promedios`: Calcular promedios
- `GET /api/estadisticas/resumen`: Resumen mensual/anual

#### Query Layer
- `src/lib/queries/productos.ts`: Queries de productos
- `src/lib/queries/categorias.ts`: Queries de categorías
- `src/lib/queries/ventas.ts`: Queries de ventas
- `src/lib/queries/estadisticas.ts`: Queries complejas de estadísticas

#### Hooks (React Query)
- `useProductos(activo)`: Obtener productos
- `useCategorias(activo)`: Obtener categorías

### 🐛 Fixed

- Zod validation: Cambiado `error.errors` a `error.issues` (Zod 4.x)
- Todos los API routes actualizados con manejo correcto de errores

---

## [0.4.0] - 2026-02-24

### ✨ Added

#### Autenticación
- NextAuth.js v5 configurado con Credentials provider
- Páginas de login (`/login`) y registro (`/register`)
- `LoginForm` y `RegisterForm` components
- Protección de rutas vía layout-level check
- Hash de passwords con bcryptjs
- Sesiones JWT

#### API
- `POST /api/auth/[...nextauth]`: Handler de NextAuth
- `POST /api/register`: Registro de nuevos usuarios

### 🔧 Changed

- Eliminado `middleware.ts` (incompatible con Prisma en Edge Runtime)
- Auth check movido a `(dashboard)/layout.tsx`
- Redirect a `/login` si no hay sesión
- Redirect a `/` desde login/register si ya hay sesión

### 🐛 Fixed

- Eliminado `middleware.ts` que causaba error en Edge Runtime con Prisma

---

## [0.3.0] - 2026-02-23

### ✨ Added

#### Database Setup
- Schema de Prisma completo con 5 modelos:
  - User (autenticación)
  - Categoria (organización de productos)
  - Producto (catálogo)
  - Venta (registro diario)
  - Configuracion (settings generales)
- Script de seed (`prisma/seed.ts`):
  - Usuario admin de prueba
  - 2 categorías: "Empanadas" y "Bebidas"
  - 6 productos de ejemplo
  - 30 días de ventas simuladas
- Prisma 7 con @prisma/adapter-pg
- Custom output path: `src/app/generated/prisma`

### 🔧 Changed

- Configuración de Prisma sin URL en datasource
- Conexión vía adapter en `src/lib/prisma.ts`

---

## [0.2.0] - 2026-02-22

### ✨ Added

- Dependencias instaladas:
  - `@prisma/client`, `prisma` (7.x)
  - `next-auth@beta` (v5)
  - `bcryptjs`, `@types/bcryptjs`
  - `@tanstack/react-query`
  - `recharts`
  - `react-hook-form`, `zod`, `@hookform/resolvers`
  - `date-fns`
  - `sonner`
  - `lucide-react`
- shadcn/ui configurado

---

## [0.1.0] - 2026-02-21

### ✨ Added

- Proyecto Next.js 14+ creado
- TypeScript configurado
- TailwindCSS instalado
- Estructura de carpetas inicial
- ESLint configurado

---

## Convenciones

### Tipos de Cambios
- **Added** (✨): Nuevas funcionalidades
- **Changed** (🔧): Cambios en funcionalidades existentes
- **Deprecated** (⚠️): Funcionalidades que se eliminarán pronto
- **Removed** (🗑️): Funcionalidades eliminadas
- **Fixed** (🐛): Corrección de bugs
- **Security** (🔒): Correcciones de seguridad
- **Documentation** (📝): Cambios en documentación

---

*Este changelog se mantiene manualmente y refleja los cambios principales del proyecto.*
