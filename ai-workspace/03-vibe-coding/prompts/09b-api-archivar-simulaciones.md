# Prompt 09b · Archivar y recuperar simulaciones (api)

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** que una simulación se pueda archivar y recuperar sin borrarla, y que el historial pueda pedir las activas o las archivadas.

&nbsp;

**Por qué está escrito así**

Lo detecté en la prueba manual: no había forma de quitar una simulación del historial. Borrar no encaja, porque una simulación es lo que se le presupuestó al cliente y, sin login, un borrado en la demo pública permitiría vaciar los datos. Por eso se archiva (supuesto de `00-analisis.md`).

La fecha de archivado la pone la BD, igual que `created_at`: una sola fuente de la hora. Archivar dos veces conserva la primera fecha, con `COALESCE`, así que las dos operaciones se pueden repetir sin efectos raros. Eso es lo que necesita el "Deshacer" del front.

El repositorio devuelve `null` si la simulación no existe y el caso de uso lo convierte en `SIMULATION_NOT_FOUND`. Es el mismo reparto que con `CUSTOMER_NOT_FOUND`.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/01-casos-de-uso.md (UC4, UC7, UC8 y
la tabla de errores), features/simulations.feature (regla "Archivar y
recuperar"), 02-architecture/openapi.yaml, 02-architecture/01-modelo-datos.md
y 01-specs/03-datos-demo.md. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni de web/, ni nada fuera de lo que pide
esta tarea. Haz solo este prompt y para.

1. Tests primero:
   - api/test/integration/simulations-archive.test.ts: los escenarios de
     la regla "Archivar y recuperar", más:
     · archivar y recuperar cuentan en el límite de escritura (con los
       límites pequeños de createTestContext, como en rate-limit.test.ts).
   - En los tests de historial y de crear que ya existen: la simulación
     lleva archivedAt null.
   - api/test/infrastructure/seedDemoData.test.ts: el resultado pasa a
     { status: 'seeded', customers: 9, simulations: 19, archived: 1 } y
     Nube Norte tiene 6 activas y 1 archivada (la de 5 usuarios).
   Ejecuta y comprueba que fallan.
   Commit: test(api): archivar y recuperar simulaciones

2. Implementa:
   - schema.ts: columna archived_at TEXT (nula) en simulations, como en
     01-modelo-datos.md.
   - domain/simulation.ts: Simulation con archivedAt: string | null.
   - ApplicationErrorCode con SIMULATION_NOT_FOUND; errorHandler lo
     traduce a 404, como CUSTOMER_NOT_FOUND.
   - SimulationRepository:
     · findByCustomerId(customerId, { archived } = { archived: false }):
       activas (archived_at IS NULL) o archivadas; mismo orden de siempre.
     · archive(id): Simulation | null → SET archived_at =
       COALESCE(archived_at, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')).
     · restore(id): Simulation | null → SET archived_at = NULL.
     null si no existe.
   - Casos de uso en application/use-cases/simulations/:
     archiveSimulation.ts (ArchiveSimulation) y restoreSimulation.ts
     (RestoreSimulation). ListCustomerSimulations.execute(customerId,
     { archived }).
   - Rutas en routes/simulations.ts:
     · POST /simulations/:id/archive y POST /simulations/:id/restore,
       sin cuerpo, 200 con la simulación. El id se valida igual que el de
       cliente (si hace falta, renombra parseCustomerId a un nombre
       general y úsalo en los dos sitios).
     · GET /customers/:id/simulations lee ?archived: ausente o "false" →
       activas, "true" → archivadas, otro valor → 400 VALIDATION_ERROR.
   - app.ts: el limitador de escritura también en las dos rutas nuevas.
   - main.ts y testContext.ts: los dos casos de uso nuevos.
   - Seed: en demoData.ts, la simulación de 5 usuarios de Nube Norte con
     archived: true. seedDemoData recibe archiveSimulation, la archiva
     después de crearla y devuelve archived: 1. seed.ts imprime
     "Datos de demostración cargados: 9 clientes y 19 simulaciones
     (1 archivada).".
   Ejecuta tests, typecheck y lint. Borra tu saas-o-matic.sqlite local y
   comprueba que pnpm --filter api seed funciona y que dist/main.js
   arranca.
   Commit: feat(api): archivar y recuperar simulaciones

Si algo es ambiguo, para y pregunta.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el de implementación.

`archive` usa `COALESCE`, y un test comprueba que la segunda vez conserva la fecha.

`?archived=si` da 400, no la lista de activas.

Las dos rutas nuevas pasan por el limitador de escritura.

`seedDemoData.ts` sigue sin importar nada de `db/`.
