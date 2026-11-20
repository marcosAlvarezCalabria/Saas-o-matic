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
- **Salida:** 200 con las simulaciones del cliente y su desglose, las más recientes primero (empate en fecha → id mayor primero). Sin simulaciones: lista vacía, no error.
- **Errores:** 404 si el cliente no existe.

## UC5. Previsualizar simulación

- **Endpoint:** `POST /simulations/preview`
- **Entrada:** customerId, users.
- **Pasos:** obtener el cliente → calcular coste base por tramos → aplicar IVA de su país. No guarda nada.
- **Salida:** 200 con baseCents, vatRateBasisPoints, vatCents, totalCents.
- **Errores:** 400 si users no es válido · 404 si el cliente no existe.

## UC6. Crear simulación

- **Endpoint:** `POST /simulations`
- **Entrada:** customerId, users, storageGb y apiCalls (opcionales: enteros ≥ 0, por defecto 0; informativos, no afectan al precio).
- **Pasos:** obtener el cliente → validar entrada → calcular igual que UC5 → guardar con el desglose y la fecha.
- **Salida:** 201 con la simulación guardada.
- **Errores:** 400 si la entrada no es válida · 404 si el cliente no existe.
- **Regla:** el cálculo lo hace siempre el backend; se ignora cualquier importe que envíe el cliente.

## Reglas comunes

- UC5 y UC6 usan exactamente la misma función de dominio para calcular.
- Errores con formato único: `{ "error": { "code": "...", "message": "..." } }`.
- Cada capa lanza sus errores y solo `infrastructure/http/errorHandler.ts` los traduce a HTTP:

| Origen | Clase | Código | HTTP |
|---|---|---|---|
| Dominio | `DomainError` | `VALIDATION_ERROR`, `COUNTRY_NOT_SUPPORTED`, `INVALID_TAX_ID` | 400 |
| Aplicación | `ApplicationError` | `CUSTOMER_NOT_FOUND` | 404 |
| Aplicación | `ApplicationError` | `TAX_ID_ALREADY_EXISTS` | 409 |
| HTTP | — | `VALIDATION_ERROR` (cuerpo no es JSON, falta un campo, tipo incorrecto, id mal formado) | 400 |
| HTTP | — | `NOT_FOUND` (ruta inexistente) | 404 |
| Cualquier otro | — | `INTERNAL_ERROR`, sin traza en la respuesta | 500 |

- Reparto de la validación: la capa HTTP comprueba la forma (campo presente, tipo número o texto); el dominio comprueba los valores (entero ≥ 1, longitud, formato).
- Importes siempre en céntimos (enteros).

## Escenarios

- `features/customers.feature`: UC1, UC2 y UC3, y las reglas de campos del cliente.
- `features/simulations.feature`: UC4, UC5, UC6 y los errores comunes.

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
