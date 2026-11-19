# 01 Casos de uso

Un caso de uso por endpoint. Cada uno vive en `api/src/application` y solo depende del dominio y de interfaces de repositorio.

## UC1. Crear cliente

- **Endpoint:** `POST /customers`
- **Entrada:** companyName, taxId, email, country (ISO), plan.
- **Pasos:** normalizar taxId (mayúsculas, sin espacios ni guiones) → validar campos → comprobar que el país está en la tabla de IVA → validar taxId según el país → comprobar que no existe otro cliente con ese taxId → guardar.
- **Salida:** 201 con el cliente creado.
- **Errores:** 400 si un campo no es válido, el país no está en la tabla de IVA (`COUNTRY_NOT_SUPPORTED`) o el taxId no pasa la validación · 409 si el taxId ya existe.

## UC2. Buscar clientes

- **Endpoint:** `GET /customers?search=`
- **Entrada:** texto de búsqueda (opcional).
- **Pasos:** un único buscador: normalizar el texto y buscar por coincidencia parcial en companyName o taxId a la vez, sin distinguir mayúsculas. Sin texto: devolver todos, los más recientes primero.
- **Salida:** 200 con la lista (puede estar vacía).
- **Normalización:** taxId se guarda y se busca en mayúsculas, sin espacios ni guiones. companyName se guarda tal cual (recortado) para mostrarlo, y además en `company_name_search` en minúsculas y sin tildes, usada solo para buscar.

## UC3. Ver cliente

- **Endpoint:** `GET /customers/:id`
- **Salida:** 200 con el cliente.
- **Errores:** 400 si el id no es un entero positivo · 404 si no existe.

## UC4. Ver historial de simulaciones

- **Endpoint:** `GET /customers/:id/simulations`
- **Salida:** 200 con las simulaciones del cliente y su desglose, las más recientes primero. Sin simulaciones: lista vacía, no error.
- **Errores:** 404 si el cliente no existe.

## UC5. Previsualizar simulación

- **Endpoint:** `POST /simulations/preview`
- **Entrada:** customerId, users.
- **Pasos:** obtener el cliente → calcular coste base por tramos → aplicar IVA de su país. No guarda nada.
- **Salida:** 200 con baseCents, vatRate, vatCents, totalCents.
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
- Importes siempre en céntimos (enteros).

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
