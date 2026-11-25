# 02 Interfaz (frontend)

Documento vivo. Qué muestra cada vista, qué puede hacer el comercial, sus estados (carga, vacío, error) y el estilo. Cómo se ve cada pieza (medidas, componentes, textos) está en `../04-design/00-diseno.md`, con las capturas de la maqueta. El contrato con la api está en `../02-architecture/openapi.yaml`; las reglas de negocio, en `00-analisis.md` y `01-casos-de-uso.md`.

Principio: **el frontend casi no tiene lógica**. No calcula precios ni valida reglas de negocio: pide los datos a la api, los muestra y convierte la divisa solo para mostrarla (ADR-004, ADR-007).

## 1. Stack

- React + Vite + TypeScript, en `web/`, dentro del monorepo de pnpm.
- `react-router` para las dos vistas. Sin librería de estado ni de peticiones: `fetch` y hooks propios (ADR-007).
- Estilos: Tailwind CSS v4, con el tema (colores de los dos temas y escalas) en `styles/tokens.css` (ADR-008).
- Tipografía Montserrat, servida por el propio build (`@fontsource-variable/montserrat`): sin peticiones a Google.
- Iconos con `lucide-react`: también van en el build.
- Tests con Vitest solo para la lógica pura (sección 9).

## 2. Configuración

| Variable | Dónde | Por defecto | Para qué |
|---|---|---|---|
| `VITE_API_URL` | web | `http://localhost:3000` | URL de la api |
| `CORS_ORIGINS` | api | `http://localhost:5173` | Orígenes que pueden llamar a la api, separados por comas (sección 10) |
| `TRUST_PROXY` | api | `0` | Proxies delante de la api; `1` en el VPS (sección 10) |

## 3. Rutas

| Ruta | Vista |
|---|---|
| `/` | Dashboard: buscador, tarjetas de clientes y alta |
| `/customers/:id` | Detalle del cliente: datos, simulador e historial |
| cualquier otra | "Página no encontrada", con enlace a `/` |

## 4. Cabecera (en todas las vistas)

- A la izquierda, "SaaS-O-Matic" (Montserrat 800), que enlaza a `/`. Sin logo de Roams.
- A la derecha, el selector de divisa y el selector de tema.
- En móvil se mantiene en una sola fila; el nombre puede reducirse.
- Alto: **48 px en móvil** (< 768 px) y 64 px desde tablet. Los controles siguen midiendo 44 px. El contenido empieza justo debajo, con el mismo alto.

### Selector de divisa

- Divisas: EUR, USD, GBP, CHF, SEK, PLN. Solo se muestran las que vengan en la respuesta de la api de divisas.
- Por defecto, EUR. La elección dura mientras la app está abierta (no se guarda).
- Afecta a todos los importes de la app a la vez (estado global en un contexto de React).

### Tipos de cambio

- `GET https://open.er-api.com/v6/latest/EUR`, **una sola vez** al cargar la app.
- Respuesta válida: `result === "success"` y un objeto `rates`. Se usan `rates` y `time_last_update_utc`.
- Estados:
  - **Cargando:** selector desactivado con el texto "Cargando divisas…". Los importes se muestran en EUR.
  - **Error** (red, HTTP no 2xx, `result` distinto de `"success"` o JSON no válido): aviso no bloqueante bajo la cabecera, "No se pudieron cargar los tipos de cambio. Los importes se muestran en euros.", con botón "Reintentar". Selector desactivado en EUR.
  - **Listo:** selector activo. En el pie: "Tipos de cambio del {fecha}. Fuente: ExchangeRate-API", con enlace a `https://www.exchangerate-api.com` (su acceso abierto exige atribución).

### Cómo se muestra un importe

