# Prompt 14i · web: `aria-label` en "Recuperar"

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que el lector de pantalla diga qué simulación se recupera, igual que con "Archivar".

&nbsp;

**Por qué está escrito así**

"Archivar" lleva `aria-label` "Archivar la simulación del {fecha}", pero "Recuperar" no: con varias archivadas, el lector de pantalla oye "Recuperar, Recuperar, Recuperar" sin saber cuál es cuál. Lo vi en la revisión del 09c.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.

1. En web/src/components/SimulationHistoryList.tsx, el botón
   "Recuperar" con aria-label "Recuperar la simulación del {fecha}"
   (la misma fecha que usa "Archivar").
Comprueba: lint, typecheck, test y build de web en verde.
Commit: fix(web): aria-label en Recuperar
```

---

&nbsp;

**Qué revisaremos al terminar**

"Recuperar" y "Archivar" se anuncian con su fecha.
