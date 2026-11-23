# 02 Interfaz (frontend)

Documento vivo. Qué muestra cada vista, qué puede hacer el comercial, sus estados (carga, vacío, error) y el estilo. El contrato con la api está en `../02-architecture/openapi.yaml`; las reglas de negocio, en `00-analisis.md` y `01-casos-de-uso.md`.

Principio: **el frontend casi no tiene lógica**. No calcula precios ni valida reglas de negocio: pide los datos a la api, los muestra y convierte la divisa solo para mostrarla (ADR-004, ADR-007).

## 1. Stack

- React + Vite + TypeScript, en `web/`, dentro del monorepo de pnpm.
- `react-router` para las dos vistas. Sin librería de estado ni de peticiones: `fetch` y hooks propios (ADR-007).
- Estilos: CSS Modules por componente y un único archivo de variables (`styles/tokens.css`). Sin librería de estilos.
- Tipografía Montserrat, servida por el propio build (`@fontsource-variable/montserrat`): sin peticiones a Google.
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

### Tarjetas de clientes

- Rejilla: 1 columna en móvil (< 640 px), 2 en tablet (640–1023 px), 3 en escritorio (≥ 1024 px).
- Cada tarjeta: nombre de la empresa, identificador fiscal, país (nombre en español), plan (pastilla) y email.
- Toda la tarjeta es un enlace al detalle, accesible con teclado.

### Estados de la lista

| Estado | Qué se ve |
|---|---|
| Cargando | "Cargando clientes…" (sin parpadeo si tarda menos de 200 ms) |
| Vacío, sin búsqueda | "Aún no hay clientes." y botón "Nuevo cliente" |
| Vacío, con búsqueda | "Ningún cliente coincide con «{texto}»." |
| Error | "No se pudieron cargar los clientes." y botón "Reintentar" |

### Alta de cliente (modal)

- Botón "Nuevo cliente" junto al buscador. Abre un `<dialog>` nativo: se cierra con Escape o "Cancelar", y el foco va al primer campo.
- Campos: nombre de la empresa, identificador fiscal, email, país (desplegable con los 28 países de la tabla de IVA, por nombre en español) y plan (Basic, Pro, Enterprise).
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
- Si la api responde 404 o 400: "Cliente no encontrado." con enlace a `/`.

### Datos del cliente (tarjeta)

- Nombre, identificador fiscal, email, país, plan y fecha de alta (`es-ES`, hora local).

### Simulador (tarjeta)

- Usuarios: slider de 1 a 500 y, al lado, un campo numérico de 1 a 100 000, sincronizados. Por encima de 500, el slider se queda al final y manda el campo.
- Almacenamiento (GB) y llamadas a la API al mes: campos numéricos opcionales, enteros ≥ 0, vacíos = 0. Se indica que son informativos y no cambian el precio.
- Resultado en vivo: base, IVA (con su porcentaje, a partir de `vatRateBasisPoints`) y total, en la divisa elegida. El total, destacado y con `aria-live="polite"`.
- Llama a `POST /simulations/preview` 250 ms después del último cambio en usuarios, cancelando la petición anterior. Almacenamiento y llamadas no disparan el preview: no cambian el precio.
- Si el campo de usuarios está vacío o fuera de 1–100 000: no se llama a la api y se muestra "Entre 1 y 100 000 usuarios".
- Estados:
  - **Primera carga:** "Calculando…".
  - **Recalculando:** se mantiene el último resultado, atenuado. Sin parpadeos.
  - **Error:** "No se pudo calcular el precio." con "Reintentar". Los campos siguen editables. Si es un 429, el mensaje de la sección 10.
- Botón "Guardar simulación": `POST /simulations` con usuarios, almacenamiento y llamadas. Mientras guarda, desactivado ("Guardando…"). Al guardar: "Simulación guardada" y el historial se vuelve a pedir. Si falla: mensaje junto al botón (un 429, con el de la sección 10).

### Historial (tarjeta)

- `GET /customers/:id/simulations`, las más recientes primero.
- Escritorio: tabla con fecha, usuarios, GB, llamadas, base, IVA y total. Móvil: una mini tarjeta por simulación con los mismos datos.
- Importes en la divisa elegida, con la misma regla de la sección 4.
- Estados: "Cargando historial…", vacío "Todavía no hay simulaciones guardadas.", error con "Reintentar".

## 7. Estilo

Basado en la identidad visual de Roams (roams.es, revisada el 22/11/2026): azul `#4040E3`, Montserrat, tarjetas blancas con bordes redondeados y mucho aire. Se toman sus colores y su tipografía; no su logo.

### Variables (todas en `styles/tokens.css`)

Ningún componente escribe un color a mano: solo `var(--color-…)`.

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

## Registro de cambios

- v0.1: vistas, estados, tipos de cambio, alta, simulador, historial, estilo de Roams con tema claro y oscuro, tests de lógica pura y CORS.
- v0.2: fuera MXN; límite de peticiones en la api (429 y su mensaje en el front) y `TRUST_PROXY`.
