# Prompt 03 · TDD de la validación fiscal

**Para:** Codex

**Fecha:** 2026-11-19

**Objetivo:** validar DNI, NIE y CIF con el algoritmo oficial, y el formato básico para otros países, con TDD.

&nbsp;

**Por qué está escrito así**

Las reglas obligatorias de la arquitectura (archivos, `DomainError`) van en el prompt y no solo en la spec, por la corrección #2.

Se prohíbe tocar `src` para que los tests pasen, porque es lo que destapó el error de la spec en la corrección #4.

El escenario del duplicado (409) se deja fuera: es de integración y va con el endpoint.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/features/tax-id.feature y
ai-workspace/02-architecture/00-estructura.md. Pasos en orden, un commit cada uno.

1. Tests primero, en api/test/domain/tax-id/
   - Un test por cada fila de cada escenario de tax-id.feature, con los
     mismos valores: normalización, DNI, NIE y CIF válidos e inválidos,
     España con identificador extranjero y otros países.
   - NO incluyas el escenario del duplicado (409): es de integración.
   - Los rechazos se comprueban con DomainError y el código INVALID_TAX_ID,
     no con el texto del mensaje.
   - Ejecútalos y comprueba que fallan.
   Commit: test(domain): escenarios de validación fiscal

2. Implementación en api/src/domain/tax-id/, un archivo por responsabilidad:
   - normalizeTaxId.ts: mayúsculas, sin espacios ni guiones.
   - spanishTaxId.ts: DNI, NIE y CIF con el algoritmo descrito en el .feature,
     incluida la regla del tipo de control del CIF según la letra.
   - genericTaxId.ts: solo letras y dígitos, de 4 a 20 caracteres.
   - validateTaxId.ts: elige el validador según el país (ES → español,
     resto → genérico). Añadir un país = añadir un validador.
   - Añade INVALID_TAX_ID a DomainErrorCode en api/src/domain/errors.ts.
   Commit: feat(domain): validación de DNI, NIE y CIF

Todos los valores del .feature están calculados con el algoritmo.
Si un test falla, no cambies el valor esperado ni fuerces el código:
para y avísame con el caso que falla.
No toques nada fuera de api/src/domain y api/test/domain.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el de implementación.

Hay un test por cada fila del `.feature` (salvo el duplicado).

El CIF respeta la regla del tipo de control: A, B, E y H solo con dígito; N, P, Q, R, S y W solo con letra.

Los rechazos son `DomainError` con `INVALID_TAX_ID`.

&nbsp;

**Resultado de la revisión**

Correcto. Commits `ced2ff4` (tests) y `884e99b` (implementación), en ese orden.

Un test por cada fila del `.feature`, sin el duplicado. Los rechazos son `DomainError` con `INVALID_TAX_ID`.

El CIF respeta la regla del tipo de control. Las posiciones impares se doblan y se suman sus cifras, como dice el algoritmo.

`validateTaxId` devuelve el identificador ya normalizado, listo para guardar.

49 tests de dominio en verde (tramos, IVA y NIF).
