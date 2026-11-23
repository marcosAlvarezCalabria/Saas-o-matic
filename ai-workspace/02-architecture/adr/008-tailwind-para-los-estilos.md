# ADR-008 · Tailwind para los estilos

**Estado:** aceptado. Sustituye la parte de estilos del ADR-007.

**Contexto.** El ADR-007 eligió CSS Modules con variables CSS. Antes de escribir ninguna línea de código del frontend, hicimos la maqueta con Google Stitch (`ai-workspace/04-design/`), y Stitch la entrega en HTML con Tailwind: la estructura, la rejilla y los estados ya están escritos con sus clases. Con CSS Modules habría que traducir todo eso a mano, que es hacer dos veces el mismo trabajo.

**Decisión.**
- Tailwind CSS v4 con su plugin de Vite (`@tailwindcss/vite`). Sin archivo de configuración en JavaScript: el tema va en CSS.
- **Los colores siguen siendo las variables de `02-interfaz.md`**, ahora como tema de Tailwind en `styles/tokens.css`:
  - `@theme { --color-*: initial; … }` borra la paleta por defecto de Tailwind y define solo la nuestra, así que `bg-surface`, `text-muted` o `border-input-border` existen y `bg-blue-500` no.
  - `[data-theme="dark"] { … }` cambia los valores de esas variables. Las clases son las mismas en los dos temas: no hace falta llenar el código de `dark:`.
- Las escalas de `04-design/00-diseno.md` (tipografía, radios) también van en el `@theme`, con sus mismos nombres: `text-title-lg`, `rounded-card`, `rounded-field`. Los puntos de corte por defecto de Tailwind (`md` = 768 px, `lg` = 1024 px) coinciden con los de la spec.
- Prohibido escribir valores a mano (`bg-[#4040E3]`, `p-[13px]`): solo clases del tema. Se revisa en cada prompt.
- Las combinaciones que se repiten (botón, campo, tarjeta, pastilla) viven en componentes (`Button`, `Field`, `Card`, `Badge`), no copiadas en cada vista.
- El HTML de Stitch se usa como punto de partida de la estructura, no se pega tal cual: usa Tailwind v3 por CDN, una paleta genérica propia y Google Fonts. Sus clases se sustituyen por las nuestras.

**Alternativas.**
- CSS Modules (lo que decía el ADR-007): sin dependencias, pero obliga a reescribir a mano toda la maqueta.
- Una librería de componentes (MUI, Chakra): da los componentes hechos, pero con su propio aspecto, que habría que pelear para que se parezca a la maqueta.

**Consecuencias.** Menos trabajo para pasar de la maqueta al código, y el responsive sale directo con `md:` y `lg:`. A cambio, el JSX lleva cadenas de clases largas: por eso las repetidas van en componentes. Una dependencia más (`tailwindcss` y `@tailwindcss/vite`) en `web`.
