# Prompt 05b · Casos de uso de simulaciones (UC4–UC6)

**Para:** Codex

**Fecha:** 2026-11-22

**Objetivo:** los tres casos de uso de simulaciones y su puerto de repositorio, sin infraestructura.

&nbsp;

**Por qué está escrito así**

Solo capa de aplicación. El repositorio SQLite (05c) y las rutas (05d) van aparte, para que cada revisión sea pequeña.

Sin tests propios: los prueban los de integración (05f), igual que los de clientes (estrategia de tests de `00-analisis.md`).

El orden de validación va escrito aquí, y no solo en la spec, por la corrección #2: el 400 tiene que ganar al 404.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/01-casos-de-uso.md (UC4, UC5, UC6 y
reglas comunes) y ai-workspace/02-architecture/00-estructura.md.
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. api/src/application/ports/SimulationRepository.ts:
   - SimulationToCreate: customerId, users, storageGb, apiCalls y los
     campos de CostBreakdown (sin id ni fecha).
   - interface SimulationRepository {
       create(simulation: SimulationToCreate): Simulation;
       findByCustomerId(customerId: number): Simulation[];
     }

2. En api/src/application/use-cases/simulations/:
   - previewSimulation.ts: clase PreviewSimulation(customers).
     execute({ customerId, users }): CostBreakdown.
   - createSimulation.ts: clase CreateSimulation(customers, simulations).
     execute({ customerId, users, storageGb?, apiCalls? }): Simulation.
   - listCustomerSimulations.ts: clase ListCustomerSimulations(customers,
     simulations). execute(customerId): Simulation[].

3. Orden obligatorio en PreviewSimulation y CreateSimulation:
   validateUsers(users) (y validateUsage en CreateSimulation)
   → customers.findById(customerId)
   → si es null: ApplicationError CUSTOMER_NOT_FOUND
   → calculateMonthlyCost(customer.country, users)
   → (solo CreateSimulation) simulations.create con el uso y el desglose.
   No busques al cliente antes de validar.
   ListCustomerSimulations: si el cliente no existe, CUSTOMER_NOT_FOUND;
   si existe, simulations.findByCustomerId.

4. Los tres reciben los repositorios por el constructor, como los de
   clientes, y no importan nada de infrastructure.

Ejecuta tests, typecheck y lint. Todo tiene que seguir en verde.
Commit: feat(application): casos de uso de simulaciones

Si algo es ambiguo, para y pregunta. No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

Preview y crear usan la misma función, `calculateMonthlyCost`.

`validateUsers` va antes que `findById` en los dos.

Ningún importe sale de la entrada: todos se calculan.

`application/` no importa nada de `infrastructure/`.

&nbsp;

**Resultado de la revisión**

Hecho en `60ada91`. `validateUsers` y `validateUsage` van antes que `findById`, y preview y crear usan `calculateMonthlyCost`. `application/` no importa nada de `infrastructure/`.
