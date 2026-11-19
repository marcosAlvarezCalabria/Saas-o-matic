# ADR-004 · Todo el cálculo en el backend, con endpoint de previsualización

**Estado:** aceptado

**Contexto.** El slider tiene que mostrar el precio en tiempo real. Lo más rápido sería calcularlo en el frontend, pero entonces la regla de tramos existiría dos veces.

**Decisión.** `POST /simulations/preview` calcula sin guardar. El frontend lo llama con debounce (~250 ms) y cancela la petición anterior. `POST /simulations` usa exactamente la misma función de dominio y nunca acepta importes del cliente.

**Alternativas.** Duplicar los tramos en el frontend (dos fuentes de verdad, pueden divergir). Compartir un paquete de dominio entre api y web (válido, pero añade complejidad de build para un reto de este tamaño).

**Consecuencias.** Una sola fuente de verdad, testeada. Más peticiones, mitigadas con debounce. El frontend solo conoce la divisa: convierte céntimos de EUR al tipo de cambio de open.er-api.com.
