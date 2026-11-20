# 00 Estructura del proyecto

Objetivo: que cualquier archivo se encuentre por su nombre y que ninguno tenga más de una responsabilidad.

```
saas-o-matic/
├── AGENTS.md                  reglas para Codex
├── README.md                  guía para el evaluador
├── pnpm-workspace.yaml        workspaces: api, web
├── docker-compose.yml         api + volumen SQLite
├── .github/workflows/ci.yml   lint, tipos, tests, build
├── ai-workspace/              specs, arquitectura y vibe coding
├── api/
│   ├── Dockerfile
│   ├── src/
│   │   ├── domain/            funciones puras, sin dependencias
│   │   │   ├── pricing/       tiers.ts, vat.ts, calculateMonthlyCost.ts
│   │   │   ├── tax-id/        normalizeTaxId.ts, spanishTaxId.ts, genericTaxId.ts, validateTaxId.ts
│   │   │   ├── customer.ts    tipo Customer, reglas de campos y nombre de búsqueda
│   │   │   ├── simulation.ts  tipo Simulation
│   │   │   └── errors.ts      DomainError con código
│   │   ├── application/       un archivo por caso de uso (UC1–UC6)
│   │   │   ├── errors.ts      ApplicationError: CUSTOMER_NOT_FOUND, TAX_ID_ALREADY_EXISTS
│   │   │   └── ports/         CustomerRepository, SimulationRepository (interfaces)
│   │   ├── infrastructure/
│   │   │   ├── db/            connection.ts, schema.ts, repositorios SQLite
│   │   │   └── http/          app.ts, routes/, errorHandler.ts, validación de entrada
│   │   └── main.ts            composición: crea BD, repositorios, casos de uso y app
│   └── test/
│       ├── domain/            TDD a partir de los .feature
│       └── integration/       endpoints con BD en memoria
└── web/
    └── src/
        ├── api/               cliente HTTP (fetch) y tipos de la API
        ├── hooks/             useCustomers, useExchangeRates, usePreview…
        ├── components/        tarjetas, slider, selector de divisa, modal
        └── pages/             Dashboard, CustomerDetail
```

## Reglas de dependencia

- `domain` no importa nada del proyecto ni de librerías externas.
- `application` importa `domain` y `application/ports`. Nunca `infrastructure`.
- `infrastructure` implementa los puertos y traduce HTTP ↔ casos de uso.
- `main.ts` es el único sitio que conecta todo (inyección manual, sin librerías).

## Errores

- Cada capa tiene los suyos: `DomainError` en `domain/errors.ts` y `ApplicationError` en `application/errors.ts`.
- Solo `infrastructure/http/errorHandler.ts` sabe de códigos HTTP. La tabla de traducción está en `01-specs/01-casos-de-uso.md`.

## Logs

- El logger de peticiones registra método, ruta completa (`/customers/1`, no la ruta relativa al router) y estado. Nunca la query string ni el cuerpo (ADR-006).

## Límites de tamaño (guía para Codex)

- Un archivo, una responsabilidad. Si pasa de ~150 líneas, se divide.
- Las rutas HTTP no contienen lógica: validan la forma de la entrada, llaman al caso de uso y devuelven la respuesta.
- Nada de `utils.ts` genéricos.