- La api devuelve céntimos de euro. Conversión: `céntimos / 100 × tipo`. Se redondea solo al formatear.
- Formato con `Intl.NumberFormat('es-ES', { style: 'currency', currency })`: `169,40 €`, `183,12 US$`.
- En una divisa distinta de EUR, el importe va precedido de `≈` y debajo, en pequeño, el importe en euros: es el que se guarda y el que vale para presupuestar.
- Entre `≈` y el número va un espacio que no se parte (`\u00a0`): nunca quedan en líneas distintas.
- **Importes secundarios** (la base y el IVA de cada fila del historial): en una sola línea, con `≈` y sin el importe en euros debajo. El total de la fila sí lo lleva.
- Ningún importe se corta ni se sale de su caja: si no cabe, "/ mes" y los euros bajan de línea.

### Selector de tema

- Botón con icono (sol / luna) y `aria-label` "Cambiar a tema oscuro" o "Cambiar a tema claro".
- Primera visita: sigue el tema del sistema (`prefers-color-scheme`).
- Al pulsarlo, cambia el tema y lo guarda en `localStorage` (`saas-o-matic-theme`: `light` | `dark`). Desde entonces manda lo guardado.
- Si `localStorage` no está disponible o tiene un valor raro, se sigue al sistema y no falla.
- El tema se aplica como `data-theme="light|dark"` en `<html>`. Un script mínimo en `index.html` lo pone **antes** de que pinte React, para que no haya un destello claro al cargar en oscuro.

## 5. Dashboard (`/`)

### Buscador

- Un solo campo: "Buscar por nombre o identificador fiscal". Llama a `GET /customers?search=` 300 ms después de la última tecla.
- Cada búsqueda cancela la anterior (`AbortController`): una respuesta antigua nunca pisa a una nueva.
- Vacío = todos los clientes, los más recientes primero (lo ordena la api).
- **Fijo arriba:** la barra con el buscador y "Nuevo cliente" se queda pegada justo debajo de la cabecera al hacer scroll, con fondo y borde inferior. El título "Clientes" no es fijo: sube con el scroll.
- En móvil, "Nuevo cliente" es un botón redondo solo con el icono "+" (`aria-label` "Nuevo cliente"), al lado del buscador, para que la barra fija ocupe una sola fila.

### Tarjetas de clientes

- Rejilla: 1 columna en móvil (< 768 px), 2 en tablet (768–1023 px), 3 en escritorio (≥ 1024 px).
- Cada tarjeta: país (código y nombre en español, sin bandera), plan (pastilla), nombre de la empresa, identificador fiscal y email.
- Toda la tarjeta es un enlace al detalle, accesible con teclado.
- **Paginación de 6 en 6**, en el front (la api devuelve todos), con el mismo componente que el historial: "Anterior", "Página {n} de {total}" y "Siguiente". Solo con más de 6. Al cambiar la búsqueda, se vuelve a la página 1. Al cambiar de página, la vista sube al principio de la lista.
- Por qué en el front: es una herramienta interna con decenas de clientes. Con miles, se paginaría en la api (`?page=&limit=`); está en las mejoras futuras.

### Estados de la lista

| Estado | Qué se ve |
|---|---|
| Cargando | "Cargando clientes…" (sin parpadeo si tarda menos de 200 ms) |
| Vacío, sin búsqueda | "Aún no hay clientes." y botón "Nuevo cliente" |
| Vacío, con búsqueda | "Ningún cliente coincide con «{texto}»." y botón "Limpiar búsqueda" |
| Error | "No se pudieron cargar los clientes." y botón "Reintentar" |

### Alta de cliente (modal)

- Botón "Nuevo cliente" junto al buscador. Abre un `<dialog>` nativo: se cierra con Escape o "Cancelar", y el foco va al primer campo.
- Campos, en este orden: nombre de la empresa, país (desplegable con los 28 países de la tabla de IVA, como "España (ES)"), identificador fiscal, email y plan (Basic, Pro y Enterprise, como grupo de tres botones de opción). El país va antes que el identificador porque este se valida según el país.
- En móvil (< 768 px), el modal se abre como hoja desde abajo.
- En el front solo se comprueba que los campos estén rellenos (`required`) y el tipo `email`. Las reglas de verdad las aplica la api.
- Mientras se envía: botón "Guardando…" desactivado (no hay doble envío).
- Errores de la api:

