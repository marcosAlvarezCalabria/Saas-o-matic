# 4 · Revisiones, datos de ejemplo, archivar y despliegue

**Fechas:** 24–25/11/2026 · **Con:** Claude · **Fase:** cierre, producción y CI/CD

&nbsp;

**Qué se buscaba**

Revisar las últimas mejoras del historial, probarlo todo, ponerlo en producción con CI/CD y preparar la entrega.

&nbsp;

**Qué se decidió**

- **Datos de ejemplo** con un comando manual que pasa por los casos de uso, no por SQL. Los NIF pasan la validación real y los importes salen del dominio. Los datos están pensados para que cada caso se vea: paginación, buscador sin tildes, historial vacío y varios IVA. Los correos son `@example.com` para que "Enviar" nunca escriba a nadie real (09a).
- **No se borran simulaciones, se archivan.** En la prueba manual vi que no podía quitar ninguna:
  - Claude recomendó no hacer nada y dejarlo como supuesto;
  - le pedí al menos archivar;
  - de sus opciones elegí la más completa: archivar al momento con "Deshacer" y una vista "Archivadas" para recuperarlas, en lugar de un diálogo de confirmación y sin poder recuperar (09b y 09c).
- **Comparé con otras entregas.** Revisamos 18 repos públicos del mismo reto. Casi ninguno deja borrar simulaciones, y solo unos pocos tienen Docker o CI. Eso confirmó dónde poner el esfuerzo: despliegue y CI/CD antes que más funciones.
- **Despliegue:**
  - la web en Netlify, con `netlify.toml` y la redirección de la SPA;
  - la api en Docker en el VPS, con Caddy para el HTTPS;
  - CI y CD con GitHub Actions: si el CI pasa, se despliega por SSH y se comprueba `/health`.

- **Mejoras tras probar en producción (25/11):**
  - en otra divisa, el total se salía de su caja. Elegí, entre tres maquetas, poner todo en esa divisa y el euro una sola vez: "Se factura en euros" (13a, 13d);
  - el buscador queda fijo arriba, la lista de clientes pagina de 6 en 6 y la cabecera es más fina en el móvil (13b);
  - un interruptor "Ver archivadas", porque los dos botones no dejaban ver cuál estaba elegido, y una "i" en lugar de la nota de "informativos" (13c);
  - la fecha de archivado se pintaba encima del total (13e).
- **Correcciones de las revisiones, un prompt por cada una (14a–14k):** errores de la api con un `Record`, SQL sin texto interpolado, `Field.tsx` dividido, `useTheme` sin efectos en `setTheme`, un solo selector de divisa, accesibilidad, y un botón **"Copiar"** para los equipos sin programa de correo.
- **Prueba en producción con un agente en el navegador**, sobre una versión fija y con reglas para no ensuciar los datos de la demo. Encontró dos fallos que arreglé antes de entregar: una simulación archivada seguía bloqueando "Guardar" (15a) y en el móvil salían dos botones "Nuevo cliente" (15b). Lo demás quedó para la v1.1.
- **Releases:** la entrega es la `v1.0.0`; la guía de primera visita, en su propia rama, saldrá como `v1.1.0` con pull request y CI.

&nbsp;

**Qué corregí o rechacé**

- **El VPS no estaba limpio.** Tenía otro proyecto y un nginx en el 80 y el 443. Claude propuso compartir el servidor y usar su nginx (llegó a reescribir el ADR). Decidí que el servidor era para esto: borramos el proyecto antiguo y nos quedamos con el diseño de Caddy. El ADR volvió a su versión original.
- **Al revisar el servidor apareció una clave SSH que no reconocía**, también en root, y los dos `authorized_keys` estaban bloqueados con `chattr +ia`. Antes de decidir nada, revisamos los registros de acceso desde que se creó el servidor: esa clave nunca se había usado y solo había entradas mías. Aun así, decidí **reinstalar el servidor desde cero**.
- **No probé solo en producción.** Primero, una prueba rápida en local y después producción, para no mezclar los fallos del código con los del despliegue.

&nbsp;

**Errores que se detectaron**

- **Codex**, en las revisiones:
  - un `errorHandler` que mandaba a 404 cualquier código de error nuevo;
  - un mensaje de error equivocado para `?archived=`;
  - SQL armado con un texto en mitad de la consulta;
  - un `aria-label` que faltaba.

  Van al prompt de correcciones.
- **La primera publicación en Netlify salió sin `VITE_API_URL`**, así que la web llamaba a `localhost`. Se vio porque la web cargaba pero no los datos.
- **Claude:**
  - dio un comando con `&&`, que no funciona en el PowerShell de Windows;
  - con un `git rm --cached` dejó un `.git/index.lock` colgado, que habría roto mis siguientes commits. Lo detectó y lo deshizo él mismo.

- **Mi revisión del 09c dejó pasar una clase con un valor a mano** (`lg:grid-cols-[minmax(0,1fr)_auto]`), porque solo buscaba colores y medidas entre corchetes. Lo destapó la prueba en producción (bitácora #10).
- **Codex juntó el test y el código en un solo commit en el 14b y el 14k**, en una tanda de once prompts. El código estaba bien, pero el historial ya no demuestra que el test fallara primero (bitácora #11).

&nbsp;

**Qué salió de aquí**

- `01-specs/03-datos-demo.md`, UC7 y UC8 en `01-casos-de-uso.md` y la regla de archivar en `features/simulations.feature`.
- `02-architecture/02-despliegue.md` y el ADR-009.
- `../prueba-manual.md`, con los resultados de la prueba en producción, la bitácora #10 y #11, y los prompts 08a a 15b.
