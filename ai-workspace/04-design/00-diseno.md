# 04 Diseño (UI)

Documento vivo. Cómo se ve cada pieza del frontend: medidas, tipografía, componentes y textos. Qué hace cada vista y sus estados está en `../01-specs/02-interfaz.md`; los colores, en su sección 7.

**Origen.** Maqueta de Google Stitch, segunda versión (23/11/2026), revisada contra la spec. Las capturas están en `screens/` como referencia visual (sección 11).

**Qué manda.** Si la maqueta y la spec no coinciden, manda la spec. El HTML de Stitch es el punto de partida de la estructura, pero no se pega tal cual: usa Tailwind v3 por CDN, una paleta genérica propia, Google Fonts e iconos de Google. Sus clases se sustituyen por las de nuestro tema de Tailwind (ADR-008).

## 1. Escalas

### Tipografía (Montserrat)

| Nombre | Tamaño / línea | Peso | Uso |
|---|---|---|---|
| `title-lg` | 28 / 36 px, `-0.01em` | 800 | Título de página y nombre del cliente en el detalle |
| `title-md` | 22 / 28 px | 800 | Título de tarjeta (Simulador, Historial) y del modal |
| `title-sm` | 18 / 24 px | 800 | Nombre de empresa en su tarjeta, totales del historial |
| `amount` | 36 / 44 px, `-0.02em` (`amount-sm`: 32 / 40 px en móvil) | 800 | Total del simulador |
| `body` | 16 / 24 px | 400 | Texto y campos |
| `body-medium` | 16 / 24 px | 500 | Botones, datos destacados |
| `small` | 14 / 20 px | 400–500 | Texto secundario, tarjetas, tabla |
| `label` | 14 / 20 px, `0.01em` | 600 | Etiquetas de campos, enlaces de acción |
| `caption` | 12 / 16 px, `0.02em` | 600 | Pastillas, cabeceras de tabla y de datos (en mayúsculas) |

- Todos los importes llevan `font-variant-numeric: tabular-nums`: las cifras no bailan al mover el slider.
- Sin cursivas. La jerarquía se marca con tamaño y peso.

### Espaciado, tamaños y radios

- Espaciado en múltiplos de 4 px: 4, 8, 12, 16, 24, 32, 48.
- Contenedor de página: máximo 1280 px, centrado. Márgenes laterales de 16 px en móvil, 24 px en tablet y 48 px en escritorio.
- Separación entre tarjetas: 24 px.
- Altura de controles (campos, botones, selectores): 44 px. Botón "Guardar simulación": 48 px.
- Cabecera: 64 px de alto; 48 px en móvil.
- Radios: tarjetas y paneles 12 px; campos 8 px; caja de error de un campo 6 px; botones y pastillas, píldora (`9999px`).
- Bordes de 1 px. Sin sombras en ningún sitio.
- Relleno de las tarjetas: 32 px en escritorio, 24 px en tablet y 16 px en móvil.

### Puntos de corte

| Nombre | Ancho | Cambios |
|---|---|---|
| móvil | < 768 px | Una columna; el modal se abre como hoja desde abajo |
| tablet | 768–1023 px | Tarjetas de clientes en 2 columnas |
| escritorio | ≥ 1024 px | Tarjetas en 3 columnas; detalle en rejilla de 12 (simulador 7, historial 5) |

### Iconos

- `lucide-react` (dependencia de `web`): sin peticiones externas, y solo entran en el build los iconos que se usan. Un componente `Icon` los envuelve para fijar tamaño y `aria-hidden`. Tamaños: 16, 18, 20 y 24 px.
- Los que hacen falta: buscar, añadir, correo, flecha a la derecha y a la izquierda, desplegable, sol, luna, aviso, error, correcto, cerrar, información, ajustes (simulador), historial, guardar y globo (país).
- Los iconos decorativos llevan `aria-hidden="true"`. Los botones de solo icono, un `aria-label`.

