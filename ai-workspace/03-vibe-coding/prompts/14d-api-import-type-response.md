# Prompt 14d · api: `import type` del `Response` de Express

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que el tipo `Response` se importe arriba, como el resto.

&nbsp;

**Por qué está escrito así**

En `routes/simulations.ts`, `executeSimulationAction` escribe el tipo como `import('express').Response` en mitad de la firma. Funciona, pero el resto del código importa los tipos arriba. Lo vi en la revisión del 09b.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.

1. En api/src/infrastructure/http/routes/simulations.ts, añade
   import type { Response } from 'express'; arriba y usa Response en la
   firma.
Comprueba: tests, typecheck y lint de api en verde.
Commit: refactor(api): import type de Response
```

---

&nbsp;

**Qué revisaremos al terminar**

No queda ningún `import(` en mitad de un tipo.
