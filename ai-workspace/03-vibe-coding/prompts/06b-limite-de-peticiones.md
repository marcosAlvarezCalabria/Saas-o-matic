# Prompt 06b · Límite de peticiones por IP

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** que nadie pueda llenar la BD ni saturar el VPS desde el enlace público de la demo.

&nbsp;

**Por qué está escrito así**

La api no tiene login (supuesto de `00-analisis.md`) y la demo se publica con un enlace abierto. El límite es la protección mínima.

Los límites y la ventana son opciones de `createApp`, con los valores reales por defecto. Así los tests usan números pequeños y no lanzan 120 peticiones ni esperan un minuto. Cada `createApp` crea sus propios contadores, así que los tests no se pisan entre sí.

`TRUST_PROXY` va a 0 por defecto. Con 1 sin un proxy delante, cualquiera podría falsear su IP con `X-Forwarded-For` y saltarse el límite.

El límite va después de CORS, para que la respuesta 429 lleve las cabeceras CORS y el front pueda leerla.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (sección 10),
01-casos-de-uso.md (reglas comunes y tabla de errores) y
features/rate-limit.feature. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.
Haz solo este prompt y para.

1. Tests primero, en api/test/integration/rate-limit.test.ts: los
   escenarios de rate-limit.feature. createTestContext acepta límites
   pequeños (por ejemplo, escritura 2, general 5, ventana 200 ms).
   Para "pasada la ventana", espera a que pase la ventana.
   Ejecútalos y comprueba que fallan.
   Commit: test(api): límite de peticiones por IP

2. Implementa:
   - Dependencia: express-rate-limit. Ninguna más.
   - api/src/infrastructure/http/rateLimits.ts: crea los dos limitadores
     a partir de { windowMs, writeLimit, generalLimit }. Por defecto:
     60 000 ms, 30 y 120.
   - Al superarlo: 429 con { error: { code: "RATE_LIMITED", message } },
     usando errorBody de errorHandler.ts, y la cabecera Retry-After.
   - app.ts: orden requestLogger → cors → /health → limitador general →
     express.json() → rutas. El de escritura, solo en POST /customers y
     POST /simulations.
   - app.set('trust proxy', options.trustProxy). main.ts lee TRUST_PROXY
     (número, por defecto 0).
   - testContext.ts: por defecto, límites muy altos, para que el resto de
     tests no los alcance.
   Ejecuta tests, typecheck y lint, y arranca dist/main.js.
   Commit: feat(api): límite de peticiones por IP

Si algo es ambiguo, para y pregunta.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el de implementación.

`/health` queda fuera del límite.

El 429 lleva `Retry-After` y `Access-Control-Allow-Origin`.

Probaré a mano contra `dist/main.js` que la petición 31 de alta da 429.
