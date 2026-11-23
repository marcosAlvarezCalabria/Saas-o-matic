# Prompt 05a · Dominio de simulaciones: tope de usuarios y uso informativo

**Para:** Codex

**Fecha:** 2026-11-22

**Objetivo:** que el dominio rechace más de 100 000 usuarios y valide el almacenamiento y las llamadas, con TDD.

&nbsp;

**Por qué está escrito así**

Es la base de las simulaciones: los casos de uso (05b) llaman a estas funciones antes de buscar al cliente.

El tope de usuarios va en `tiers.ts`, junto a la regla de "mínimo 1", y no en la simulación: es una regla del cálculo de precio. Por encima de 2^53 − 1 el importe deja de ser un entero exacto (bitácora #8).

El test va antes que el código (TDD en el dominio).

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/features/pricing.feature y
features/simulations.feature (escenarios @dominio) y
ai-workspace/02-architecture/00-estructura.md. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. Tests primero, en api/test/domain:
   - pricing/tiers.test.ts: añade 100000 usuarios → 50017000 céntimos
     (500 170 €) a los válidos y 100001 a los no válidos.
   - simulation/simulation.test.ts (nuevo): los dos esquemas @dominio de
     la regla "Almacenamiento y llamadas son informativos".
   Ejecútalos y comprueba que fallan.
   Commit: test(domain): tope de usuarios y uso de la simulación

2. Implementa:
   - pricing/tiers.ts: exporta validateUsers(users: number): void. Lanza
     DomainError VALIDATION_ERROR "usuarios no válidos" si users no es
     entero o está fuera de 1..MAX_USERS (const MAX_USERS = 100_000).
     calculateBaseCost llama a validateUsers en lugar de su comprobación
     actual.
   - domain/simulation.ts (nuevo):
     · interface Simulation extends CostBreakdown, con id, customerId,
       users, storageGb, apiCalls y createdAt (string ISO).
     · validateUsage(input: { storageGb?: number; apiCalls?: number }):
       { storageGb: number; apiCalls: number }. undefined → 0. Si un valor
       no es Number.isSafeInteger o es < 0, DomainError VALIDATION_ERROR.
   Sin dependencias externas.
   Commit: feat(domain): tope de usuarios y uso de la simulación

Los valores del .feature están calculados. Si un test falla, no cambies el
valor esperado ni fuerces el código: para y avísame con el caso que falla.
No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el de implementación.

`calculateBaseCost` ya no tiene su propia comprobación: usa `validateUsers`.

`9007199254740992` (2^53) se rechaza: `Number.isInteger` lo aceptaría, `Number.isSafeInteger` no.

`domain/` sigue sin importar nada de fuera.

&nbsp;

**Resultado de la revisión**

Hecho en `e57fca2` (test) y `6035617` (feat), en ese orden. Con el dominio antiguo, el test falla en 100 001 usuarios y en `simulation.test.ts`: el TDD es real.

76 tests de dominio en verde, typecheck y lint sin errores. `validateUsers` usa `Number.isSafeInteger`, así que 2^53 también se rechaza en `users`.
