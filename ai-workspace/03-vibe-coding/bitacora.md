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

## 5. Codex se saltó el commit de la spec y fue directo al código

**Fecha:** 2026-11-20

**IA:** Codex

&nbsp;

**Qué pedí**

Dos pasos numerados: primero, commit de la spec pendiente en `ai-workspace/`; después, ejecutar el prompt 04.

&nbsp;

**Qué hizo**

Ejecutó el prompt 04 entero (9 commits de código) sin hacer el commit de la spec. Los 12 archivos de la spec siguieron sin commit.

&nbsp;

**Cómo lo detecté**

Con `git log` y `git status` antes de revisar el código.

&nbsp;

**Por qué importa**

La regla del proyecto es spec primero y código después. En el historial, el código del IVA en puntos básicos y de los clientes aparece antes que la spec que lo pide.

&nbsp;

**Corrección**

El commit de la spec se hace después, y el desorden queda documentado aquí en lugar de reescribir el historial.

&nbsp;

**Lección**

Un paso de "preparación" (como un commit) en el mismo mensaje que una tarea grande se pierde, igual que en la corrección #1. Los commits de spec los hago yo (Marcos) antes de pasarle el prompt a Codex, y lo compruebo con `git log`.

&nbsp;

---

## 6. Tests en verde, pero la api compilada no arrancaba

**Fecha:** 2026-11-20

**IA:** Codex (código) y Claude (revisión)

&nbsp;

**Qué pedí**

Prompt 04: clientes de punta a punta, con tests de integración.

&nbsp;

**Qué hizo**

Los 81 tests pasaban, pero había cuatro fallos que ningún test veía:

La api compilada (`node dist/main.js`) fallaba al arrancar: el esquema estaba en `schema.sql` y `tsc` no copia archivos `.sql` a `dist`.

Si dos altas con el mismo NIF llegaban a la vez, la restricción `UNIQUE` de SQLite acababa en un 500 en lugar de un 409.

El logger escribía `GET /` en vez de `GET /customers`, porque usaba la ruta relativa al router.

La ficha aceptaba ids como `1.0`, `1e0` o `0x1`, porque `Number()` los convierte en 1.

&nbsp;

**Cómo lo detecté**

En la revisión, Claude compiló y arrancó la api, y probó a mano los casos límite: condición de carrera, ids raros y la salida del logger.

&nbsp;

**Por qué importa**

El fallo del esquema habría aparecido el domingo, al montar Docker, con poco margen para arreglarlo.

&nbsp;

**Corrección**

Spec primero: esquema en `schema.ts` (actualización del ADR-005), escenario de condición de carrera, ids solo con dígitos y logger con ruta completa. Después, prompts 04b a 04e para Codex, uno por fallo.

&nbsp;

**Lección**

Tests en verde no significa que funcione: los tests usan `tsx` y nunca ejecutan lo compilado. El CI tendrá un paso que compila, arranca `dist/main.js` y llama a `/health`.

&nbsp;

---

## 7. Un prompt mezclaba dos tareas

**Fecha:** 2026-11-20

**IA:** Claude (redactó el prompt) · **Detectado por:** Marcos

&nbsp;

**Qué pasó**

El prompt 04 se llamaba `04-clientes.md`, pero su paso 1 era otra tarea distinta: ampliar el IVA a la UE y pasarlo a puntos básicos.

El nombre no decía lo que contenía, y el prompt juntaba dos objetivos.

&nbsp;

**Cómo lo detecté**

Releyendo los prompts: el título y el objetivo no coincidían con el nombre del archivo.

&nbsp;

**Por qué importa**

Las correcciones #1 y #5 tienen la misma causa: cuando un prompt mezcla tareas, Codex se salta alguna. Y un nombre que no dice lo que contiene hace más difícil seguir el historial.

&nbsp;

**Corrección**

El archivo pasa a llamarse `04-iva-y-clientes.md`. No se reescribe su contenido porque ya está ejecutado.

&nbsp;

**Lección**

Desde el prompt 05: un prompt por tarea, con un único objetivo y un nombre que lo diga. Igual que las specs.

&nbsp;

---

## Patrones que voy viendo

Cuando una tarea mezcla una parte grande (mover carpetas) y una pequeña (una línea de configuración), la pequeña se pierde.

Solución: tareas cortas, numeradas y con un commit cada una.

Lo que está en la arquitectura pero no en el prompt, Codex puede no aplicarlo. Solución: repetir en el prompt las reglas obligatorias.

La IA que escribe la spec también se equivoca. Los tests escritos antes del código son los que lo destapan, siempre que el prompt prohíba tocar el código para que pasen.

Los tests prueban lo que la spec describe, no lo que nadie ha pensado. La revisión tiene que salirse del camino feliz: compilar, arrancar y probar casos límite a mano.

Un prompt, una tarea. Es la causa común de las correcciones #1, #5 y #7.
