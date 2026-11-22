# Prompt 05e · El error 500 se registra en el servidor

**Para:** Codex

**Fecha:** 2026-11-22

**Objetivo:** que un error inesperado quede en los logs del servidor, con su traza, sin salir en la respuesta.

&nbsp;

**Por qué está escrito así**

Hoy el `errorHandler` responde 500 y no deja rastro: en el VPS sería imposible saber qué falló (bitácora #9).

El test va primero, para demostrar el fallo antes de arreglarlo. Usa un caso de uso falso que lanza un error, porque con los reales no hay forma de provocar un 500.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/01-casos-de-uso.md (tabla de errores y
nota del 500) y el escenario "Error inesperado" de
features/simulations.feature. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. Test en api/test/integration/errors.test.ts:
   - createTestContext acepta casos de uso que sustituyen a los reales
     (createTestContext(overrides?)). Usa uno de getCustomer cuyo execute
     lanza new Error('fallo interno de prueba').
   - GET /customers/1 → 500 con el código INTERNAL_ERROR.
   - El cuerpo no contiene 'fallo interno de prueba' ni '    at '.
   - console.error (vi.spyOn, con mockImplementation para no ensuciar la
     salida) se llama con ese error.
   Ejecútalo y comprueba que falla.
   Commit: test(api): el 500 se registra en el servidor

2. errorHandler: en el caso del 500, console.error(error) antes de
   responder. Solo en el 500: los 400, 404 y 409 no se registran.
   Commit: fix(api): el 500 se registra en el servidor

Si un test falla de forma inesperada, para y avísame. No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el del arreglo.

La respuesta del 500 sigue siendo genérica.

Solo se registra el 500.
