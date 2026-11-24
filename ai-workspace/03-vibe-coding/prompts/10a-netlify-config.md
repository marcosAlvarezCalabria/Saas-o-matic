# Prompt 10a · Configuración de Netlify en el repo

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** que Netlify construya la web desde el repo sin configurar nada a mano, y que recargar en `/customers/:id` no dé 404.

&nbsp;

**Por qué está escrito así**

La configuración va en `netlify.toml` y no en el panel de Netlify, para que esté versionada y se pueda revisar como el resto del código.

El build se lanza desde la raíz con `--filter web`. Así pnpm usa el `pnpm-lock.yaml` de la raíz, el mismo que en local y en el CI.

La redirección `/*` → `/index.html` con estado 200 es la de cualquier SPA: el servidor no tiene un archivo `/customers/1`, así que devuelve `index.html` y React Router pinta la página.

`VITE_API_URL` no va en el archivo: depende del entorno y se define en el panel de Netlify. Vite la mete en el build, así que, si cambia, hay que volver a desplegar.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/01-specs/02-interfaz.md (sección 2).
No toques nada de ai-workspace/, api/ ni web/src/.
Haz solo este prompt y para.

1. netlify.toml en la raíz del repo:
   [build]
     command = "pnpm --filter web build"
     publish = "web/dist"
   [build.environment]
     NODE_VERSION = "22"
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

2. package.json de la raíz: "packageManager": "pnpm@<versión>", con la
   versión exacta que da `pnpm -v`. Así Netlify y el CI usan la misma
   versión de pnpm que en local.

Comprueba: pnpm --filter web build en verde y que web/dist/index.html
existe.
Commit: chore: configuración de Netlify
```

---

&nbsp;

**Qué revisaremos al terminar**

Solo cambian `netlify.toml` y `package.json`.

`VITE_API_URL` no aparece en `netlify.toml`.
