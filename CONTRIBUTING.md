# Contribuir a CuotaClub

¡Gracias por tu interés en contribuir! Este documento guía el proceso.

## Flujo de trabajo

1. **Fork** el repositorio
2. **Crea una rama** descriptiva: `feat/nueva-funcionalidad`, `fix/correccion-bug`, `chore/actualizacion-deps`
3. **Desarrolla** siguiendo las convenciones del proyecto
4. **Commits atómicos** con mensajes claros (Convencional Commits)
5. **Push** a tu fork y abre un **Pull Request** contra `main`

## Estándares de código

- **TypeScript strict** activado — sin `any` innecesarios
- **ESLint + Prettier** — `pnpm lint` y `pnpm format` pasan
- **Commits convencionales**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`
- **PRs pequeños y enfocados** — una cosa por PR

## Configuración local

```bash
pnpm install
cp .env.example .env.local   # completa con tus claves de Supabase
pnpm dev                     # http://localhost:3000
```

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (Turbopack) |
| `pnpm build` | Build de producción |
| `pnpm start` | Sirve build de producción |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier --write |
| `pnpm typecheck` | tsc --noEmit |

## Reglas de ramas

- `main` — protegida, solo via PR aprobado
- `feat/*` — nuevas funcionalidades
- `fix/*` — correcciones de bugs
- `chore/*` — mantenimiento, deps, tooling
- `docs/*` — documentación

## Pull Requests

- Título claro y descripción del cambio
- Referencia a issue si aplica (`Closes #123`)
- CI verde (lint, typecheck, build)
- Al menos 1 review aprobado
- Squash merge al finalizar

## Reportar issues

- Usa las plantillas de GitHub Issues
- Incluye pasos para reproducir, comportamiento esperado vs actual, logs/capturas
- Etiqueta: `bug`, `enhancement`, `question`, `security`

## Seguridad

Ver [SECURITY.md](SECURITY.md) para reportar vulnerabilidades de forma responsable.

---

¿Dudas? Abre un issue con la etiqueta `question` o comenta en el PR.