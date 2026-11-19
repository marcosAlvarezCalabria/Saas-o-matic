# Prompt 01 · Setup de la api y TDD de precios

**Para:** Codex

**Fecha:** 2026-11-19

**Objetivo:** dejar la api lista para trabajar y tener el cálculo de precios (tramos e IVA) hecho con TDD.

&nbsp;

**Por qué está escrito así**

Cada paso va numerado y con su propio commit, por la corrección #1 de la bitácora: en una tarea mezclada, Codex dejó sin hacer la parte pequeña.

El test va en un commit antes que la implementación, para que el TDD se vea en el historial de git.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs y ai-workspace/02-architecture.
Haz los pasos en orden. No pases al siguiente si el anterior no está terminado.

1. Limpieza del repo
   - Completa .gitignore: dist/, .env.* (pero NO .env.example), *.sqlite.
   - Borra ai-workspace/02-architecture/.gitkeep y ai-workspace/03-vibe-coding/.gitkeep.
   Commit: chore: completar gitignore y limpiar gitkeep

2. Setup de la api
   - pnpm-workspace.yaml en la raíz con api y web.
   - api: TypeScript en modo strict, Express, better-sqlite3, Vitest y ESLint.
   - Solo GET /health según openapi.yaml. Nada más de lógica.
   - Scripts: dev, build, test, lint, typecheck.
   Commit: chore(api): setup inicial con health

3. TDD de precios desde features/pricing.feature (tramos e IVA)
   a) Escribe primero los tests en api/test/domain/pricing, uno por escenario
      del .feature. Ejecútalos y comprueba que fallan.
      Commit: test(domain): escenarios de tramos e IVA
   b) Implementa en api/src/domain/pricing hasta que pasen.
      Importes en céntimos, IVA según la tabla de 00-analisis.md.
      Commit: feat(domain): cálculo por tramos e IVA

No implementes la validación del NIF todavía: va en la tarea siguiente.
Si algo no está en la spec, para y pregunta.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el de implementación.

Hay un test por cada escenario del `.feature`, con los mismos valores.

No hay decimales en los importes: todo en céntimos.

El dominio no importa nada de Express ni de SQLite.
