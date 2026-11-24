# 00 Estructura del proyecto

Objetivo: que cualquier archivo se encuentre por su nombre y que ninguno tenga más de una responsabilidad.

```
saas-o-matic/
├── AGENTS.md                  reglas para Codex
├── README.md                  guía para el evaluador
├── pnpm-workspace.yaml        workspaces: api, web
├── netlify.toml               build de web y redirección de la SPA
├── docker-compose.yml         api + volumen SQLite; Caddy en el perfil prod (02-despliegue.md)
├── .env.example               variables del VPS: API_DOMAIN, CORS_ORIGINS, TRUST_PROXY
├── deploy/Caddyfile           HTTPS automático y proxy a api:3000
├── .github/workflows/ci.yml   checks (lint, tipos, tests, build e imagen) y deploy al VPS
├── ai-workspace/              specs, arquitectura, vibe coding y diseño (04-design)
├── api/
│   ├── Dockerfile
│   ├── src/
│   │   ├── domain/            funciones puras, sin dependencias
│   │   │   ├── pricing/       tiers.ts (tramos y validateUsers), vat.ts, calculateMonthlyCost.ts
│   │   │   ├── tax-id/        normalizeTaxId.ts, spanishTaxId.ts, genericTaxId.ts, validateTaxId.ts
│   │   │   ├── customer.ts    tipo Customer, reglas de campos y nombre de búsqueda
│   │   │   ├── simulation.ts  tipo Simulation y validateUsage (almacenamiento y llamadas)
│   │   │   └── errors.ts      DomainError con código
│   │   ├── application/
│   │   │   ├── use-cases/     un archivo por caso de uso, agrupados por tema
│   │   │   │   ├── customers/    createCustomer.ts, searchCustomers.ts, getCustomer.ts (UC1–UC3)
│   │   │   │   └── simulations/  listCustomerSimulations.ts, previewSimulation.ts, createSimulation.ts,
│   │   │   │                     archiveSimulation.ts, restoreSimulation.ts (UC4–UC8)
│   │   │   ├── ports/         CustomerRepository, SimulationRepository (interfaces, comunes)
│   │   │   └── errors.ts      ApplicationError: CUSTOMER_NOT_FOUND, TAX_ID_ALREADY_EXISTS (común)
│   │   ├── infrastructure/
│   │   │   ├── db/            connection.ts, schema.ts, repositorios SQLite
│   │   │   ├── seed/          demoData.ts (solo datos), seedDemoData.ts (usa los casos de uso)
│   │   │   └── http/          app.ts, routes/ (customers.ts, simulations.ts), errorHandler.ts,
│   │   │                      inputValidation.ts (clientes), simulationInput.ts (simulaciones)
│   │   ├── main.ts            composición: crea BD, repositorios, casos de uso y app
│   │   └── seed.ts            composición del seed: `pnpm --filter api seed` (03-datos-demo.md)
│   └── test/
│       ├── domain/            TDD a partir de los .feature
│       └── integration/       endpoints con BD en memoria
└── web/
    ├── index.html             incluye el script que aplica el tema antes de pintar
    └── src/
        ├── api/               apiClient.ts (fetch + ApiError), customers.ts, simulations.ts,
        │                      exchangeRates.ts, types.ts
        ├── hooks/             useCustomers, useCustomer, useSimulations, usePreview,
        │                      useExchangeRates, useTheme, useDebouncedValue
        ├── context/           CurrencyContext (divisa elegida y tipos de cambio)
        ├── lib/               lógica pura con tests: money.ts, theme.ts, countries.ts
        ├── components/        Header, CurrencySelector, ThemeToggle, CustomerCard,
        │                      CustomerFormDialog, Simulator, SimulationHistory, Money, StatusMessage
        ├── pages/             DashboardPage, CustomerDetailPage, NotFoundPage
        ├── styles/            tokens.css (tema de Tailwind: colores de los dos temas y escalas), global.css
        ├── App.tsx            rutas
        └── main.tsx
```

## Reglas de dependencia

- `domain` no importa nada del proyecto ni de librerías externas.
- `application` importa `domain` y `application/ports`. Nunca `infrastructure`.
- `infrastructure` implementa los puertos y traduce HTTP ↔ casos de uso.
- `main.ts` (y `seed.ts` para los datos de demostración) son los únicos sitios que conectan todo (inyección manual, sin librerías).
- Los casos de uso van en `application/use-cases/`, agrupados por tema (`customers/`, `simulations/`), para que el nombre diga lo que hay dentro y todo lo de un tema esté junto. `ports/` y `errors.ts` quedan fuera porque los usan los dos temas.

## Errores

- Cada capa tiene los suyos: `DomainError` en `domain/errors.ts` y `ApplicationError` en `application/errors.ts`.
- Solo `infrastructure/http/errorHandler.ts` sabe de códigos HTTP. La tabla de traducción está en `01-specs/01-casos-de-uso.md`.
- Un error inesperado (500) se registra entero en el servidor (`console.error`, con traza) y se responde con un mensaje genérico, sin traza.

## Logs

- El logger de peticiones registra método, ruta completa (`/customers/1`, no la ruta relativa al router) y estado. Nunca la query string ni el cuerpo (ADR-006).

## Límites de tamaño (guía para Codex)

- Un archivo, una responsabilidad. Si pasa de ~150 líneas, se divide.
- Las rutas HTTP no contienen lógica: validan la forma de la entrada, llaman al caso de uso y devuelven la respuesta.
- En `web`, los componentes no llaman a `fetch`: lo hacen los hooks a través de `api/`. Los componentes solo usan clases del tema de `tokens.css`, nunca colores ni medidas escritos a mano (`bg-[#…]`). Las combinaciones de clases que se repiten van en componentes (`Button`, `Field`, `Card`, `Badge`).
- La api lee `CORS_ORIGINS` en `main.ts` y se la pasa a `createApp`, como los casos de uso.
- Todas las rutas de simulaciones, incluida `GET /customers/:id/simulations`, viven en `routes/simulations.ts`: todo lo de un tema, junto.
- Nada de `utils.ts` genéricos.