## 2. Estructura común

### Cabecera

- Fija arriba, 64 px (48 px en móvil), fondo `--color-surface` y borde inferior `--color-border`.
- Izquierda: "SaaS-O-Matic" en `title-md` y `--color-link`, enlace a `/`.
- Derecha, separados 16 px:
  - Selector de divisa: `<select>` de 44 px, radio 8 px, borde `--color-input-border`, `label`. Opciones con símbolo: "EUR (€)", "USD ($)", "GBP (£)", "CHF (Fr.)", "SEK (kr)", "PLN (zł)". En móvil solo el código.
  - Botón de tema: círculo de 44 px, solo icono (luna en claro, sol en oscuro), color `--color-text-muted`; al pasar el ratón, fondo `--color-bg`.

### Aviso global (tipos de cambio)

- Franja a todo el ancho bajo la cabecera, fondo `--color-warning-soft`, texto `--color-warning`, `small` en peso 500, 8 px de alto de relleno.
- Icono de aviso + texto a la izquierda; "Reintentar" a la derecha, como enlace subrayado en `label`.
- En móvil, el texto puede ocupar dos líneas y "Reintentar" se queda a la derecha.

### Pie

- Fondo `--color-surface`, 24 px de relleno, centrado, `small` en `--color-text-muted`: "Tipos de cambio del {fecha}. Fuente: ExchangeRate-API" (con enlace).

### Foco

- Contorno de 2 px en `--color-link`, separado 2 px (`outline-offset: 2px`), en todo lo que se puede usar con teclado. Nunca `outline: none` sin sustituto.

## 3. Componentes base

| Componente | Aspecto |
|---|---|
| Botón principal | Píldora de 44 px, relleno lateral 24 px, fondo `--color-primary`, texto `--color-on-primary` en `body-medium`; hover `--color-primary-hover`; desactivado al 50 % de opacidad y sin cursor de mano |
| Botón secundario | Píldora de 44 px, borde 1 px `--color-input-border`, texto `--color-text`; hover fondo `--color-bg` |
| Botón de peligro | Como el principal, fondo `--color-danger`; solo para "Reintentar" en un error |
| Botón suave | Píldora de 44 px, fondo `--color-primary-soft`, texto `--color-link` (p. ej., "Limpiar búsqueda") |
| Enlace de acción | `label` en `--color-link` con flecha; hover subrayado |
| Pastilla | Píldora de 24–28 px de alto, relleno lateral 12 px, `caption` |
| Campo | 44 px, relleno 12 × 16 px, radio 8 px, borde 1 px `--color-input-border`, fondo `--color-surface`, `body`. Etiqueta encima en `label`, separada 6 px |
| Campo con sufijo | Como el campo, con la unidad dentro a la derecha en `caption` y `--color-text-muted` ("usuarios", "GB", "/ mes") |
| Campo numérico | Sin las flechas del navegador (`appearance: textfield` y sin `::-webkit-inner-spin-button`), en `global.css` |
| Campo con error | Borde 2 px `--color-danger` e icono de error dentro, a la derecha. Debajo, a 6 px, caja de radio 6 px con fondo `--color-danger-soft`, icono de aviso y el mensaje en `caption` `--color-danger`. Enlazada con `aria-describedby` y `aria-invalid="true"` |
| Aviso en línea | Caja de radio 12 px, borde 1 px del color del tipo al 20 %, relleno 16 px, icono + texto en `small` 500. Variantes: éxito (con botón cerrar), error (con "Reintentar") e información |

Pastillas de plan:

| Plan | Fondo | Texto |
|---|---|---|
| Basic | `--color-bg` | `--color-text-muted` |
| Pro | `--color-primary-soft` | `--color-link` |
| Enterprise | `--color-success-soft` | `--color-success` |

Pastilla de país: fondo `--color-bg`, texto `--color-text-muted`, con el código en negrita y el nombre: "**ES** España". Sin banderas: son emojis y Windows no los dibuja.

