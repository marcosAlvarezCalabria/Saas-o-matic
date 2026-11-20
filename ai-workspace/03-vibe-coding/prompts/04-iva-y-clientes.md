# Prompt 04 · IVA en puntos básicos y clientes de punta a punta

**Para:** Codex

**Fecha:** 2026-11-20

**Objetivo:** ampliar el IVA a la UE más GB y dejar funcionando el alta, la búsqueda y la ficha de clientes, desde la ruta HTTP hasta SQLite.

&nbsp;

**Por qué está escrito así**

El paso 1 va primero porque cambia el dominio que ya existe: el resto se construye encima.

Cada paso tiene su commit. Los tests de dominio van antes que el código (TDD). Los de integración, después de implementar, como dice la estrategia de tests de `00-analisis.md`.

Las reglas obligatorias (nombres de archivo, clases de error, orden de validación) van escritas aquí y no solo en la arquitectura, por la corrección #2.

Las simulaciones se dejan para el prompt 05, para que cada revisión sea manejable.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs (incluidos features/pricing.feature y
features/customers.feature) y ai-workspace/02-architecture (00-estructura.md,
01-modelo-datos.md, openapi.yaml y adr/003). Pasos en orden, un commit cada uno.

1. IVA en puntos básicos y tabla UE + GB
   a) Tests primero: actualiza api/test/domain/pricing según pricing.feature.
      El tipo pasa a vatRateBasisPoints (ES = 2100) y añade el escenario de
      Finlandia con 51 usuarios (base 42500, 2550 pb, IVA 10838, total 53338).
      Ejecútalos y comprueba que fallan.
      Commit: test(domain): IVA en puntos básicos
   b) Implementa: tabla de vat.ts con los 28 países de 00-analisis.md (Grecia
      es GR), en puntos básicos. Importe = Math.round(base * pb / 10_000).
      CostBreakdown.vatRate pasa a vatRateBasisPoints.
      Commit: feat(domain): IVA de la UE y GB en puntos básicos

2. Dominio del cliente (TDD con los escenarios @dominio de customers.feature)
   a) Tests en api/test/domain/customer: campos no válidos (VALIDATION_ERROR),
      país normalizado ("es", "Es", " ES " → "ES"), nombre de 101 caracteres
      y nombre de búsqueda (minúsculas, sin tildes, ñ → n, recortado).
      Commit: test(domain): reglas de campos del cliente
   b) api/src/domain/customer.ts: tipo Customer, validación de campos
      (nombre recortado 2-100, email básico, plan basic|pro|enterprise,
      país recortado y en mayúsculas de dos letras) y función del nombre
      de búsqueda. Sin dependencias externas.
      Commit: feat(domain): reglas de campos del cliente

3. Aplicación: casos de uso UC1, UC2 y UC3
   - api/src/application/errors.ts: ApplicationError con code
     CUSTOMER_NOT_FOUND | TAX_ID_ALREADY_EXISTS.
   - api/src/application/ports/CustomerRepository.ts (interfaz).
   - createCustomer.ts, searchCustomers.ts y getCustomer.ts.
   - Orden de UC1: campos → país en la tabla de IVA → validateTaxId
     (devuelve el NIF normalizado) → duplicado → guardar.
   - Los casos de uso no importan nada de infrastructure.
   Commit: feat(application): casos de uso de clientes

4. Infraestructura
   - db/schema.sql con el DDL completo de 01-modelo-datos.md.
   - db/connection.ts: abre la BD en DATABASE_PATH (":memory:" en tests),
     activa PRAGMA foreign_keys = ON en cada conexión y aplica el esquema.
   - db/SqliteCustomerRepository.ts: sentencias preparadas; snake_case en
     la BD y camelCase fuera; búsqueda con LIKE escapando % y _ (ESCAPE);
     orden created_at DESC, id DESC.
   - http/errorHandler.ts: traduce según la tabla de errores de
     01-casos-de-uso.md. 500 sin traza en la respuesta.
   - http/routes/customers.ts: solo forma de la entrada → caso de uso → respuesta.
     Id no entero positivo → 400 VALIDATION_ERROR.
   - JSON mal formado → 400 VALIDATION_ERROR. Ruta inexistente → 404 NOT_FOUND.
   - Logger de peticiones: método, ruta sin query string y estado (ADR-006).
   - app.ts recibe los casos de uso como parámetros. main.ts lo conecta todo.
   Commit: feat(api): endpoints de clientes con SQLite

5. Tests de integración (escenarios @integracion de customers.feature)
   - api/test/integration con supertest y una BD ":memory:" nueva por test.
   - Un test por escenario o fila de ejemplos.
   Commit: test(api): integración de clientes

Dependencias nuevas permitidas: supertest y @types/supertest (dev).
Ninguna más sin preguntar.

Los valores del .feature están calculados. Si un test falla, no cambies el
valor esperado ni fuerces el código: para y avísame con el caso que falla.
No implementes nada de simulaciones: va en el prompt 05.
```

---

&nbsp;

**Qué revisaremos al terminar**

En el paso 1 y en el 2, el commit de test va antes que el de implementación.

La tabla de IVA coincide con `00-analisis.md`, Grecia es `GR` y Finlandia redondea a 10 838.

`application` no importa nada de `infrastructure`, y las rutas no tienen lógica.

El buscador escapa `%` y `_`, y desempata por id.

`PRAGMA foreign_keys` se activa en la conexión.

Ningún `500` devuelve la traza del error.

&nbsp;

**Resultado de la revisión**

Los cinco pasos están hechos, en orden y con su commit (`a8b8b4f` a `1215c85`). Test antes que implementación en los pasos 1 y 2.

81 tests en verde, typecheck y lint sin errores. La tabla de IVA coincide con la spec. Las capas se respetan y el buscador escapa `%` y `_`.

No se hizo antes el commit de la spec (bitácora #5).

Cuatro fallos que los tests no cubrían (bitácora #6): la api compilada no arranca por `schema.sql`, el duplicado por condición de carrera da 500, el logger escribe la ruta relativa y los ids `1.0`, `1e0` y `0x1` se aceptan. Se corrigen en los prompts 04b a 04e, uno por fallo.

