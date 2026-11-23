# Prompt 06a · CORS: orígenes permitidos

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** que el front, desplegado en otro dominio, pueda llamar a la api, y solo él.

&nbsp;

**Por qué está escrito así**

Va antes que el front: sin CORS, el navegador bloquea todas sus peticiones en producción.

Los orígenes llegan por una variable de entorno, nunca `*`. `createApp` los recibe como opción, igual que recibe los casos de uso: así los tests eligen los orígenes sin tocar variables de entorno.

El test va primero, para demostrar que hoy la api no envía la cabecera.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (secciones 2 y 10),
features/cors.feature y 02-architecture/00-estructura.md.
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.
Haz solo este prompt y para.

1. Tests primero:
   - api/test/infrastructure/corsOrigins.test.ts: parseCorsOrigins(valor)
     · undefined o "" → ["http://localhost:5173"]
     · "a, b ,c" → ["a", "b", "c"] (recorta y quita vacíos)
   - api/test/integration/cors.test.ts: los escenarios de cors.feature,
     con createTestContext pasando corsOrigins.
   Ejecútalos y comprueba que fallan.
   Commit: test(api): orígenes permitidos por CORS

2. Implementa:
   - Dependencias: cors y @types/cors (dev). Ninguna más.
   - api/src/infrastructure/http/corsOrigins.ts: parseCorsOrigins.
   - createApp(useCases, options) con options.corsOrigins: string[].
     El middleware cors va justo después del logger y antes de
     express.json(): métodos GET, POST y OPTIONS; cabecera Content-Type;
     origin solo de la lista. Un origen fuera de la lista no recibe
     Access-Control-Allow-Origin.
   - main.ts: parseCorsOrigins(process.env.CORS_ORIGINS).
   - testContext.ts: corsOrigins por defecto ["http://localhost:5173"].
   Ejecuta tests, typecheck y lint, y arranca dist/main.js para comprobar
   que /health responde.
   Commit: feat(api): CORS con orígenes permitidos

Si algo es ambiguo, para y pregunta.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el de implementación.

Nunca se responde con `Access-Control-Allow-Origin: *`.

El preflight `OPTIONS /simulations` da 204 y no llega a las rutas.
