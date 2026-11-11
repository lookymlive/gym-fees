# CuotaClub · Demo de cuotas para clubes y gimnasios

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-SSR-3ECF8E?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm)
![License](https://img.shields.io/badge/License-MIT-blue)

Aplicación de demostración para gestión de cuotas de socios en clubes y gimnasios. Construida con **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, **Supabase** (`@supabase/ssr`) y **pnpm**.

## Características

- **Dashboard** con KPIs: total socios, cuotas al día, por vencer, vencidas, ingresos del mes
- **Listado de socios** con búsqueda, filtros por estado y paginación
- **Detalle de socio** con historial de cuotas y acciones rápidas
- **Formulario de cuotas** con validación (React Hook Form + Zod)
- **Mock data** realista con fechas relativas a hoy (al día / por vencer / vencidas)
- **Estados de UI**: skeletons, spinners, vacío, error — controlables vía "Simulador de estados" en la barra lateral
- **Flujo de cuotas**: por vencer → recordatorio simulado → pago registrado manualmente (sin cobros automáticos)
- **Supabase ready**: cliente SSR (`lib/supabase/client.ts`, `server.ts`) y esquema SQL listo (`supabase/schema.sql`)

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Base de datos | Supabase (PostgreSQL) |
| Auth/Client | `@supabase/ssr` |
| Validación | Zod + React Hook Form |
| Tooling | TypeScript 5, ESLint 9, Prettier, pnpm 10 |

## Requisitos

- **Node.js** 20.9+ (recomendado 22)
- **pnpm** 10+
- Cuenta de **Supabase** (opcional, para persistencia real)

## Instalación y desarrollo

```bash
# Clonar e instalar
git clone https://github.com/lookymlive/gym-fees.git
cd gym-fees
pnpm install

# Variables de entorno (opcional para Supabase)
cp .env.example .env.local
# Edita .env.local con tu URL y publishable key de Supabase

# Desarrollo con Turbopack
pnpm dev        # http://localhost:3000
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (Turbopack) |
| `pnpm build` | Build de producción |
| `pnpm start` | Sirve build de producción |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier --write |
| `pnpm typecheck` | `tsc --noEmit` |

## Estructura del proyecto

```
gym-fees/
├── app/                    # App Router pages & layouts
│   ├── globals.css         # Estilos globales + Tailwind
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard principal
├── components/             # Componentes React reutilizables
│   ├── Dashboard.tsx       # Vista principal con KPIs y listado
│   ├── MemberList.tsx      # Tabla de socios con filtros
│   ├── MemberDetail.tsx    # Modal detalle de socio
│   ├── FeeForm.tsx         # Formulario crear/editar cuota
│   ├── Sidebar.tsx         # Navegación + simulador de estados
│   ├── StatusBadge.tsx     # Badge de estado de cuota
│   ├── States.tsx          # Skeletons, empty, error states
│   └── ReminderModal.tsx   # Modal recordatorio simulado
├── data/
│   └── mockData.ts         # Datos de prueba realistas
├── lib/
│   ├── api.ts              # Capa de datos (mock → Supabase)
│   ├── supabase/
│   │   ├── client.ts       # Cliente Supabase (browser)
│   │   └── server.ts       # Cliente Supabase (server)
│   └── utils.ts            # Utilidades compartidas
├── supabase/
│   └── schema.sql          # Esquema SQL para Supabase
├── types/
│   └── index.ts            # Tipos TypeScript compartidos
└── public/                 # Assets estáticos
```

## Configurar Supabase (opcional)

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta `supabase/schema.sql` en el **SQL Editor**
3. Copia `.env.example` a `.env.local` y completa:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxx
   ```
4. Reemplaza las funciones de `lib/api.ts` por consultas reales usando `lib/supabase/client.ts` (client) o `lib/supabase/server.ts` (server)

> **Nota de seguridad**: Solo la *publishable key* (anon) va en el cliente. La *service role key* **nunca** se expone al navegador — úsala solo en servidor seguro (API routes, Server Actions, Edge Functions).

## Despliegue

### Vercel (recomendado)

```bash
# Conecta tu repo en Vercel y añade las env vars:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

### Docker / Standalone

```bash
pnpm build
pnpm start
```

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guías de estilo, flujo de ramas, commits convencionales y proceso de PR.

## Seguridad

Ver [SECURITY.md](SECURITY.md) para reportar vulnerabilidades de forma responsable.

## Licencia

[MIT](LICENSE) — © 2026 CuotaClub Contributors