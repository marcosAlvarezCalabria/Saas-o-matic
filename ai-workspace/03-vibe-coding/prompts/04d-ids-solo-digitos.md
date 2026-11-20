# Prompt 04d · Id de cliente solo con dígitos

**Para:** Codex

**Fecha:** 2026-11-20

**Objetivo:** que la ficha rechace ids como `1.0`, `1e0` o `0x1`.

&nbsp;

**Por qué está escrito así**

Es uno de los cuatro arreglos de la revisión del prompt 04 (bitácora #6). Va en un prompt propio porque es una sola tarea (bitácora #7).

El test va primero, para demostrar el fallo antes de arreglarlo.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/01-specs/features/customers.feature (Regla: Ficha de cliente). La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. Añade al test de la ficha los ids 1.0, 1e0 y 0x1 → 400 VALIDATION_ERROR.
   Comprueba que fallan.
   Commit: test(api): ids de cliente con formato raro
2. parseCustomerId acepta solo /^[1-9]\d*$/.
   Commit: fix(api): id de cliente solo con dígitos

Si un test falla de forma inesperada, para y avísame. No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el del arreglo.

Los tres ids dan 400 y los ids normales siguen funcionando.
