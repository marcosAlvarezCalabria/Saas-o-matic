# 02 Arquitectura

| Archivo | Qué contiene |
|---|---|
| `00-estructura.md` | Carpetas, reglas de dependencia entre capas y límites de tamaño |
| `01-modelo-datos.md` | Tablas, DDL y por qué de cada decisión |
| `openapi.yaml` | Contrato de la API (6 endpoints + health) |
| `adr/` | Decisiones de arquitectura con alternativas descartadas |

Las reglas de negocio están en `../01-specs`. Si algo aquí contradice a las specs, mandan las specs.

## Registro de cambios

- v0.1: estructura, modelo de datos, OpenAPI y ADR 001–005.
- v0.2: ADR-006 (búsqueda por GET); OpenAPI reordenado: health, clientes y simulaciones (crear antes que preview).
