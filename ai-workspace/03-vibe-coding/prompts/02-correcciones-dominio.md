# Prompt 02 · Correcciones del dominio y del monorepo

**Para:** Codex

**Fecha:** 2026-11-19

**Objetivo:** corregir lo que salió de la revisión del prompt 01 antes de empezar con el NIF.

&nbsp;

**Por qué está escrito así**

Viene de la corrección #2 de la bitácora.

Los errores se arreglan antes del NIF para que la validación fiscal no copie el patrón equivocado.

Cada corrección va numerada y con su commit, como en el prompt 01.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs y ai-workspace/02-architecture
(sobre todo 00-estructura.md). Haz los pasos en orden, un commit cada uno.

1. Errores de dominio con código
   - Crea api/src/domain/errors.ts con una clase DomainError que tenga
     code y message. Códigos: VALIDATION_ERROR, COUNTRY_NOT_SUPPORTED.
   - tiers.ts: usuarios no válidos → DomainError VALIDATION_ERROR.
   - vat.ts: país sin IVA → DomainError COUNTRY_NOT_SUPPORTED.
   - Actualiza los tests para comprobar el código, no el texto del mensaje.
   Commit: refactor(domain): errores de dominio con código

2. package.json en la raíz
   - Scripts dev, test, lint, typecheck y build que lancen los de los
     workspaces con pnpm -r.
   Commit: chore: scripts en la raíz del monorepo

3. Quita --passWithNoTests del script test de api.
   Commit: chore(api): el test falla si no hay tests

4. Añade ai-workspace/03-vibe-coding/prompts/ al repositorio.
   Commit: docs(vibe-coding): prompts de Codex

No toques nada más. Si algo no está en la spec, para y pregunta.
```

---

&nbsp;

**Resultado de la revisión**

Correcto. Commits `698a597`, `6e72de3`, `1e36287` y `9d3540a`, uno por paso y en orden.

Los tests comprueban la clase `DomainError` y el código, no el texto del mensaje.
