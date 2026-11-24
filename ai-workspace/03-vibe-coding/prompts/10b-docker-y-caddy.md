# Prompt 10b · Docker de la api y Caddy

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** la api en una imagen Docker pequeña y, con un solo `docker-compose.yml`, levantarla en local o en el VPS con HTTPS.

&nbsp;

**Por qué está escrito así**

La imagen tiene dos etapas:
- la de build instala todo y compila;
- la final solo lleva `dist/` y las dependencias de producción, y corre con el usuario `node`, no con root.

Así pesa menos y, si alguien entra en el contenedor, no es root.

`better-sqlite3` es un módulo nativo: tiene que funcionar dentro de la imagen, no solo en Windows. Por eso se usa `node:22-slim` (Debian), no Alpine, y la prueba final es arrancar el contenedor y crear un cliente de verdad.

Caddy va en el perfil `prod` (ADR-009). En local, `docker compose up` levanta solo la api, como dice el README.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/02-architecture/02-despliegue.md y el
ADR-009. La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/, api/src/ ni web/.
Haz solo este prompt y para.

1. api/Dockerfile, con el contexto en la raíz del repo (lo necesita para
   pnpm-lock.yaml y pnpm-workspace.yaml):
   - Base node:22-slim. pnpm con corepack, la versión de packageManager.
   - Etapa build: pnpm install --frozen-lockfile solo para api,
     pnpm --filter @saas-o-matic/api build.
   - Etapa final: solo dist/, package.json y las dependencias de
     producción de api (pnpm deploy o equivalente). NODE_ENV=production,
     PORT=3000, DATABASE_PATH=/data/saas-o-matic.sqlite. /data creada y
     de node antes de USER node. EXPOSE 3000.
   - HEALTHCHECK con node y fetch a http://127.0.0.1:3000/health (la
     imagen slim no trae curl).
   - CMD ["node", "dist/main.js"].
   Si pnpm 10 bloquea el script de instalación de better-sqlite3, añade
   onlyBuiltDependencies: [better-sqlite3] en pnpm-workspace.yaml.

2. .dockerignore en la raíz: node_modules, dist, .git, *.sqlite, .env,
   ai-workspace, web.

3. docker-compose.yml en la raíz:
   - api: build (context ., dockerfile api/Dockerfile), env_file .env
     opcional (required: false), volumen api-data:/data, ports
     "127.0.0.1:3000:3000", restart unless-stopped.
   - caddy: image caddy:2, profiles [prod], ports 80 y 443, volúmenes
     ./deploy/Caddyfile, caddy-data y caddy-config, API_DOMAIN desde
     .env, depends_on api con condition: service_healthy, restart
     unless-stopped.
   - volúmenes api-data, caddy-data, caddy-config.

4. deploy/Caddyfile:
   {$API_DOMAIN} {
     reverse_proxy api:3000
   }

5. .env.example en la raíz, con comentarios cortos:
   API_DOMAIN=saas-api.marcos-alvarez.dev
   CORS_ORIGINS=https://saas-o-matic.netlify.app
   TRUST_PROXY=1

Comprueba, sin .env:
- docker compose build
- docker compose up -d → docker compose ps con api "healthy"
- curl http://localhost:3000/health
- un POST /customers válido da 201 (el módulo nativo funciona)
- docker compose exec api node dist/seed.js
- docker compose down y otra vez up: los datos siguen (volumen)
- docker compose --profile prod config sin errores
Commit: build: Docker de la api y Caddy para el VPS
```

---

&nbsp;

**Qué revisaremos al terminar**

La imagen final no tiene `src/`, ni tests, ni dependencias de desarrollo.

El contenedor corre como `node`.

El 3000 solo está publicado en `127.0.0.1`.

Un `POST /customers` dentro de Docker da 201.