| Respuesta | Dónde | Mensaje |
|---|---|---|
| 400 `INVALID_TAX_ID` | bajo el identificador fiscal | "El identificador fiscal no es válido para ese país." |
| 400 `COUNTRY_NOT_SUPPORTED` | bajo el país | "No hay IVA definido para ese país." |
| 400 `VALIDATION_ERROR` | arriba del formulario | el `message` de la api |
| 409 `TAX_ID_ALREADY_EXISTS` | bajo el identificador fiscal | "Ya existe un cliente con ese identificador fiscal." |
| 429 `RATE_LIMITED` | arriba del formulario | "Demasiadas peticiones. Espera un momento y vuelve a intentarlo." |
| 500 o sin conexión | arriba del formulario | "No se pudo guardar. Inténtalo de nuevo." |

- Al crear: se cierra el modal y se navega al detalle del cliente nuevo.
- La lista de países es una copia de presentación de la tabla del dominio (código + nombre). Si un día no coinciden, la api responde `COUNTRY_NOT_SUPPORTED` y el formulario lo muestra: la api sigue mandando.

## 6. Detalle del cliente (`/customers/:id`)

- Enlace "← Clientes" arriba.
- Escritorio (≥ 1024 px): datos del cliente a todo el ancho; debajo, simulador a la izquierda e historial a la derecha. Móvil y tablet: todo en una columna, en ese orden.
- **En escritorio, el detalle cabe en una pantalla:** con una ventana de 1280 × 800 px, los datos del cliente, el simulador entero (con el botón de guardar) y el historial se ven sin scroll vertical. El pie puede quedar por debajo. Para eso el detalle es más compacto que el Dashboard (`04-design`, sección 6).
- Si la api responde 404 o 400: "Cliente no encontrado." con enlace a `/`.

### Datos del cliente (tarjeta)

- Nombre, identificador fiscal, email, país, plan y fecha de alta (`es-ES`, hora local).

### Simulador (tarjeta)

- Usuarios: slider de 1 a 500 y, al lado, un campo numérico de 1 a 100 000, sincronizados. Por encima de 500, el slider se queda al final y manda el campo.
- Almacenamiento (GB) y llamadas a la API al mes: campos numéricos opcionales, enteros ≥ 0, vacíos = 0. Se indica que son informativos y no cambian el precio.
- Resultado en vivo: base, IVA (con su porcentaje, a partir de `vatRateBasisPoints`) y total, en la divisa elegida. El total, destacado y con `aria-live="polite"`.
- En escritorio, la caja del precio tiene dos zonas: base e IVA uno debajo del otro a la izquierda, y el total a la derecha, con el ancho que necesite. Así cabe también en otra divisa, que ocupa dos líneas.
- Llama a `POST /simulations/preview` 250 ms después del último cambio en usuarios, cancelando la petición anterior. Almacenamiento y llamadas no disparan el preview: no cambian el precio.
- Si el campo de usuarios está vacío o fuera de 1–100 000: no se llama a la api y se muestra "Entre 1 y 100 000 usuarios".
- Estados:
  - **Primera carga:** "Calculando…".
  - **Recalculando:** se mantiene el último resultado, atenuado. Sin parpadeos.
  - **Error:** "No se pudo calcular el precio." con "Reintentar". Los campos siguen editables. Si es un 429, el mensaje de la sección 10.
- Botón "Guardar simulación": `POST /simulations` con usuarios, almacenamiento y llamadas. Mientras guarda, desactivado ("Guardando…"). Al guardar: "Simulación guardada" y el historial se vuelve a pedir y vuelve a la página 1. Si falla: mensaje junto al botón (un 429, con el de la sección 10).
- **Sin duplicados:** si en el historial (solo las activas, no las archivadas) ya hay una simulación con los mismos usuarios, almacenamiento y llamadas, el botón se desactiva y debajo pone "Ya hay una simulación guardada con estos valores.". Se compara con todo el historial, no solo con la página que se ve. El precio solo depende de esos valores y del IVA del país, así que repetirla no aporta nada. Es una regla del front: la api sigue aceptando duplicados (supuesto de `00-analisis.md`).
- Los campos numéricos no muestran las flechas del navegador para subir y bajar. Las flechas del teclado siguen funcionando.