## 4. Dashboard

### Cabecera de la página

- Izquierda: "Clientes" en `title-lg` y debajo "Alta de clientes y simulación de su coste mensual." en `small` `--color-text-muted`.
- Derecha (en móvil, debajo y a todo el ancho): buscador y "Nuevo cliente".
  - Buscador: campo de 44 px con la lupa dentro, a la izquierda; mínimo 340 px de ancho en escritorio.
  - "Nuevo cliente": botón principal con el icono de añadir. En móvil, botón redondo de 44 px solo con el icono.
- La fila del buscador y "Nuevo cliente" es **fija** (`sticky`) justo debajo de la cabecera: fondo `--color-bg`, borde inferior `--color-border` y 12 px de relleno vertical. El título queda fuera de lo fijo.
- Bajo la rejilla de tarjetas, la paginación del historial (sección 6), centrada, con 32 px de margen superior.

### Tarjeta de cliente

- Tarjeta de 12 px, borde `--color-border`, relleno 24 px. Hover: borde `--color-input-border`.
- Fila 1: pastilla de país a la izquierda, pastilla de plan a la derecha.
- Nombre de la empresa en `title-sm`, a 16 px.
- "NIF:" en `small` `--color-text-muted` y el identificador en `--color-text` 500.
- Separador y, a 16 px, el email con icono de correo (cortado con `…` si no cabe).
- Separador y "Ver detalle y simular →" como enlace de acción.
- Toda la tarjeta es un enlace (un solo `<a>`), no solo el texto del final.

### Estados

Todos centrados en un panel de 12 px de radio, máximo 576 px de ancho, relleno 48 px:

| Estado | Icono | Título | Texto | Acción |
|---|---|---|---|---|
| Cargando | Indicador giratorio (48 px, borde de 4 px en `--color-primary`) | "Cargando clientes…" | — | — |
| Vacío | Edificio en círculo `--color-primary-soft` | "Aún no hay clientes." | "Da de alta el primero para empezar a simular." | Botón principal "Nuevo cliente" |
| Sin resultados | Lupa en círculo `--color-bg` | "Ningún cliente coincide con «{texto}»." | "Revisa el nombre o el identificador fiscal." | Botón suave "Limpiar búsqueda" |
| Error | Nube tachada, sobre fondo `--color-danger-soft` | "No se pudieron cargar los clientes." | "Comprueba tu conexión e inténtalo de nuevo." | Botón de peligro "Reintentar" |

- Con `prefers-reduced-motion`, el indicador no gira: solo se ve el texto.

## 5. Modal "Nuevo cliente"

- Fondo de la página: `--color-scrim` sobre todo, sin desenfoque.
- Escritorio y tablet: centrado, máximo 512 px de ancho, tarjeta de 12 px, relleno 32 px, borde `--color-border`.
- Móvil: hoja desde abajo, a todo el ancho, esquinas superiores de 16 px, con scroll propio.
- Cabecera: "Nuevo cliente" en `title-md`, debajo "Datos fiscales y de contacto del cliente." en `small` muted, y botón cerrar (círculo de 44 px) a la derecha. Separador.
- Campos, en este orden y a 16 px entre ellos:
  1. Nombre de la empresa.
  2. País: desplegable con los 28 países de la tabla de IVA como "España (ES)". El país va antes que el identificador porque este se valida según el país.
  3. Identificador fiscal (NIF / CIF), con su error como "Campo con error".
  4. Email.
  5. Plan: tres opciones en una fila (Basic, Pro, Enterprise), cada una de 44 px, radio 8 px, borde `--color-input-border`. La elegida: borde `--color-primary`, fondo `--color-primary-soft` y texto `--color-link`. Es un grupo de botones de opción (`<fieldset>` con `<legend>` "Plan" e `<input type="radio">`): se usa con las flechas del teclado.
