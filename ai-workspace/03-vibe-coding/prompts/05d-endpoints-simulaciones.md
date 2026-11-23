# Prompt 05d · Endpoints de simulaciones

**Para:** Codex

**Fecha:** 2026-11-22

**Objetivo:** exponer UC4–UC6 por HTTP y conectarlos en `main.ts`.

&nbsp;

**Por qué está escrito así**

La capa HTTP solo comprueba la forma: que el campo esté y sea un número. Los valores (de 1 a 100 000 usuarios, uso ≥ 0) son del dominio. Así cada regla vive en un único sitio.

`customerId` es un identificador, no un valor de negocio: lo comprueba la capa HTTP, igual que el id de la ruta.

Las tres rutas de simulaciones van en un único router, incluida la del historial, que cuelga de `/customers`: todo lo de un tema, junto.

Cambiar `createApp` obliga a tocar el contexto de los tests de clientes. Se hace aquí, solo en los imports, para que todo siga compilando en el mismo commit.

El paso 5 arranca lo compilado por la corrección #6: tests en verde no quiere decir que `dist/` funcione.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/01-casos-de-uso.md (UC4–UC6, reglas
comunes y tabla de errores), ai-workspace/02-architecture/00-estructura.md
y openapi.yaml. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. api/src/infrastructure/http/simulationInput.ts:
   - parsePreviewInput(body) y parseCreateSimulationInput(body): el input
     del caso de uso, o null.
   - null si: el cuerpo no es un objeto (un array tampoco vale);
     customerId no es Number.isSafeInteger ≥ 1; users no es de tipo number;
     storageGb o apiCalls están presentes pero no son de tipo number
     (null incluido).
   - Copia solo los campos conocidos: el resto (importes incluidos) se
     ignora.
   - Reutiliza isRecord de inputValidation.ts exportándolo; no lo dupliques.
   - No compruebes aquí los valores de users, storageGb ni apiCalls: son
     del dominio.

2. api/src/infrastructure/http/routes/simulations.ts:
   createSimulationRouter(useCases), con las rutas completas:
   - POST /simulations          → 201 con la simulación
   - POST /simulations/preview  → 200 con el desglose
   - GET  /customers/:id/simulations → 200 con la lista; id con
     parseCustomerId
   Entrada null → 400 con validationErrorBody. Las rutas no tienen lógica.

3. app.ts: createApp recibe también los tres casos de uso de simulaciones
   (CustomerUseCases & SimulationUseCases) y monta el router de
   simulaciones antes de notFoundHandler. main.ts crea
   SqliteSimulationRepository y los tres casos de uso.

4. test/integration: customerTestContext.ts pasa a testContext.ts con
   createTestContext(), que crea también lo de simulaciones. En los tests
   de clientes cambia solo los imports.

5. Ejecuta tests, typecheck y lint. Después compila (pnpm --filter api
   build), arranca node api/dist/main.js con DATABASE_PATH=:memory: y
   comprueba que GET /health responde 200.

Commit: feat(api): endpoints de simulaciones

Si algo es ambiguo, para y pregunta. No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

`users: "15"` y `storageGb: null` dan 400 en la capa HTTP.

`users: 0` llega al dominio y da 400 desde allí.

Un `totalCents` enviado no llega al caso de uso.

El logger registra `/customers/1/simulations` completo.

Probaré a mano el build compilado y los casos límite: `customerId: 1e20`, cuerpo `[]` y 9999 con `users: 0`.

&nbsp;

**Resultado de la revisión**

Hecho en `90978d6`. La api compilada arranca. Probado a mano contra `dist/main.js`: `customerId: 1e20`, cuerpo `[]`, 9999 con `users: 0` (400 antes que 404), `users: 1e20`, `storageGb: 2^53`, `totalCents` enviado (se ignora), id `01` en el historial y JSON mal formado. Todo da lo que dice la spec, y el logger registra `/customers/1/simulations` completo.

Detalle menor: los tests de clientes importan `createTestContext as createCustomerTestContext` para no tocar más que los imports, como pedía el prompt.
