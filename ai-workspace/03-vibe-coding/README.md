# 03 Vibe coding

Cómo fue el desarrollo con IA, no solo el resultado.

| Archivo | Qué contiene |
|---|---|
| `bitacora.md` | Correcciones a la IA: qué pedí, qué hizo, cómo lo detecté y qué cambié |
| `prompts/` | Prompts clave que se pasaron a Codex, en orden |
| `conversaciones/` | Hilos exportados con Claude (planificación y revisión) |

## Reparto de roles

- **Claude:** specs, arquitectura y revisión de lo que hace Codex. No escribe código de la app ni hace commits.
- **Codex:** escribe el código, guiado por `AGENTS.md` y las specs.
- **Yo:** decido, reviso y hago los commits. Ningún cambio de comportamiento entra sin pasar antes por la spec.