- Pie: separador y, a la derecha, "Cancelar" (secundario) y "Guardar cliente" (principal; "Guardando…" y desactivado mientras envía). En móvil, los dos botones al 50 %.

## 6. Detalle del cliente

- "← Clientes" como enlace de acción, arriba.
- Avisos de la página (simulación guardada, error al guardar) entre la tarjeta del cliente y la rejilla.

### Tarjeta del cliente

- Fila 1: iniciales del nombre en un cuadrado de 48 px, radio 12 px, fondo `--color-primary-soft`, texto `--color-link` en `title-md`; el nombre en `title-lg` (en `<h1>`); la pastilla del plan.
- Separador y una rejilla de datos: 4 columnas en escritorio, 2 en tablet y 1 en móvil. Cada dato: etiqueta en `caption` mayúsculas `--color-text-muted` y valor en `body-medium`.
  - NIF / CIF · País (con icono de globo) · Email (enlace `mailto:`) · Fecha de alta ("14 de enero de 2024").

### Simulador

- Cabecera de la tarjeta: icono de ajustes en `--color-link` + "Simulador" en `title-md`, y separador.
- **Usuarios**: etiqueta "Usuarios" a la izquierda y "Slider de 1 a 500" en `caption` muted a la derecha. Debajo, en escritorio y tablet, el slider (8/12) y el campo numérico con sufijo "usuarios" (4/12); en móvil, el campo arriba y el slider debajo.
- Marcas bajo el slider: 1, 250 y 500, en `caption` muted.
- **Almacenamiento (GB)** y **Llamadas a la API / mes**: dos campos con sufijo ("GB", "/ mes"), en dos columnas (una en móvil).
- Nota informativa: caja `--color-primary-soft`, radio 8 px, icono de información y "Almacenamiento y llamadas son **informativos**: no cambian el precio." en `small`.
- **Caja del precio**: radio 12 px, fondo `--color-primary-soft`, borde `--color-border`, relleno 24 px.
  - "Base" y su importe; "IVA ({porcentaje} %)" y su importe. Etiquetas en `small` 500 muted, importes en `body-medium`.
  - Separador.
  - Izquierda: "TOTAL MENSUAL" en `caption`. Derecha: el total en `amount` y "/ mes" en `body` muted. En otra divisa: "≈ {importe} / mes" en `label` `--color-link` y, debajo, el importe en euros en `caption` muted.
  - Recalculando: la caja al 50 % de opacidad, con una transición de 150 ms.
  - Error: la caja se sustituye por un aviso en línea de error con "No se pudo calcular el precio." y "Reintentar".
- Botón "Guardar simulación": principal, 48 px, con icono de guardar, a la derecha (a todo el ancho en móvil).

### Slider

- `<input type="range">` nativo con estilos propios (`::-webkit-slider-*` y `::-moz-range-*`).
- Pista de 6 px, píldora, fondo `--color-border`. La parte recorrida en `--color-primary` (en oscuro, `--color-link`), con un degradado que usa `--fill` como porcentaje, puesto por el componente.
- Tirador de 28 px, círculo `--color-primary` (en oscuro, `--color-link`), borde de 2 px `--color-surface`. Zona para arrastrar de 48 px.
- Con foco, el contorno común.

### Historial

- Cabecera: icono de historial + "Historial" en `title-md`, y "{n} simulaciones" en `caption` muted a la derecha. Separador.
- **Una lista en todos los anchos** (sin tabla), filas separadas por `--color-border` y 12 px de alto de relleno:
  - Fila 1: fecha en `small` 500 a la izquierda; total en `title-sm` a la derecha.
  - Fila 2, en `caption` muted: "15 usuarios · 250 GB · 50.000 / mes" a la izquierda; "Base 140,00 € · IVA (21 %) 29,40 €" a la derecha (en móvil, debajo).
  - A la derecha de la fila 2, el botón "Enviar": suave, 44 px de alto, con el icono de correo (en móvil, a todo el ancho debajo).
  - Junto a "Enviar", el botón "Archivar": secundario, 44 px de alto, con el icono `Archive` de lucide. En archivadas, en su lugar: "Archivada el {fecha}" en `caption` muted y el botón secundario "Recuperar" con el icono `ArchiveRestore`.
