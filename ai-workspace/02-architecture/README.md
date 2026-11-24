# 02 Arquitectura

| Archivo | Qué contiene |
|---|---|
| `00-estructura.md` | Carpetas, reglas de dependencia entre capas y límites de tamaño |
| `01-modelo-datos.md` | Tablas, DDL y por qué de cada decisión |
| `openapi.yaml` | Contrato de la API (8 endpoints + health) |
| `02-despliegue.md` | Docker, Caddy, Netlify, CI y CD, variables y pasos a mano en el VPS |
| `adr/` | Decisiones de arquitectura con alternativas descartadas |

Las reglas de negocio están en `../01-specs`. Si algo aquí contradice a las specs, mandan las specs.

## Registro de cambios

- v0.1: estructura, modelo de datos, OpenAPI y ADR 001–005.
- v0.2: ADR-006 (búsqueda por GET); OpenAPI reordenado: health, clientes y simulaciones (crear antes que preview).
- v0.3: `application/errors.ts`, reparto de errores por capa y regla del logger en `00-estructura.md`.
- v0.4: IVA en puntos básicos (modelo de datos, OpenAPI y actualización del ADR-003); enum `Country` con los 27 de la UE más GB y normalización a mayúsculas.
- v0.5: `schema.ts` en lugar de `schema.sql` (actualización del ADR-005), duplicado por condición de carrera → 409, logger con ruta completa.
- v0.6: casos de uso en `application/use-cases/`, agrupados por tema (`customers/` y `simulations/`); `ports/` y `errors.ts` se quedan en `application/`.
- v0.7: simulaciones: archivos de casos de uso y rutas, tope de 100 000 usuarios (CHECK en la BD), límites de `storageGb` y `apiCalls` en el OpenAPI, fecha puesta por la BD.
- v0.8: estructura de `web` (hooks, contexto de divisa, `lib/` con tests, tokens de tema), CORS en la api y ADR-007.
- v0.9: límite de peticiones en el OpenAPI (`RATE_LIMITED`, 429).
- v0.10: `ai-workspace/04-design/` con la spec de diseño y las capturas de la maqueta.
- v0.11: ADR-008 (Tailwind para los estilos).
- v0.12: `02-despliegue.md` y ADR-009 (Docker Compose con Caddy en el VPS).
