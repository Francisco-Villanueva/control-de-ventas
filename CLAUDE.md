# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistema de control de ventas para rotisería que permite registrar ventas diarias, calcular promedios por día de semana, generar reportes y gestionar productos. Optimizado para uso móvil en el negocio.

## Commands

### Development
```bash
npm run dev                  # Start dev server on localhost:3000
npm run build               # Production build (TypeScript + Next.js)
npm start                   # Run production build
npm run lint                # Run ESLint
```

### Database (Prisma 7 with PostgreSQL adapter)
```bash
npx prisma db push          # Push schema changes to database (no migrations)
npm run db:seed             # Populate DB with sample data (30 days of sales)
npm run db:studio           # Open Prisma Studio GUI
npx prisma generate         # Generate Prisma client (runs automatically on postinstall)
```

**Important**: Prisma 7 uses `@prisma/adapter-pg` and generates client to `src/app/generated/prisma`. The datasource in `schema.prisma` has NO url field - connection is configured in `src/lib/prisma.ts` via the adapter.

### Initial Setup
After cloning, you MUST:
1. Copy `.env.example` to `.env` and `.env.local`
2. Set `DATABASE_URL` (PostgreSQL connection string)
3. Generate secret: `openssl rand -base64 32` → `NEXTAUTH_SECRET`
4. Run `npx prisma db push` then `npm run db:seed`

Test credentials: `admin@rotiseria.com` / `password123`

## Architecture

### Authentication Flow (NextAuth.js v5)
- **NO middleware file** - Routes are protected at the layout level
- `src/app/(dashboard)/layout.tsx` checks session with `await auth()` and redirects to `/login` if not authenticated
- `src/app/(auth)/login/page.tsx` and `register/page.tsx` redirect to `/` if already authenticated
- Session strategy: JWT (no database sessions)
- Custom Credentials provider validates against Prisma User model with bcrypt

### Route Groups Pattern
```
src/app/
├── (auth)/          # Public routes - login, register
│   ├── login/
│   └── register/
├── (dashboard)/     # Protected routes - require authentication
│   ├── layout.tsx   # Auth check happens HERE
│   ├── page.tsx     # Dashboard home
│   ├── ventas/      # Sales registration
│   ├── promedios/   # Averages by day of week
│   ├── reportes/    # Monthly/annual reports
│   └── configuracion/ # Product/category management
└── api/
    ├── auth/[...nextauth]/  # NextAuth handler
    ├── productos/
    ├── categorias/
    ├── ventas/
    └── estadisticas/
```

**Critical**: The root `src/app/page.tsx` was DELETED. The `/` route is handled by `src/app/(dashboard)/page.tsx`.

### Data Layer Pattern

**DO NOT** call Prisma directly from components or pages. Always use this flow:

1. **Database queries**: `src/lib/queries/` - Reusable Prisma queries organized by domain
   - `productos.ts`, `categorias.ts`, `ventas.ts`, `estadisticas.ts`
   - Export typed functions that return Prisma results

2. **API Routes**: `src/app/api/` - Call query functions, handle auth/validation
   - Use `await auth()` for protected endpoints
   - Validate with Zod (v4.x - use `error.issues` not `error.errors`)
   - Return NextResponse with appropriate status codes

3. **React Query hooks**: `src/hooks/` - Client-side data fetching
   - `useProductos`, `useVentas`, `useEstadisticas`
   - Handle mutations with cache invalidation
   - Use `queryClient.invalidateQueries()` after mutations

4. **Components**: Call hooks, render UI
   - Never fetch directly from components
   - Always show loading/error states

### Prisma 7 Specifics

The Prisma client setup is non-standard due to Prisma 7:

```typescript
// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/app/generated/prisma/client" // Custom output path

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
```

**Always import**: `import prisma from "@/lib/prisma"` (default export, not named)

### Key Database Constraints

- `Venta` has unique constraint on `[fecha, productoId]` - use upsert for save/update
- `Categoria.nombre` is unique
- `Producto` soft deletes via `activo` boolean (never hard delete)
- Dates in `Venta.fecha` are stored as `@db.Date` (no time component) - always use `startOfDay()` from date-fns

### Component Organization

- `src/components/ui/` - shadcn/ui primitives (installed via CLI)
- `src/components/layout/` - Navbar, MobileNav (used in dashboard layout)
- `src/components/ventas/` - CalendarioSelector, VentaDiariaForm, VentasList
- `src/components/estadisticas/` - PromediosTable, PromediosChart (Recharts), StatsCards

**Mobile-first**: All components use responsive design (hidden lg:block, grid-cols-1 md:grid-cols-2, etc.)

### State Management

- **Server state**: React Query (@tanstack/react-query)
  - Cache queries for 5 minutes (estadísticas)
  - Invalidate on mutations
- **Form state**: React Hook Form + Zod
- **UI state**: Local useState (no global state library)
- **Notifications**: Sonner (toast library)

### Statistics Calculation

Promedios (averages) are calculated server-side in `src/lib/queries/estadisticas.ts`:
- Group all ventas by day of week (0=Sunday, 6=Saturday)
- Calculate average per product per day
- Frontend displays with day highlighting (current day gets blue background)

## Common Patterns

### Adding a New API Endpoint

1. Create query function in `src/lib/queries/[domain].ts`
2. Create API route in `src/app/api/[domain]/route.ts`
3. Add auth check: `const session = await auth()`
4. Validate request body with Zod
5. Catch `ZodError` and return `error.issues` (not `error.errors`)
6. Create React Query hook in `src/hooks/use[Domain].ts`
7. Use hook in component

### Adding a Protected Page

1. Create in `src/app/(dashboard)/[page]/page.tsx`
2. Export as `"use client"` if using state/hooks
3. Authentication is automatic via parent layout
4. Add navigation link in `src/components/layout/Navbar.tsx` and `MobileNav.tsx`

### Date Handling

Always use date-fns and be timezone-aware:
```typescript
import { startOfDay, format } from "date-fns"

// For Venta queries/mutations
const fechaNormalizada = startOfDay(fecha)

// For API date parameters
const fechaStr = format(fecha, "yyyy-MM-dd")

// For display in Spanish
import { es } from "date-fns/locale"
format(fecha, "EEEE, d 'de' MMMM", { locale: es })
```

## Known Issues / Gotchas

- **Edge Runtime**: Prisma CANNOT run in Edge Runtime. All routes using Prisma must use Node.js runtime (default for API routes and server components).
- **Zod 4.x**: Property is `error.issues` not `error.errors`
- **Next.js 16**: Route params are now async Promises - use `const { id } = await params`
- **Prisma generate output**: Client is in `src/app/generated/prisma/client` not `node_modules`
- **No migrations**: This project uses `prisma db push` not `prisma migrate` (prototyping mode)

## Incomplete Features (as of last update)

- Dashboard principal (widgets with real-time metrics)
- Reportes mensuales/anuales (tab interface with charts)
- Configuración UI (CRUD for productos/categorías)
- Sistema de alertas (notifications for low sales, stock predictions)
- Testing suite

When implementing these, follow the established patterns above.
