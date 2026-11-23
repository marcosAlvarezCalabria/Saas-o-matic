# 01 Casos de uso

Un caso de uso por endpoint. Cada uno vive en `api/src/application` y solo depende del dominio y de interfaces de repositorio.

## UC1. Crear cliente

- **Endpoint:** `POST /customers`
- **Entrada:** companyName, taxId, email, country (ISO), plan.
- **Pasos:** validar campos (nombre recortado de 2 a 100 caracteres, email, plan y país, que se recorta y se pasa a mayúsculas antes de comprobar que son dos letras) → comprobar que el país está en la tabla de IVA → normalizar y validar taxId según el país → comprobar que no existe otro cliente con ese taxId → guardar con `company_name_search`.
- **Salida:** 201 con el cliente creado.
- **Errores:** 400 si un campo no es válido, el país no está en la tabla de IVA (`COUNTRY_NOT_SUPPORTED`) o el taxId no pasa la validación · 409 si el taxId ya existe.

## UC2. Buscar clientes

- **Endpoint:** `GET /customers?search=`
- **Entrada:** texto de búsqueda (opcional).
- **Pasos:** un único buscador: normalizar el texto y buscar por coincidencia parcial en companyName o taxId a la vez, sin distinguir mayúsculas. Sin texto: devolver todos, los más recientes primero (empate en fecha → id mayor primero). Los caracteres `%` y `_` se escapan: se buscan como texto, no como comodines.
- **Salida:** 200 con la lista (puede estar vacía).
- **Normalización:** taxId se guarda y se busca en mayúsculas, sin espacios ni guiones. companyName se guarda tal cual (recortado) para mostrarlo, y además en `company_name_search` en minúsculas y sin tildes, usada solo para buscar.

## UC3. Ver cliente

- **Endpoint:** `GET /customers/:id`
- **Salida:** 200 con el cliente.
- **Errores:** 400 si el id no es un entero positivo escrito solo con dígitos (`1.0`, `1e0` o `0x1` no valen) · 404 si no existe.

## UC4. Ver historial de simulaciones

- **Endpoint:** `GET /customers/:id/simulations`
- **Archivo:** `application/use-cases/simulations/listCustomerSimulations.ts`
- **Pasos:** id solo con dígitos (capa HTTP, igual que UC3) → comprobar que el cliente existe → listar sus simulaciones.
- **Salida:** 200 con las simulaciones del cliente y su desglose, las más recientes primero (empate en fecha → id mayor primero). Sin simulaciones: lista vacía, no error.
- **Errores:** 400 si el id está mal formado · 404 si el cliente no existe.

## UC5. Previsualizar simulación

- **Endpoint:** `POST /simulations/preview`
- **Archivo:** `application/use-cases/simulations/previewSimulation.ts`
- **Entrada:** customerId, users. Cualquier otro campo se ignora.
- **Pasos:** forma (capa HTTP: customerId entero ≥ 1, users número) → users válido (dominio: entero de 1 a 100 000) → obtener el cliente → `calculateMonthlyCost(país, users)`. No guarda nada.
- **Salida:** 200 solo con baseCents, vatRateBasisPoints, vatCents, totalCents.
- **Errores:** 400 si la entrada no es válida · 404 si el cliente no existe.

## UC6. Crear simulación

- **Endpoint:** `POST /simulations`
- **Archivo:** `application/use-cases/simulations/createSimulation.ts`
- **Entrada:** customerId, users, storageGb y apiCalls (opcionales: enteros seguros ≥ 0, por defecto 0; informativos, no afectan al precio).
- **Pasos:** forma (capa HTTP) → valores (dominio: users y uso) → obtener el cliente → calcular igual que UC5 → guardar con el desglose. La fecha la pone la BD.
- **Salida:** 201 con la simulación guardada (`Simulation` en `openapi.yaml`).
- **Errores:** 400 si la entrada no es válida · 404 si el cliente no existe.
- **Regla:** el cálculo lo hace siempre el backend; se ignora cualquier importe o campo desconocido que envíe el cliente.

## Reglas comunes

