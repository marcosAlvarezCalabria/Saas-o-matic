# Prompt 07c · Cliente HTTP y funciones de la api

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** un único sitio que habla con la api y con open.er-api.com, y que convierte sus errores en errores que la interfaz entiende.

&nbsp;

**Por qué está escrito así**

Los componentes no llaman a `fetch` (`00-estructura.md`): lo hacen los hooks a través de `api/`. Así, cómo se trata un error de la api está escrito una sola vez.

Una petición cancelada (`AbortError`) no es un error para el usuario: es el buscador o el preview cancelando la anterior. Por eso se deja pasar tal cual, y los hooks la ignoran.

Va con el test primero, con `fetch` simulado.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md, ai-workspace/04-design/00-diseno.md
(y sus capturas en screens/), 02-architecture/00-estructura.md y los ADR-007 y 008.
Lee también 02-architecture/openapi.yaml.
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni de api/, ni nada fuera de lo que pide esta tarea.
Haz solo este prompt y para.

1. Tests primero, en web/src/api/ (fetch simulado con vi.stubGlobal):
   - apiClient.test.ts:
     · Respuesta 2xx con JSON → devuelve el JSON.
     · 404 con { error: { code: "CUSTOMER_NOT_FOUND", message } } → lanza
       ApiError con status 404, code y message.
     · 500 con un cuerpo que no es JSON → ApiError con status 500 y code
       "UNKNOWN".
     · fetch lanza un TypeError (sin red) → NetworkError.
     · fetch lanza un AbortError → se relanza tal cual, sin convertirlo.
     · La URL se forma con VITE_API_URL y el search va codificado
       (searchCustomers("a&b") pide ?search=a%26b).
   - exchangeRates.test.ts:
     · result "success" con rates → { rates, updatedAt } (updatedAt desde
       time_last_update_utc).
     · result distinto de "success", sin rates o JSON no válido → lanza.
   Comprueba que fallan.
   Commit: test(web): cliente HTTP y tipos de cambio

2. Implementa en web/src/api/:
   - types.ts: Customer, CreateCustomerInput, CostBreakdown, Simulation,
     PreviewInput, CreateSimulationInput y ApiErrorCode, como en openapi.yaml.
   - apiClient.ts: request<T>(path, { method, body, signal }); ApiError y
     NetworkError. La URL base sale de import.meta.env.VITE_API_URL.
   - customers.ts: searchCustomers(search, signal), getCustomer(id, signal),
     createCustomer(input).
   - simulations.ts: previewSimulation(input, signal),
     createSimulation(input), listSimulations(customerId, signal).
   - exchangeRates.ts: fetchExchangeRates(signal), contra
     https://open.er-api.com/v6/latest/EUR.
   Commit: feat(web): cliente HTTP y funciones de la api

Si algo es ambiguo, para y pregunta. No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

Los dos commits, test antes que implementación.

Ningún archivo fuera de `api/` usa `fetch`.

Un `AbortError` nunca acaba como mensaje de error en pantalla.
