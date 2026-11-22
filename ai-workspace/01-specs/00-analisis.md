# SaaS-O-Matic — Análisis del enunciado y decisiones

Documento vivo. Fuente de verdad del proyecto para Codex, junto con el resto de archivos de `ai-workspace/01-specs`.

Entrega: 25 de noviembre de 2026.

## 1. Qué es el producto

Herramienta interna para el equipo comercial de una empresa SaaS. El comercial da de alta clientes corporativos, simula el coste mensual según el número de usuarios (tarificación acumulativa por tramos + IVA del país) y ve el precio en la divisa que elija. Las simulaciones se guardan en el historial del cliente.

## 2. Stack y estructura

- Monorepo con dos carpetas: `api` (Node + TypeScript + Express + SQLite con better-sqlite3) y `web` (React + Vite).
- En la raíz: `ai-workspace/`, `AGENTS.md` y `README.md`.
- Gestor de paquetes: pnpm (no npm), con workspaces para `api` y `web`.
- Despliegue en v1: `web` en Netlify y `api` en VPS Hetzner (Docker), además de poder levantarse en local. URL de la API y CORS por variables de entorno.

## 3. Arquitectura

- Clean Architecture ligera en `api/src`: `domain` (funciones puras: tramos, IVA, validación fiscal), `application` (casos de uso), `infrastructure` (Express, SQLite, repositorios).
- Las dependencias apuntan hacia dentro. Única abstracción: interfaces de repositorio.
- Sin sobreingeniería: sin librerías de inyección, sin capas vacías, sin Redux.
- Frontend sin lógica de negocio: toda la lógica de precios vive en `api`. El frontend solo convierte divisa para mostrar.
- `web/src`: `api` (cliente HTTP), `hooks`, `components`, `pages`.
- Todo el código debe poder explicarlo el autor en la presentación.

## 4. Modelo de datos

- `customers`: id, company_name, company_name_search (minúsculas y sin tildes, solo para buscar), tax_id (único, normalizado), email, country (ISO), plan, created_at.
- `simulations`: id, customer_id (FK), users, storage_gb, api_calls, base_cents, vat_rate_basis_points, vat_cents, total_cents, created_at.
- Importes en céntimos (enteros). El IVA aplicado se guarda en cada simulación para preservar el histórico.

## 5. Endpoints

Detalle de cada uno en `01-casos-de-uso.md`.

- `POST /customers`: alta de cliente (pedido por el enunciado).
- `POST /simulations`: calcula y guarda simulación (pedido).
- `POST /simulations/preview`: calcula sin guardar, para el slider en tiempo real (añadido).
- `GET /customers?search=`: buscador por nombre o identificador fiscal (añadido).
- `GET /customers/:id`: ficha del cliente (añadido).
- `GET /customers/:id/simulations`: historial (añadido).
- `GET /health`: comprobación de vida para Docker y despliegue (añadido).
- Contrato completo en `../02-architecture/openapi.yaml`.

## 6. Reglas de negocio

### Tarificación acumulativa por tramos

- Usuarios 1–10: 10 €/usuario. 11–50: 8 €/usuario. Más de 50: 5 €/usuario.
- Ejemplos: 10 → 100 €; 11 → 108 €; 15 → 140 €; 50 → 420 €; 1000 → 5170 €.
- Usuarios: entero de 1 a 100 000. El tope evita importes que dejan de ser enteros exactos en JavaScript (más allá de 2^53 − 1) y que acabarían en un 500; el tercer tramo sigue sin límite superior propio.
- Escenarios en `features/pricing.feature`.

### IVA

- Tabla de IVA por país en el dominio. Se suma al coste base.
- Países soportados: los 27 de la UE más Reino Unido, con su tipo general:

