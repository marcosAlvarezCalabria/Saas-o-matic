# Prompt 04c · Duplicado detectado por la BD devuelve 409

**Para:** Codex

**Fecha:** 2026-11-20

**Objetivo:** que dos altas simultáneas con el mismo NIF den 409 y no 500.

&nbsp;

**Por qué está escrito así**

Es uno de los cuatro arreglos de la revisión del prompt 04 (bitácora #6). Va en un prompt propio porque es una sola tarea (bitácora #7).

El test va primero, para demostrar el fallo antes de arreglarlo.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/01-specs/features/customers.feature (escenario "Duplicado que llega a la base de datos") y 02-architecture/01-modelo-datos.md. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. Test en api/test/integration: guarda un cliente con el repositorio y
   vuelve a guardar otro con el mismo NIF directamente con repository.create.
   Debe lanzar ApplicationError TAX_ID_ALREADY_EXISTS. Comprueba que falla.
   Commit: test(api): duplicado detectado por la BD
2. SqliteCustomerRepository.create captura el error de SQLite con código
   SQLITE_CONSTRAINT_UNIQUE y lanza ApplicationError TAX_ID_ALREADY_EXISTS.
   Cualquier otro error se relanza tal cual.
   Commit: fix(api): duplicado detectado por la BD devuelve 409

Si un test falla de forma inesperada, para y avísame. No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el del arreglo.

Solo se traduce el error de `UNIQUE`; el resto se relanza.
