# Seguridad

## Reporte de vulnerabilidades

Si encontrás una vulnerabilidad de seguridad, **no abras un issue público**.

1. Contactá a los mantenedores del repositorio por un canal privado (por ejemplo, Security Advisories de GitHub si están habilitados, o el medio acordado por el equipo).
2. Incluí una descripción clara, pasos para reproducir e impacto estimado.
3. Esperá confirmación antes de divulgar detalles públicamente.

## Prácticas del proyecto

- **Nunca** commitees secretos: API keys, tokens, contraseñas, claves privadas, service role keys, credenciales de base de datos ni archivos `.env` reales.
- Usá `.env.example` como plantilla; las variables reales van en `.env.local` (ignorado por Git).
- En el navegador solo deben usarse claves públicas/publishable diseñadas para cliente (por ejemplo, la publishable key de Supabase). Las claves con privilegios elevados se usan únicamente en entorno servidor seguro.
- Revisá los cambios antes de commitear (`git diff --staged`) y evitá subir archivos generados o sensibles.
- Mantené dependencias actualizadas y atendé alertas de seguridad del repositorio.
