# Bitácora de correcciones a la IA

Registro corto de cada vez que la IA hizo algo distinto a lo pedido o subóptimo.

Para cada caso: cómo lo detecté y qué cambié para que no se repita.

Las conversaciones completas están en esta misma carpeta.

&nbsp;

---

## 1. Codex no completó el `.gitignore`

**Fecha:** 2026-11-19

**IA:** Codex

&nbsp;

**Qué pedí**

Mover `api/*` a `api/src/`, crear `web/src/` y completar el `.gitignore` con `dist/`, `.env.*` y `*.sqlite`.

&nbsp;

**Qué hizo**

Movió las carpetas bien (commit `dc30a79`).

Pero no tocó el `.gitignore`: siguió con solo `node_modules/`, `.env` y `*.db`.

&nbsp;

**Cómo lo detecté**

Revisando el commit antes de seguir, con `cat .gitignore`.

&nbsp;

**Por qué importa**

Sin `*.sqlite`, la base de datos local con clientes de prueba acabaría en el repositorio.

Sin `.env.*`, también un `.env.production` con la URL del VPS.

Son fallos silenciosos: todo funciona, pero se sube lo que no debe.

&nbsp;

**Corrección**

Se repite en la siguiente tarea como paso 1, con su propio commit.

&nbsp;

**Lección**

En los prompts, cada subtarea va numerada y con su commit, para que una no quede tapada por otra.

&nbsp;

---

## 2. Errores sin código, scripts solo en `api` y tests que pasan sin tests

**Fecha:** 2026-11-19

**IA:** Codex

&nbsp;

**Qué pedí**

Prompt 01: setup de la api y TDD de tramos e IVA, siguiendo `00-estructura.md` y el ADR-001.

&nbsp;

**Qué hizo**

El cálculo quedó bien y el TDD se ve en el historial (test antes que implementación).

Pero hubo tres desviaciones de la spec:

Lanzaba `new Error('país no soportado')` en vez de un `DomainError` con código, que es lo que pide `00-estructura.md`.

No creó el `package.json` de la raíz, así que `pnpm test` no funcionaba desde la raíz, como dice el ADR-001.

Puso `--passWithNoTests` en el script de test.

&nbsp;

**Cómo lo detecté**

Revisando el código contra `00-estructura.md` y los ADR, archivo a archivo.

&nbsp;

**Por qué importa**

Con errores sin código, la capa HTTP solo podría decidir entre 400 y 500 comparando textos. Un cambio de tilde rompería la API.

Sin el `package.json` de la raíz, el evaluador tendría que entrar en cada carpeta, y el CI se complica.

Con `--passWithNoTests`, si un día se borran los tests, el CI saldría en verde igualmente.

&nbsp;

**Corrección**

Prompt 02 (`prompts/02-correcciones-dominio.md`), con una corrección por paso y su commit. Resultado revisado y correcto.

&nbsp;

**Lección**

Codex sigue bien lo que se le escribe en el prompt, pero no siempre lee los detalles de los documentos de arquitectura.

Lo que sea obligatorio (como el `DomainError`) va también en el prompt, no solo en la spec.

&nbsp;

---

## 3. Faltaba probar el tercer tramo con muchos usuarios

**Fecha:** 2026-11-19

**IA:** Claude (spec) y Codex (tests)

&nbsp;

**Qué pasó**

Los tests cubrían los límites de cada tramo (10/11 y 50/51), pero el tercer tramo solo se probaba con un usuario (51).

Un fallo que pusiera un tope al tercer tramo habría pasado todos los tests.

&nbsp;

**Cómo lo detecté**

Revisando los tests yo mismo: no había ningún número grande.

&nbsp;

**Corrección**

Primero la spec: se añade el caso de 1000 usuarios (5170 €) a `pricing.feature` y se sustituye el ejemplo de 60 en `00-analisis.md`.

Después Codex añade el test.

&nbsp;

**Lección**

Un caso por cada comportamiento distinto: en cada tramo, el límite donde empieza y que acumula bien varios usuarios. No hace falta probarlo todo.

&nbsp;

---

## 4. Claude puso mal el importe esperado de 1000 usuarios

**Fecha:** 2026-11-19

**IA:** Claude

&nbsp;

**Qué pedí**

Añadir a la spec el caso de 1000 usuarios (corrección #3).

&nbsp;

**Qué hizo**

Escribió 4750 € en `pricing.feature` y en `00-analisis.md`.

Ese importe es solo lo del tercer tramo (950 × 5 €). El total acumulado es 5170 €: 100 € + 320 € + 4750 €.

Además, al pasar el prompt a Codex dijo que ya lo había comprobado y que el test pasaría a la primera. No era cierto: había probado 60 usuarios, no 1000.

&nbsp;

**Cómo lo detecté**

El test de Codex falló: esperaba 475 000 céntimos y la implementación devolvía 517 000.

Codex no tocó el código y avisó, como pedía el prompt.

&nbsp;

**Por qué importa**

Si Codex hubiera "arreglado" el código para que el test pasara, habría roto la tarificación acumulativa, que es la regla central del reto.

&nbsp;

**Corrección**

Spec corregida a 5170 € (`00-analisis.md` v1.3). Después Codex pone 517 000 céntimos en el test.

&nbsp;

**Lección**

Los importes esperados de la spec se calculan con el algoritmo antes de escribirlos, como se hizo con los NIF. No se escriben de cabeza.

El prompt "si el test falla, para y avísame; no toques src" funcionó: es lo que evitó que el error de la spec pasara al código.

&nbsp;

---

## Patrones que voy viendo

Cuando una tarea mezcla una parte grande (mover carpetas) y una pequeña (una línea de configuración), la pequeña se pierde.

Solución: tareas cortas, numeradas y con un commit cada una.

Lo que está en la arquitectura pero no en el prompt, Codex puede no aplicarlo. Solución: repetir en el prompt las reglas obligatorias.

La IA que escribe la spec también se equivoca. Los tests escritos antes del código son los que lo destapan, siempre que el prompt prohíba tocar el código para que pasen.