### Historial (tarjeta)

- `GET /customers/:id/simulations`, las más recientes primero.
- **Una lista, en todos los anchos** (no una tabla): cada simulación es una fila compacta con la fecha y el total arriba, y debajo los usuarios, GB, llamadas, base e IVA. Así nunca hay scroll lateral, también con importes en otra divisa, que ocupan dos líneas.
- **Paginación de 5 en 5**, en el front (la api devuelve todas). Debajo de la lista: "Anterior", "Página {n} de {total}" y "Siguiente"; los botones se desactivan en la primera y en la última página. Con 5 o menos, no se muestra. Al guardar una simulación se vuelve a la página 1.
- **Botón "Enviar" en cada simulación:** un enlace `mailto:` al email del cliente que abre el programa de correo con el asunto y el cuerpo ya escritos (texto plano, el formato está en la sección 6 bis). No pasa por la api.
- Importes en la divisa elegida, con la misma regla de la sección 4.
- Estados: "Cargando historial…", vacío "Todavía no hay simulaciones guardadas.", error con "Reintentar". Al recargar después de guardar, la lista se mantiene a la vista (atenuada) en vez de cambiar a "Cargando historial…".
- **Activas y archivadas:** en la cabecera, dos botones "Activas" y "Archivadas" (con `aria-pressed`). Por defecto, "Activas". Las archivadas se piden (`?archived=true`) solo al abrir esa vista, y otra vez cada vez que se abre. Al cambiar de vista se vuelve a la página 1 y se quita el aviso. El contador "{n} simulaciones" es el de la vista abierta. Vacío en archivadas: "No hay simulaciones archivadas.".
- **Archivar:** en cada simulación activa, un botón "Archivar" junto a "Enviar" (`aria-label` "Archivar la simulación del {fecha}"). Archiva al momento, sin confirmación: el botón se desactiva mientras tanto y, al terminar, sobre la lista sale "Simulación archivada." con el botón "Deshacer", que la recupera. El aviso se queda hasta que se cierra, se archiva otra o se cambia de vista. Después se vuelve a pedir el historial, sin volver a la página 1 (si la página se queda vacía, `paginate` pasa a la anterior).
- **Recuperar:** en la vista "Archivadas", cada simulación muestra "Archivada el {fecha}" en lugar de "Enviar" y un botón "Recuperar". Al terminar: "Simulación recuperada." y se vuelven a pedir las dos listas.
- Si archivar o recuperar falla: "No se pudo archivar la simulación. Inténtalo de nuevo." o "No se pudo recuperar la simulación. Inténtalo de nuevo." en el mismo sitio. Un 429, con el mensaje de la sección 10.

### 6 bis. Correo de una simulación

- **Para:** el email del cliente.
- **Asunto:** `Simulación de SaaS-O-Matic para {nombre de la empresa}`
- **Cuerpo** (texto plano, líneas separadas con CRLF, todo codificado con `encodeURIComponent`):

```
Hola,

Te envío la simulación del coste mensual de vuestra suscripción:

Fecha: {fecha, es-ES}
Usuarios: {usuarios}
Almacenamiento: {GB} GB (informativo)
Llamadas a la API: {llamadas} / mes (informativo)

Base: {base en EUR}
IVA ({porcentaje}): {IVA en EUR}
Total mensual: {total en EUR}

Un saludo
```

- Los importes van siempre en euros, que es lo que se factura. Si en la app está elegida otra divisa, debajo del total va una línea más: `Equivale a ≈ {total convertido} al tipo de cambio del {fecha de los tipos}.`
- Se construye con una función pura de `lib/` (sección 9).

## 7. Estilo

Basado en la identidad visual de Roams (roams.es, revisada el 22/11/2026): azul `#4040E3`, Montserrat, tarjetas blancas con bordes redondeados y mucho aire. Se toman sus colores y su tipografía; no su logo.

### Variables (todas en `styles/tokens.css`)

