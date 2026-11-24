# Prompt 10c · CI con GitHub Actions

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** que cada push y cada pull request pasen por lint, tipos, tests, build y la construcción de la imagen Docker.

&nbsp;

**Por qué está escrito así**

Un solo job con los mismos comandos que en local: si pasa en mi máquina y falla en el CI, la diferencia está en el entorno, no en los comandos.

Se construye también la imagen Docker. Así un `Dockerfile` roto se ve en el CI y no al desplegar.

`concurrency` cancela las ejecuciones anteriores de la misma rama: si hago dos push seguidos, solo cuenta el último.

El despliegue (CD) va en el 10d, en el mismo archivo, para que dependa de este job.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/02-architecture/02-despliegue.md.
No toques nada fuera de .github/ y README.md.
Haz solo este prompt y para.

1. .github/workflows/ci.yml:
   - name: CI. on: push a main y pull_request.
   - permissions: contents: read.
   - concurrency: group ci-${{ github.ref }}, cancel-in-progress true.
   - job checks (ubuntu-latest):
     · actions/checkout
     · pnpm/action-setup (sin versión: la lee de packageManager)
     · actions/setup-node con node 22 y cache pnpm
     · pnpm install --frozen-lockfile
     · pnpm lint, pnpm typecheck, pnpm test, pnpm build (un paso cada uno,
       para ver en GitHub cuál falla)
     · docker build -f api/Dockerfile .
   Las acciones, con su versión mayor actual (@v4 o la que toque).

2. README.md: si no existe, créalo solo con el título "# SaaS-O-Matic" y
   el badge del CI:
   [![CI](https://github.com/marcosAlvarezCalabria/Saas-o-matic/actions/workflows/ci.yml/badge.svg)](https://github.com/marcosAlvarezCalabria/Saas-o-matic/actions/workflows/ci.yml)
   Si ya existe, añade solo el badge debajo del título.

Commit: ci: lint, tipos, tests, build e imagen de la api
```

---

&nbsp;

**Qué revisaremos al terminar**

Después del push, el CI sale en verde en GitHub (pestaña Actions).

Cada comando va en su propio paso.

`pnpm install` usa `--frozen-lockfile`.
