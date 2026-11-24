# Prompt 08a · Paginación, duplicados y correo: lógica pura con TDD

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** las tres funciones puras que necesitan los cambios del historial, probadas antes de tocar la interfaz.

&nbsp;

**Por qué está escrito así**

Son las tres reglas de los cambios que pueden fallar sin que se vea: una página fuera de rango, una simulación casi igual que se toma por duplicada, o un correo con las tildes o el "€" mal codificados.

Van en `lib/`, como el resto de la lógica pura del front, y con el test primero. La interfaz que las usa va en el 08b.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (secciones 6, 6 bis, 9 y 11),
ai-workspace/04-design/00-diseno.md (secciones 3 y 6) y los ADR-007 y 008.
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni de api/, ni nada fuera de lo que pide esta tarea.
Haz solo este prompt y para.

1. Tests primero, en web/src/lib/:
   - pagination.test.ts: paginate(items, page, pageSize):
     · 12 elementos, página 1 de 5 → los 5 primeros, page 1, pageCount 3.
     · Página 3 → los 2 últimos.
     · Página 9 → se ajusta a la 3. Página 0 → se ajusta a la 1.
     · Lista vacía → items [], page 1, pageCount 1.
   - duplicates.test.ts: isSimulationSaved(simulations, values):
     · Con { users: 15, storageGb: 100, apiCalls: 50000 } en la lista → true.
     · Si cambia users, storageGb o apiCalls (uno cada vez) → false.
     · Lista vacía → false.
   - simulationEmail.test.ts: buildSimulationMailto(customer, simulation,
     conversion) con Acme Ibérica S.L., compras@acme.es, 15 usuarios, 100 GB,
     50 000 llamadas, base 14000, IVA 2100 pb, 2940 y total 16940 céntimos:
     · Empieza por "mailto:compras@acme.es?subject=".
     · Al decodificar el asunto: "Simulación de SaaS-O-Matic para Acme Ibérica S.L.".
     · Al decodificar el cuerpo: las líneas de 02-interfaz.md, sección 6 bis,
       separadas por "\r\n", con "Total mensual: 169,40\u00a0€".
     · conversion null → sin la línea "Equivale a".
     · conversion { currency: "USD", rate: 1.09, ratesDate: "22 de noviembre
       de 2026" } → con "Equivale a ≈ 184,65\u00a0US$ al tipo de cambio del
       22 de noviembre de 2026.".
   Ejecuta y comprueba que fallan.
   Commit: test(web): paginación, duplicados y correo de una simulación

2. Implementa en web/src/lib/ pagination.ts, duplicates.ts y
   simulationEmail.ts. El correo usa formatMoney, formatVatRate y
   encodeURIComponent para el asunto y el cuerpo.
   Commit: feat(web): paginación, duplicados y correo de una simulación

Los valores esperados están calculados. Si un test falla, no cambies el
valor esperado ni el código para forzarlo: para y avísame con el caso.
```

---

&nbsp;

**Qué revisaremos al terminar**

Los dos commits, test antes que implementación.

El cuerpo del correo se decodifica con tildes, "€" y saltos de línea correctos.

`isSimulationSaved` no se confunde si solo cambia uno de los tres valores.