Son el tema de Tailwind: cada `--color-x` da las clases `bg-x`, `text-x` y `border-x`. Ningún componente escribe un color a mano: ni `bg-[#…]` ni la paleta por defecto de Tailwind, que está desactivada (ADR-008).

| Variable | Claro | Oscuro |
|---|---|---|
| `--color-bg` | `#F2F2F7` | `#0D0D1A` |
| `--color-surface` | `#FFFFFF` | `#1A1A2E` |
| `--color-border` | `#EEF0F6` | `#44464F` |
| `--color-text` | `#0D0D1A` | `#F5F7FB` |
| `--color-text-muted` | `#4A4D56` | `#BABDC6` |
| `--color-primary` (botones) | `#4040E3` | `#4040E3` |
| `--color-primary-hover` | `#1515DD` | `#3838EC` |
| `--color-on-primary` | `#FFFFFF` | `#FFFFFF` |
| `--color-link` (texto azul) | `#4040E3` | `#8787F4` |
| `--color-primary-soft` | `#F1F1FE` | `#1C1C3A` |
| `--color-success` / `-soft` | `#047857` / `#E8F8EE` | `#0CB001` / `#0F2A1C` |
| `--color-warning` / `-soft` | `#8A5A00` / `#FFF3E0` | `#FF9F00` / `#2C2410` |
| `--color-danger` / `-soft` | `#B00038` / `#FDE7ED` | `#FF5A7A` / `#2E0F19` |
| `--color-input-border` | `#83868F` | `#83868F` |
| `--color-scrim` (fondo del modal) | `#0D0D1A` al 50 % | `#000000` al 60 % |

- Origen: los tokens de roams.es (`--p-lavanda-*`, `--p-neutral-*`, `--p-feedback-*`, incluidos sus `*-soft-dark`). `--color-surface` y `--color-primary-soft` del tema oscuro son propuesta propia.
- En oscuro, el azul de marca como texto no se lee (2,5:1): por eso existe `--color-link`.
- Contraste comprobado para todo par texto/fondo (WCAG AA, ≥ 4,5:1). Peor caso: éxito en claro, 5,0:1. `--color-input-border` da 3,6:1 en claro y 4,7:1 en oscuro, por encima del 3:1 que piden los bordes de controles.

### Resto

- Tipografía: Montserrat. Títulos 800, texto 400–500. Base 16 px.
- Radios: tarjetas 12 px, botones en píldora, campos 8 px.
- Espaciado en múltiplos de 4 px.
- Foco visible en todo lo que se puede usar con teclado: contorno de 2 px en `--color-link`.
- Zonas táctiles de 44 px como mínimo.
- Sin sombras: las tarjetas se separan por el fondo y el borde.

## 8. Accesibilidad

- Cada campo con su `<label>`. Los errores se enlazan al campo con `aria-describedby`.
- El total del simulador y los avisos usan `aria-live="polite"`.
- Todo se puede hacer con teclado, incluido el modal.

## 9. Tests

Vitest, solo lógica pura en `web/src/lib/`, con el test antes que el código:

- `money`: conversión de céntimos con un tipo, formato `es-ES` en EUR y en USD, redondeo solo al formatear.
- `theme`: lo guardado manda sobre el sistema; sin nada guardado o con un valor raro, se sigue al sistema.
- `apiClient`: una respuesta de error de la api se convierte en un error con `status` y `code`; un fallo de red, en un error propio.
- `pagination`: páginas de 5, número de páginas, y una página fuera de rango se ajusta a la última válida.
- `duplicates`: una simulación con los mismos usuarios, almacenamiento y llamadas cuenta como guardada; si cambia cualquiera de los tres, no.
- `simulationEmail`: el `mailto:` tiene el destinatario, el asunto y el cuerpo de la sección 6 bis, bien codificados, con y sin la línea de otra divisa.

Sin tests de componentes: se revisan a mano con la lista de la sección 11.

## 10. Cambios necesarios en la api: CORS y límite de peticiones

### CORS

En producción el front (Netlify) y la api (VPS) están en dominios distintos, y el navegador bloquea las peticiones si la api no lo permite.

