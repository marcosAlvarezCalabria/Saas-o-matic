# Prompt 04b · El esquema se incluye en el build

**Para:** Codex

**Fecha:** 2026-11-20

**Objetivo:** que la api compilada (`node dist/main.js`) arranque.

&nbsp;

**Por qué está escrito así**

Es uno de los cuatro arreglos de la revisión del prompt 04 (bitácora #6). Va en un prompt propio porque es una sola tarea (bitácora #7).

Es el más urgente: sin él, Docker no funcionará.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/02-architecture/01-modelo-datos.md y adr/005. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. Sustituye api/src/infrastructure/db/schema.sql por schema.ts, que exporte
   el mismo SQL como constante de texto. connection.ts lo importa en lugar
   de leer el archivo.
2. Comprueba que funciona compilado: pnpm --filter @saas-o-matic/api build,
   arranca dist/main.js con DATABASE_PATH=":memory:" y llama a /health.
   Pásame la salida.
3. Ejecuta todos los tests.
Commit: fix(api): el esquema se incluye en el build

Si un test falla de forma inesperada, para y avísame. No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

`schema.sql` ya no existe y el SQL de `schema.ts` es idéntico al del modelo de datos.

`dist/main.js` arranca y `/health` responde.
