# Prompt 14a · api: un status por código de error

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que cada código de `ApplicationError` tenga su status HTTP decidido a propósito.

&nbsp;

**Por qué está escrito así**

Hoy `errorHandler.ts` hace `code === 'TAX_ID_ALREADY_EXISTS' ? 409 : 404`. Funciona, pero cualquier código nuevo saldría como 404 sin que nadie lo haya decidido. Con un `Record<ApplicationErrorCode, number>`, TypeScript obliga a darle un status a cada código: si mañana se añade uno, no compila hasta decidirlo. Lo vi en la revisión del 09b.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.

1. En api/src/infrastructure/http/errorHandler.ts, sustituye el ternario
   por una constante
   APPLICATION_ERROR_STATUS: Record<ApplicationErrorCode, number>
   = { CUSTOMER_NOT_FOUND: 404, SIMULATION_NOT_FOUND: 404,
       TAX_ID_ALREADY_EXISTS: 409 }
   y usa APPLICATION_ERROR_STATUS[error.code].
2. No cambia ningún comportamiento: los tests existentes deben pasar
   sin tocarlos.
Comprueba: tests, typecheck y lint de api en verde.
Commit: refactor(api): status de cada error de aplicación en un Record
```

---

&nbsp;

**Qué revisaremos al terminar**

Si se añade un código a `ApplicationErrorCode` sin añadirlo al `Record`, `tsc` falla.