- Bajo la cabecera, a la izquierda: "Activas" y "Archivadas" como dos botones juntos (el elegido, suave; el otro, secundario).
- El aviso de "Simulación archivada." con "Deshacer" usa `InlineAlert` (éxito) sobre la lista.
- **Paginación** bajo la lista, centrada: botón secundario "Anterior", "Página 1 de 3" en `caption` muted y botón secundario "Siguiente"; desactivados en los extremos. Solo con más de 5 simulaciones.
- Recargando tras guardar: la lista al 50 % de opacidad, como el precio del simulador.
- Vacío: panel con borde discontinuo `--color-border`, radio 12 px, icono de carpeta y "Todavía no hay simulaciones guardadas." en `body-medium`, con "Mueve el slider y pulsa «Guardar simulación»." debajo en `small` muted.
- Los importes del historial se convierten igual que los del simulador (sección 4 de `../01-specs/02-interfaz.md`).

### Detalle compacto en escritorio

Para que el detalle quepa en 1280 × 800 px sin scroll (`02-interfaz.md`, sección 6), desde `lg`:
- Márgenes verticales de la página de 24 px (en vez de 48).
- Las tarjetas del detalle con 24 px de relleno (en vez de 32).
- Tarjeta del cliente en una sola fila: iniciales, nombre (`title-md`) y plan a la izquierda; NIF, país, email y fecha de alta a la derecha, sin separador.
- Simulador: usuarios a todo el ancho; almacenamiento y llamadas en una fila; la nota informativa en una línea; la caja del precio con 16 px de relleno; el total en `amount-sm`.
- Caja del precio: base e IVA apilados a la izquierda (ocupan lo que sobra) y el total a la derecha (ocupa lo que necesita), separados por un borde vertical `--color-border`. Nunca tres columnas iguales: en otra divisa el total no cabría.
- Separación de 16 px entre bloques del simulador (en vez de 24).

### Cliente no encontrado

- Panel centrado como los estados del Dashboard: icono de persona tachada, "Cliente no encontrado." en `title-lg` y el enlace "← Volver a clientes".

## 7. Tema oscuro

- Mismos componentes y medidas. Solo cambian los valores de las variables (`../01-specs/02-interfaz.md`, sección 7).
- Todo lo que en claro es texto o icono azul (`--color-link`) pasa a `#8787F4`. Los botones mantienen `#4040E3` con texto blanco.
- El slider usa `--color-link` en la parte recorrida y en el tirador.
- El fondo del modal usa `--color-scrim` (`#0D0D1A` al 50 % en claro, `#000000` al 60 % en oscuro). No vale el color del texto: en oscuro es claro.
- La maqueta no tiene versión oscura: se revisa en la app con la lista de la sección 11 de `../01-specs/02-interfaz.md`.

## 8. Lo que no se toma de la maqueta

Elementos de Stitch que la app no tiene o que contradicen la spec:

