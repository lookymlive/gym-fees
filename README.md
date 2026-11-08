# CuotaClub · demo de cuotas para clubes y gimnasios

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase (`@supabase/ssr`) · pnpm

## Correr
```bash
pnpm install
pnpm dev        # http://localhost:3000
```
Requiere Node 20.9+ (recomendado 22) y pnpm 10+.

## Qué incluye
- Listado con KPIs, filtros y búsqueda, detalle, formulario con validación.
- Mock data con fechas relativas a hoy (al día / por vencer / vencidas).
- Estados: skeletons, spinners, vacío y error. Cambialos con "Simulador de estados" (barra lateral).
- Flujo: cuota por vencer → recordatorio SIMULADO → pago registrado manualmente. Sin cobros automáticos.

## Pasar a Supabase (opcional)
1. `cp .env.example .env.local` y completá URL y publishable key.
2. Ejecutá `supabase/schema.sql` en el SQL Editor.
3. Reemplazá las funciones de `lib/api.ts` por consultas con `lib/supabase/client.ts` / `server.ts`.