| País | Código | IVA | País | Código | IVA |
|---|---|---|---|---|---|
| Alemania | DE | 19 % | Irlanda | IE | 23 % |
| Austria | AT | 20 % | Italia | IT | 22 % |
| Bélgica | BE | 21 % | Letonia | LV | 21 % |
| Bulgaria | BG | 20 % | Lituania | LT | 21 % |
| Chipre | CY | 19 % | Luxemburgo | LU | 17 % |
| Croacia | HR | 25 % | Malta | MT | 18 % |
| Dinamarca | DK | 25 % | Países Bajos | NL | 21 % |
| Eslovaquia | SK | 23 % | Polonia | PL | 23 % |
| Eslovenia | SI | 22 % | Portugal | PT | 23 % |
| España | ES | 21 % | Reino Unido | GB | 20 % |
| Estonia | EE | 24 % | República Checa | CZ | 21 % |
| Finlandia | FI | 25,5 % | Rumanía | RO | 21 % |
| Francia | FR | 20 % | Suecia | SE | 25 % |
| Grecia | GR | 24 % | Hungría | HU | 27 % |

- Fuentes: UE, [Your Europe](https://www.europa.eu/youreurope/business/taxation/vat/vat-rules-rates) (revisada el 13/07/2026); Reino Unido, [gov.uk](https://www.gov.uk/vat-rates). Los tipos cambian: se revisan antes de cada versión.
- Grecia usa `GR` (ISO 3166-1), no `EL`, que es el código que usa la UE en temas de IVA. Todo el proyecto usa ISO.
- El tipo se guarda en **puntos básicos** (centésimas de punto porcentual), como entero: 21 % = 2100; 25,5 % = 2550. Así Finlandia cabe sin decimales (ADR-003).
- Importe de IVA = round(base × puntos básicos / 10 000), redondeo al céntimo más cercano.
- Con tipos enteros el IVA sale siempre exacto, porque la base es múltiplo de 100 céntimos. Con Finlandia el redondeo sí actúa: 51 usuarios dan 42 500 × 25,5 % = 10 837,5 céntimos, que se redondean a 10 838.
- País fuera de la tabla: error (no se inventan valores). Se rechaza ya al crear el cliente (400), así nunca existe un cliente que no se pueda simular.

### Validación fiscal

- España: algoritmo oficial obligatorio para DNI, NIE y CIF.
- Otros países: validación básica de formato.
- Diseño abierto/cerrado: añadir un país = añadir un validador.
- Identificador duplicado: error de conflicto (409).
- Otros países: solo letras y dígitos, de 4 a 20 caracteres tras normalizar.
- Fuera de alcance: NIF especiales K, L y M.
- Escenarios en `features/tax-id.feature`.

### Simulación

- Ligada a un cliente existente (customer_id en el cuerpo). Si no existe: 404.
- El backend recalcula siempre; nunca confía en importes enviados por el cliente.
- Se valida la entrada antes de buscar al cliente: datos no válidos dan 400 aunque el cliente no exista.
- Escenarios en `features/simulations.feature`.

## 7. Supuestos por ambigüedad del enunciado

- El plan es una lista cerrada: `basic`, `pro`, `enterprise`. Se guarda como dato informativo y no afecta al precio.
- Nombre de empresa: obligatorio, 2–100 caracteres tras recortar. Email: formato básico.
- Almacenamiento (GB) y llamadas a la API (al mes) son informativos, opcionales (0 por defecto) y no afectan al precio. Enteros ≥ 0 y seguros en JavaScript (`Number.isSafeInteger`).
- Tope de 100 000 usuarios por simulación: más es casi seguro un error de tecleo.
- Sin login ni autenticación: herramienta interna, fuera de alcance.
- Se aplica siempre el tipo general de IVA del país del cliente. No se aplica la inversión del sujeto pasivo entre empresas de distintos países de la UE (en la realidad, el IVA de esas ventas puede ser 0 %). Mejora futura: delegar en un servicio de impuestos.
- El país se normaliza (recortar y mayúsculas), igual que el identificador fiscal.

## 8. Frontend

- Dos vistas: Dashboard (buscador + tarjetas de clientes + alta en modal) y Detalle del cliente (datos, simulador con slider y selector de divisa, historial).
- Tipos de cambio: open.er-api.com con base EUR, una sola llamada al cargar la app.
- Estados de carga, vacío y error. Si falla la API de divisas: aviso y todo en EUR.
- Se guarda siempre en EUR; la conversión es solo de visualización.

## 9. Estrategia de tests

- TDD estricto en el dominio: tramos (0, 1, 10, 11, 50, 51, 1000), IVA, DNI/NIE/CIF.
- Tests de integración de endpoints tras implementarlos (BD en memoria): 400, 404, 409 y persistencia del desglose.
- Sin tests de configuración ni de UI trivial.

## 10. CI/CD y Docker

- CI con GitHub Actions en cada push y pull request: instalar dependencias, lint, comprobación de tipos TypeScript, tests de `api` y build de `web`. Si falla, no se fusiona.
- Badge de estado del CI en el README.
- CD en v1: la misma pipeline despliega `web` en Netlify y `api` en el VPS Hetzner con Docker.
- `api` con Dockerfile y `docker-compose.yml` con volumen para el archivo SQLite (los datos persisten entre reinicios).
- En local, `docker compose up` levanta todo con un solo comando (además de la opción sin Docker).
- `web` no usa Docker: Netlify la construye directamente.
- El despliegue en el VPS se hace al final, cuando la app ya funcione en local.

## 11. Método de trabajo

- Specs: OpenAPI (contratos), Gherkin (reglas de negocio), ADR (decisiones). Todo ligero.
- Orden: casos de uso → Gherkin → tests → código.
- Código con Codex, guiado por `AGENTS.md`. Si cambia algo, primero la spec y luego el código.
- `ai-workspace/`: `01-specs`, `02-architecture` (ADR, modelo de datos, notas sobre AGENTS.md), `03-vibe-coding` (prompts, capturas, bitácora de correcciones a la IA), `README.md` índice.
- README con guía para el evaluador: cada requisito del enunciado enlazado a dónde se ve en la app y al test que lo comprueba. Instalación sin Docker primero, Docker como alternativa y enlace a la demo.

## Registro de cambios

- v0.1: análisis inicial y decisiones de planificación.
- v0.2: añadido CI/CD.
- v0.3: despliegue y CD pasan a v1.
- v0.4: Docker para `api`.
- v0.5: columna company_name_search y tax_id normalizado.
- v0.6: guía para el evaluador en el README.
- v0.7: pnpm como gestor de paquetes.
- v0.8: el código lo escribe Codex con AGENTS.md; carpetas `src` en `api` y `web`; almacenamiento y llamadas opcionales.
- v0.9: Gherkin de la validación fiscal (DNI, NIE, CIF y otros países); formato básico definido (4–20 alfanuméricos).
- v1.0: país sin IVA definido se rechaza al crear el cliente.
- v1.1: tabla de IVA con 8 países, redondeo del IVA, planes cerrados, validación de nombre y email, y `GET /health`.
- v1.2: el ejemplo de 60 usuarios se sustituye por 1000, para probar el tercer tramo con muchos usuarios y sin tope.
- v1.3: corregido el importe de 1000 usuarios: 5170 € (100 + 320 + 4750), no 4750 €. Lo detectó el test.
- v1.4: escenarios de la API (`customers.feature`, `simulations.feature`), nota sobre el redondeo del IVA.
- v1.5: el país en minúsculas se normaliza; supuesto de no aplicar la inversión del sujeto pasivo.
- v1.6: tabla de IVA con los 27 de la UE más GB, de fuentes oficiales; IVA en puntos básicos para admitir el 25,5 % de Finlandia.
- v1.7: fecha de entrega corregida al 25 de noviembre.
- v1.8: tope de 100 000 usuarios; almacenamiento y llamadas como enteros seguros; la entrada se valida antes de buscar al cliente.