- La api responde con `Access-Control-Allow-Origin` solo a los orígenes de `CORS_ORIGINS`.
- Métodos `GET`, `POST` y `OPTIONS`; cabecera `Content-Type`.
- Un origen que no está en la lista no recibe la cabecera, y el navegador bloquea la respuesta.
- Nunca `*`.
- Escenarios en `features/cors.feature`.

### Límite de peticiones

La demo se publica con un enlace abierto y la api no tiene login: sin límite, cualquiera podría llenar la BD de clientes falsos o saturar el VPS.

- Por IP: 30 peticiones por minuto en las rutas que escriben (`POST /customers` y `POST /simulations`) y 120 por minuto en todas, incluido el preview. Una escritura cuenta en los dos.
- Al superarlo: 429 `RATE_LIMITED` con la cabecera `Retry-After`. `/health` queda fuera.
- La respuesta 429 lleva las cabeceras CORS, para que el front pueda leerla y mostrar el mensaje.
- En el VPS la api está detrás de un proxy: con `TRUST_PROXY=1` toma la IP real del cliente. Sin proxy se deja en 0, porque si no cualquiera podría cambiar su IP con la cabecera `X-Forwarded-For` y saltarse el límite.
- En el front, cualquier 429 muestra: "Demasiadas peticiones. Espera un momento y vuelve a intentarlo."
- Escenarios en `features/rate-limit.feature`.

## 11. Lista de revisión manual

- Cada estado de las secciones 4, 5 y 6 se ve al menos una vez (para el error, apagando la api o cortando la red en las herramientas del navegador).
- Las dos vistas en 375 px, 768 px y 1280 px de ancho, en claro y en oscuro.
- Recargar en oscuro no da un destello claro.
- Buscar rápido no deja resultados de una búsqueda antigua.
- Mover el slider deprisa lanza pocas peticiones (pestaña Red) y el total final es el del último valor.
- Todo el alta y el guardado de una simulación se pueden hacer solo con teclado.
- A 1280 × 800 px, el detalle de un cliente con 5 o más simulaciones se ve entero sin scroll vertical, y el historial no tiene scroll lateral en ninguna divisa.
- Con 6 simulaciones o más aparece la paginación, y guardar vuelve a la página 1.
- Pulsar "Guardar simulación" dos veces con los mismos valores solo guarda una.
- "Enviar" abre el correo con el destinatario, el asunto y el cuerpo bien escritos (tildes y € incluidos).
- En CHF, a 1280 px: el total del simulador y las filas del historial caben en sus cajas, sin cortes.
- En el dashboard, al hacer scroll, el buscador sigue visible; con más de 6 clientes hay paginación. En 375 px, la cabecera mide 48 px y la barra fija es una sola fila.
- Archivar quita la simulación de "Activas" y "Deshacer" la devuelve. En "Archivadas" se ve con su fecha y "Recuperar" la devuelve a "Activas". Una archivada no bloquea guardar los mismos valores.

## Registro de cambios

- v0.1: vistas, estados, tipos de cambio, alta, simulador, historial, estilo de Roams con tema claro y oscuro, tests de lógica pura y CORS.
- v0.2: fuera MXN; límite de peticiones en la api (429 y su mensaje en el front) y `TRUST_PROXY`.
- v0.3: Tailwind para los estilos (ADR-008); medidas y componentes en `../04-design/00-diseno.md`; 2 columnas desde 768 px; país antes que el identificador; plan como grupo de opciones; modal como hoja en móvil; "Limpiar búsqueda"; país sin bandera; `lucide-react`; `--color-scrim`.
- v0.6: importes en otra divisa sin cortes (`≈` unido, base e IVA del historial en una línea, caja del precio en dos zonas); buscador fijo y paginación de 6 en el dashboard; cabecera de 48 px en móvil.
- v0.5: archivar (con "Deshacer") y recuperar simulaciones, con las vistas "Activas" y "Archivadas" en el historial.
- v0.4: detalle en una pantalla en escritorio; historial como lista en todos los anchos, paginado de 5 en 5 y con botón "Enviar" (`mailto:`); sin duplicados al guardar; campos numéricos sin flechas.
