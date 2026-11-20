# Prompt 04e · El logger registra la ruta completa

**Para:** Codex

**Fecha:** 2026-11-20

**Objetivo:** que los logs digan `GET /customers 200` y no `GET / 200`.

&nbsp;

**Por qué está escrito así**

Es uno de los cuatro arreglos de la revisión del prompt 04 (bitácora #6). Va en un prompt propio porque es una sola tarea (bitácora #7).

El test va primero. La query string sigue sin registrarse (ADR-006).

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/02-architecture/00-estructura.md (apartado Logs) y adr/006. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. Test: con console.info espiado, una petición a /customers?search=x
   registra "GET /customers 200", sin la query string. Comprueba que falla.
   Commit: test(api): ruta registrada por el logger
2. requestLogger usa request.originalUrl sin la parte desde "?".
   Commit: fix(api): el logger registra la ruta completa

Si un test falla de forma inesperada, para y avísame. No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el del arreglo.

El log no incluye nunca la query string.
