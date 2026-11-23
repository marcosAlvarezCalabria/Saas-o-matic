# Prompt 07a · Setup de `web`: Vite, React, Tailwind y tema

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** que `web` arranque con el stack decidido y el tema de colores de los dos temas, sin pantallas todavía.

&nbsp;

**Por qué está escrito así**

Es la base de todos los prompts del front. Va solo, sin vistas, para revisar con calma la configuración y el tema.

El tema va entero aquí (colores en claro y en oscuro, tipografía y radios), porque todos los componentes dependen de él. Sin tests todavía: no hay lógica. El script `test` de `web` lo añade el 07b con los primeros tests, para que `pnpm test` no pase en verde sin tests (corrección #2).

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md, ai-workspace/04-design/00-diseno.md
(y sus capturas en screens/), 02-architecture/00-estructura.md y los ADR-007 y 008.
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni de api/, ni nada fuera de lo que pide esta tarea.
Haz solo este prompt y para.

1. web/package.json (name "web", type module). Scripts: dev (vite),
   build (tsc --noEmit && vite build), typecheck (tsc --noEmit), lint (eslint .).
   Sin script test todavía.
   Dependencias: react, react-dom, react-router, lucide-react,
   @fontsource-variable/montserrat.
   Dev: vite, @vitejs/plugin-react, typescript, @types/react, @types/react-dom,
   tailwindcss, @tailwindcss/vite, eslint, @eslint/js, typescript-eslint,
   eslint-plugin-react-hooks, globals. Ninguna más.
2. tsconfig.json: strict y noUncheckedIndexedAccess (como api), jsx react-jsx,
   moduleResolution bundler, types vite/client. eslint.config.js como el de
   api, más react-hooks.
3. vite.config.ts: plugins react y tailwindcss; servidor en el puerto 5173
   con strictPort.
4. index.html: lang="es", título "SaaS-O-Matic".
5. src/styles/tokens.css, el tema de Tailwind:
   - @theme con --color-*: initial; y después las variables de la tabla de
     02-interfaz.md, sección 7, con los valores del tema claro. Mismos nombres
     (--color-bg, --color-surface, --color-text-muted, --color-scrim…).
   - [data-theme="dark"] { … } con los valores del tema oscuro.
   - --font-sans: "Montserrat Variable", sans-serif.
   - Tipografía de 04-design, sección 1: --text-title-lg, --text-title-md,
     --text-title-sm, --text-amount, --text-label y --text-caption, cada una
     con su --line-height, --letter-spacing y --font-weight.
   - Radios: --radius-card 12px, --radius-field 8px, --radius-note 6px.
6. src/styles/global.css: @import "tailwindcss"; el import de tokens.css y
   de @fontsource-variable/montserrat; body con bg-bg, text-text y font-sans;
   foco visible global (contorno de 2 px en --color-link, separado 2 px).
7. src/main.tsx y src/App.tsx: BrowserRouter con las rutas /,
   /customers/:id y *, cada una con una página provisional que solo muestra
   su título (DashboardPage, CustomerDetailPage y NotFoundPage en src/pages/).
8. web/.env.example con VITE_API_URL=http://localhost:3000.
9. Borra los .gitkeep de web/src que ya no hagan falta.

Comprueba: pnpm --filter web lint, typecheck y build en verde; pnpm --filter
web dev arranca en http://localhost:5173 y muestra las tres rutas.
Commit: chore(web): setup de Vite, React, Tailwind y tema
```

---

&nbsp;

**Qué revisaremos al terminar**

`tokens.css` tiene todas las variables de la tabla de `02-interfaz.md`, con los mismos valores en claro y en oscuro.

`bg-blue-500` no genera nada: la paleta por defecto está desactivada.

Poniendo a mano `data-theme="dark"` en `<html>`, la página cambia de colores sin tocar ninguna clase.

Solo están las dependencias de la lista.

&nbsp;

**Resultado de la revisión**

Hecho en `aaa5575`. Solo las dependencias de la lista. Lint, typecheck y build en verde.

`tokens.css` coincide valor por valor con la tabla de `02-interfaz.md`, en claro y en oscuro. En el CSS compilado no hay paleta por defecto (`bg-blue-500` no genera nada) y sí están las clases del tema. Probado en el navegador: con `data-theme="dark"` en `<html>`, la página pasa a oscuro sin tocar ninguna clase.

Al revisarlo salió que el total del simulador en móvil (32 px) no tenía variable en el tema: se añade `--text-amount-sm` en el 07h, para no escribir el tamaño a mano.