- En las tarjetas: "48 usuarios" (un cliente no tiene usuarios; los tiene cada simulación), "ID: #CL-091", "Volumen contratado", "Contrato al día", "Renovación Q3" y "Cuenta VIP prioritaria".
- La barra "Estados de vista" y cualquier control de demostración.
- Restos en el HTML: "Editar cliente", "Exportar", "CRM" y "Alternar".
- La flecha de volver en la cabecera del Dashboard en móvil.
- Textos inventados: "Gestión de carteras, contratos y simulaciones de facturación B2B", "B2B Core", "asientos", "licencia", "microservicio de cotizaciones", "servidor de facturación corporativa", "Ingresa los parámetros fiscales para tarifar las licencias".
- La lista de países del modal ("Reino Unido (UK)", "Estados Unidos (US)", "Suiza (CH)"): se usan los 28 de la tabla de IVA (Reino Unido es `GB`; Estados Unidos y Suiza no están). El cliente de ejemplo "Helvetia Cloud AG" (Suiza) no se podría dar de alta.
- Las banderas en emoji.
- "15 usuarios" en azul en la primera fila del historial (parece un enlace).
- El desenfoque de la cabecera y del fondo del modal.
- La paleta del principio de `DESIGN.md` (`primary: #231ccd`…) y su borde de campos en oscuro `#44464F`, que no llega a 3:1. Mandan las variables de `../01-specs/02-interfaz.md`.

## 9. Cómo se lleva a Tailwind

Todo va en el `@theme` de `styles/tokens.css` (ADR-008):

| Escala | Variables del tema | Clases |
|---|---|---|
| Colores | `--color-bg`, `--color-surface`, `--color-link`… (tabla de `02-interfaz.md`) | `bg-surface`, `text-link`, `border-input-border`… |
| Tipografía | `--text-title-lg: 28px` con `--text-title-lg--line-height: 36px`, y así cada nivel de la sección 1 | `text-title-lg`, `text-amount`, `text-caption`… El total: `text-amount-sm lg:text-amount` |
| Fuente | `--font-sans: "Montserrat Variable", sans-serif` | por defecto en todo |
| Radios | `--radius-card: 12px`, `--radius-field: 8px`, `--radius-note: 6px` | `rounded-card`, `rounded-field`, `rounded-note`, `rounded-full` |
| Espaciado | el de Tailwind (múltiplos de 4 px) | `p-4`, `gap-6`… |
| Puntos de corte | los de Tailwind: `md` = 768 px, `lg` = 1024 px | `md:grid-cols-2 lg:grid-cols-3` |

- Lo que no tiene clase (el slider con `::-webkit-slider-thumb`, el `--fill`) va en `global.css`, usando las mismas variables.
- `tabular-nums` es una clase de Tailwind: se pone en cada importe.

## 10. Cambios aplicados en `../01-specs/02-interfaz.md`

- Tarjetas: 2 columnas desde 768 px (antes 640 px), como la maqueta.
- Alta: el país antes que el identificador; el plan como grupo de tres opciones; en móvil, hoja desde abajo.
- "Sin resultados" con el botón "Limpiar búsqueda".
- Pastilla de país sin bandera.
- Iconos con `lucide-react`.
- Variable nueva `--color-scrim` para el fondo del modal.

## 11. Capturas

| Archivo | Qué muestra |
|---|---|
| `screens/dashboard-escritorio.png` | Dashboard en escritorio, tema claro, con el aviso de divisas |
| `screens/detalle-escritorio.png` | Detalle del cliente en escritorio: simulador e historial |
| `screens/alta-movil.png` | Modal de alta en móvil, con el error del identificador fiscal |
| `screens/detalle-movil.png` | Detalle del cliente en móvil |

- Son de la segunda versión de Stitch. Las fuentes de las capturas no son Montserrat (el HTML no la cargaba) y la de móvil del Dashboard sale sin estilos de fondo: valen para la estructura, no para la tipografía.
- No hay capturas del tema oscuro ni de los estados: se definen aquí y en `../01-specs/02-interfaz.md`.

## Registro de cambios

- v0.1: escalas, componentes, vistas y tema oscuro a partir de la maqueta de Stitch (segunda versión), con lo que no se toma; `lucide-react`, 2 columnas desde 768 px, `--color-scrim` y cómo se lleva a Tailwind.
- v0.2: `amount-sm` (32 / 40 px) para el total en móvil, para no escribir el tamaño a mano.
- v0.3: historial como lista en todos los anchos, con paginación y botón "Enviar"; detalle compacto en escritorio; campos numéricos sin flechas.
