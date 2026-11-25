# Prompt 14b · api: mensaje correcto para un `?archived=` no válido

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que `GET /customers/:id/simulations?archived=si` explique qué está mal.

&nbsp;

**Por qué está escrito así**

Hoy devuelve 400 con el código correcto, pero con el mensaje "El id debe ser un entero positivo", que habla de otra cosa. Un mensaje que no dice la verdad hace perder tiempo a quien use la api. Lo vi en la revisión del 09b.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.

1. Test primero, en api/test/integration/simulations-archive.test.ts:
   con ?archived=si, el 400 lleva el mensaje
   "archived debe ser true o false". Comprueba que falla.
   Commit: test(api): mensaje de un archived no válido
2. En routes/simulations.ts, separa las dos comprobaciones: id mal
   formado → el mensaje de siempre; archived no válido → el nuevo.
Comprueba: tests, typecheck y lint de api en verde.
Commit: fix(api): mensaje de un archived no válido
```

---

&nbsp;

**Qué revisaremos al terminar**

El test va antes que el arreglo.
