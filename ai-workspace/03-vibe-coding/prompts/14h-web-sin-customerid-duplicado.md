# Prompt 14h · web: `SimulationHistory` sin la prop `customerId`

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que `SimulationHistory` no reciba dos veces el mismo dato.

&nbsp;

**Por qué está escrito así**

Recibe `customer` y además `customerId`, que es `customer.id`. Dos props para lo mismo pueden acabar diciendo cosas distintas. Lo vi en la revisión del 09c.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.

1. En web/src/components/SimulationHistory.tsx, quita la prop
   customerId y usa customer.id.
2. En CustomerDetailPage.tsx, deja de pasarla.
Comprueba: lint, typecheck, test y build de web en verde.
Commit: refactor(web): SimulationHistory usa customer.id
```

---

&nbsp;

**Qué revisaremos al terminar**

`customerId` ya no aparece en las props de `SimulationHistory`.
