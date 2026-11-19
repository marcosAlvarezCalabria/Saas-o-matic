SaaS-O-Matic — Análisis del enunciado y decisiones
Documento vivo. Fuente de verdad para Claude Code. Ubicación prevista: ai-workspace/01-specs/00-analisis.md.
Entrega: 23 de noviembre de 2026, 23:00 como muy tarde.
1. Qué es el producto
Herramienta interna para el equipo comercial de una empresa SaaS. El comercial da de alta clientes corporativos, simula el coste mensual según el número de usuarios (tarificación acumulativa por tramos + IVA del país) y ve el precio en la divisa que elija. Las simulaciones se guardan en el historial del cliente.
2. Stack y estructura
• Monorepo con dos carpetas: api (Node + TypeScript + Express + SQLite con better-sqlite3) y web (React + Vite).
• En la raíz: ai-workspace/ y README.md.
• Despliegue en v1: web en Netlify y api en VPS Hetzner (Docker), además de poder levantarse en local. Desde ya, URL de la API y CORS por variables de entorno.
3. Arquitectura
• Clean Architecture ligera en api: domain (funciones puras: tramos, IVA, validación fiscal), application (casos de uso), infrastructure (Express, SQLite, repositorios).
• Las dependencias apuntan hacia dentro. Única abstracción: interfaces de repositorio.
• Sin sobreingeniería: sin librerías de inyección, sin capas vacías, sin Redux.
• Frontend sin lógica de negocio: toda la lógica de precios vive en api. El frontend solo convierte divisa para mostrar.
• Todo el código debe poder explicarlo el autor en la presentación.
4. Modelo de datos
• customers: id, company_name, tax_id (único), email, country (ISO), plan, created_at.
• simulations: id, customer_id (FK), users, storage_gb, api_calls, base_cents, vat_rate, vat_cents, total_cents, created_at.
• Importes en céntimos (enteros). El IVA aplicado se guarda en cada simulación para preservar el histórico.
5. Endpoints
• POST /customers: alta de cliente (pedido por el enunciado).
• POST /simulations: calcula y guarda simulación (pedido).
• POST /simulations/preview: calcula sin guardar, para el slider en tiempo real (añadido).
• GET /customers?search=: buscador por nombre o identificador fiscal (añadido).
• GET /customers/:id: ficha del cliente (añadido).
• GET /customers/:id/simulations: historial (añadido).
6. Reglas de negocio
Tarificación acumulativa por tramos
• Usuarios 1–10: 10 €/usuario. 11–50: 8 €/usuario. Más de 50: 5 €/usuario.
• Ejemplos: 10 → 100 €; 11 → 108 €; 15 → 140 €; 50 → 420 €; 60 → 470 €.
• Usuarios: entero, mínimo 1.
IVA
• Tabla de IVA por país en el dominio. Se suma al coste base.
• País fuera de la tabla: error (no se inventan valores).
Validación fiscal
• España: algoritmo oficial obligatorio para DNI, NIE y CIF.
• Otros países: validación básica de formato.
• Diseño abierto/cerrado: añadir un país = añadir un validador.
• Identificador duplicado: error de conflicto (409).
Simulación
• Ligada a un cliente existente (customer_id en el cuerpo). Si no existe: 404.
• El backend recalcula siempre; nunca confía en importes enviados por el cliente.
7. Supuestos por ambigüedad del enunciado
• El plan es una lista cerrada (p. ej. Basic, Pro, Enterprise), se guarda como dato informativo y no afecta al precio.
• Almacenamiento (GB) y llamadas a la API (al mes) son informativos y no afectan al precio.
• Sin login ni autenticación: herramienta interna fuera de alcance.
8. Frontend
• Dos vistas: Dashboard (buscador + tarjetas de clientes + alta en modal) y Detalle del cliente (datos, simulador con slider y selector de divisa, historial).
• Tipos de cambio: open.er-api.com con base EUR, una sola llamada al cargar la app.
• Estados de carga, vacío y error. Si falla la API de divisas: aviso y todo en EUR.
• Se guarda siempre en EUR; la conversión es solo de visualización.
9. Estrategia de tests
• TDD estricto en el dominio: tramos (0, 1, 10, 11, 50, 51, 60), IVA, DNI/NIE/CIF.
• Tests de integración de endpoints tras implementarlos (BD en memoria): 400, 404, 409 y persistencia del desglose.
• Sin tests de configuración ni de UI trivial.
9b. CI/CD
• CI con GitHub Actions, en cada push y pull request: instalar dependencias, lint, comprobación de tipos TypeScript, tests de api y build de web. Si falla, no se fusiona.
• Badge de estado del CI en el README.
• CD en v1: la misma pipeline despliega web en Netlify y api en el VPS Hetzner con Docker.
Docker
• api con Dockerfile y docker-compose.yml con volumen para el archivo SQLite (los datos persisten entre reinicios).
• En local, docker compose up levanta todo con un solo comando (además de la opción sin Docker en el README).
• En el VPS, el CD construye la imagen nueva y reinicia el contenedor.
• web no usa Docker: Netlify la construye directamente.
• El despliegue en el VPS se hace al final, cuando la app ya funcione en local.
10. Método de trabajo
• Specs: OpenAPI (contratos), Gherkin (reglas de negocio), ADR (decisiones). Todo ligero.
• Orden: Gherkin → tests → código.
• Desarrollo con Claude Code, guiado por CLAUDE.md. Si cambia algo, primero la spec y luego el código.
• ai-workspace/: 01-specs, 02-architecture (CLAUDE.md, ADR, modelo de datos), 03-vibe-coding (prompts, capturas, bitácora de correcciones a la IA), README.md índice.
Registro de cambios
• v0.1: análisis inicial y decisiones de planificación. v0.2: añadido CI/CD. v0.3: despliegue y CD pasan a v1. v0.4: Docker para api.
