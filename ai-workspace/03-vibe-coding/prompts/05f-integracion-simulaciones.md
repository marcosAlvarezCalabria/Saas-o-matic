# Prompt 05f · Tests de integración de simulaciones

**Para:** Codex

**Fecha:** 2026-11-22

**Objetivo:** cubrir con supertest los escenarios @integracion de `simulations.feature`.

&nbsp;

**Por qué está escrito así**

Los tests de integración van después de implementar, como dice la estrategia de tests de `00-analisis.md`.

Los valores esperados están calculados en el `.feature`. Si uno falla, el fallo puede estar en el código o en la spec (corrección #4): Codex para y avisa, no elige por su cuenta.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/01-specs/features/simulations.feature.
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada de api/src/.

1. Tests en api/test/integration, uno por escenario o fila de ejemplos
   (it.each para los esquemas):
   - simulations-preview.test.ts: regla "Previsualizar".
   - simulations-create.test.ts: reglas "Crear simulación" y "Entrada no
     válida".
   - simulations-history.test.ts: regla "Historial".
   - errors.test.ts: añade "Ruta inexistente" y "JSON mal formado"
     ("Error inesperado" ya está, del prompt 05e).
2. Una BD ":memory:" nueva por test con createTestContext().
3. Clientes de los antecedentes: validCustomer de customerFixtures.ts para
   ES; añade allí un cliente válido de FR.
4. "No se guarda ninguna simulación": cuenta las filas de la tabla
   simulations con context.database.

Ejecuta tests, typecheck y lint.
Commit: test(api): integración de simulaciones

Los valores del .feature están calculados. Si un test falla, no cambies el
valor esperado ni el código: para y avísame con el caso que falla.
No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

Hay un test por cada escenario y cada fila de ejemplos de `simulations.feature`.

Ningún valor esperado se ha cambiado.

El test del historial con 15, 40 y 51 pasa aunque las tres se creen en el mismo milisegundo.