- UC5 y UC6 usan exactamente la misma función de dominio para calcular.
- Orden de validación en UC5 y UC6: forma (400) → valores (400) → cliente (404). Con datos no válidos y un cliente inexistente gana el 400: no se consulta la BD con una entrada que se va a rechazar.
- `customerId` es un identificador, no un valor de negocio: lo comprueba la capa HTTP (entero ≥ 1 en el cuerpo, solo dígitos en la ruta).
- Errores con formato único: `{ "error": { "code": "...", "message": "..." } }`.
- Cada capa lanza sus errores y solo `infrastructure/http/errorHandler.ts` los traduce a HTTP:

| Origen | Clase | Código | HTTP |
|---|---|---|---|
| Dominio | `DomainError` | `VALIDATION_ERROR`, `COUNTRY_NOT_SUPPORTED`, `INVALID_TAX_ID` | 400 |
| Aplicación | `ApplicationError` | `CUSTOMER_NOT_FOUND` | 404 |
| Aplicación | `ApplicationError` | `TAX_ID_ALREADY_EXISTS` | 409 |
| HTTP | — | `VALIDATION_ERROR` (cuerpo no es JSON o no es un objeto, falta un campo, tipo incorrecto, id mal formado) | 400 |
| HTTP | — | `NOT_FOUND` (ruta inexistente) | 404 |
| HTTP | — | `RATE_LIMITED` (límite de peticiones superado) | 429 |
| Cualquier otro | — | `INTERNAL_ERROR`, sin traza en la respuesta | 500 |

- En un 500, la respuesta lleva un mensaje genérico, sin el texto ni la traza del error. El `errorHandler` sí registra el error completo en el servidor (`console.error`, con traza), para poder diagnosticarlo en los logs del contenedor.

- Reparto de la validación: la capa HTTP comprueba la forma (campo presente, tipo número o texto); el dominio comprueba los valores (entero ≥ 1, longitud, formato).
- Importes siempre en céntimos (enteros).
- Límite de peticiones por IP: 30 por minuto en las rutas que escriben (`POST /customers` y `POST /simulations`) y 120 por minuto en todas, incluido el preview. Al superarlo, 429 con la cabecera `Retry-After`. `/health` queda fuera. Detalle en `02-interfaz.md`, sección 10, y `features/rate-limit.feature`.
- CORS: la api solo acepta peticiones del navegador desde los orígenes de `CORS_ORIGINS` (detalle en `02-interfaz.md`, sección 10, y `features/cors.feature`).

## Escenarios

- `features/customers.feature`: UC1, UC2 y UC3, y las reglas de campos del cliente.
- `features/simulations.feature`: UC4, UC5, UC6, el uso informativo (almacenamiento y llamadas) y los errores comunes.
- `features/cors.feature`: orígenes permitidos.
- `features/rate-limit.feature`: límite de peticiones.

## Fuera de alcance

- CRUD completo de clientes (editar, borrar): el enunciado solo pide registrar. Borrar un cliente eliminaría su historial de simulaciones. Posible mejora futura: editar y archivar clientes.

## Registro de cambios

- v0.1: casos de uso iniciales.
- v0.2: CRUD completo fuera de alcance.
- v0.3: buscador único con normalización del NIF.
- v0.4: columna de búsqueda normalizada para el nombre.
- v0.5: 400 por id mal formado en UC3.
- v0.6: storageGb y apiCalls opcionales con 0 por defecto.
- v0.7: UC1 rechaza países sin IVA definido al crear el cliente.
- v0.8: orden de validación de UC1, escape de comodines y desempate en los listados, tabla de errores por capa (`ApplicationError`) y enlace a los nuevos `.feature`.
- v0.9: el país en minúsculas se normaliza a mayúsculas en vez de rechazarse.
- v0.10: el IVA de la salida pasa a `vatRateBasisPoints`.
- v0.11: id válido = solo dígitos sin ceros a la izquierda; el duplicado detectado por la BD también es 409.
- v0.12: simulaciones: archivo de cada caso de uso, orden de validación (400 antes que 404), tope de 100 000 usuarios, almacenamiento y llamadas como enteros seguros, campos desconocidos ignorados y el 500 se registra en el servidor.
- v0.13: regla de CORS para el front desplegado en otro dominio.
- v0.14: límite de peticiones por IP (429 `RATE_LIMITED`).
