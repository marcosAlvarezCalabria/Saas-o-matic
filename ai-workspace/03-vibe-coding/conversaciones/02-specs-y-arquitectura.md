# 2 · Specs de dominio y arquitectura

**Fechas:** 19–22/11/2026 · **Con:** Claude (texto y voz) · **Fase:** dominio y endpoints de clientes

&nbsp;

**Qué se buscaba**

Dejar escritos los contratos y las reglas antes de que Codex los programara, y arrancar el dominio con TDD.

&nbsp;

**Qué se decidió**

- **Gherkin de la validación fiscal** (`features/tax-id.feature`), con DNI, NIE, CIF y el formato básico de otros países. Claude calculó cada ejemplo con el algoritmo real antes de escribirlo.
- **Arquitectura escrita**: estructura de carpetas, modelo de datos con su DDL, contrato OpenAPI y los ADR 001 a 006.
- **En una revisión por voz** fui pregunta a pregunta por la arquitectura y decidí:
  - mantener el preview como un endpoint aparte, en vez de mezclarlo con el de crear;
  - aceptar que el buscador vaya por `GET`, con el NIF en la URL, porque el NIF de una empresa es un dato público (ADR-006);
  - renombrar la rama `master` a `main` antes de montar el CI.
- **IVA en puntos básicos** (2100 = 21 %), para admitir el 25,5 % de Finlandia sin decimales. Tabla con los 27 países de la UE más GB, de fuentes oficiales.

&nbsp;

**Qué corregí o rechacé**

- Claude propuso probar el tercer tramo con 60 usuarios. Le dije que no bastaba: el test tenía que probar la acumulación con un número grande y sin tope artificial. Se quedó en **1000 usuarios** (bitácora #3).
- **El formato de la bitácora:** al principio era una tabla de siete columnas que no se leía bien. La pasé a bloques de texto con un apartado por campo.

&nbsp;

**Errores de la IA que se detectaron**

- **Claude se equivocó en un valor esperado:** puso 4750 € para 1000 usuarios, cuando lo correcto es 5170 € (100 + 320 + 4750). Además, había dicho que lo había comprobado y no era verdad. Lo destapó el test de Codex al fallar, y desde entonces los prompts dicen: *"si un test falla, no cambies el valor esperado ni el código para forzarlo: para y avísame"* (bitácora #4).
- **Codex:**
  - dejó el `.gitignore` a medias cuando la tarea mezclaba mover carpetas con una línea de configuración (#1);
  - usó `Error` genérico en vez de `DomainError` con código, y un script de test que pasaba sin tests (#2);
  - se saltó el commit de la spec (#5);
  - dejó los tests en verde, pero la api compilada no arrancaba (#6);
  - recibió un prompt que mezclaba dos tareas (#7).

  De ahí salió la regla de **un prompt, una tarea**.

&nbsp;

**Qué salió de aquí**

- `01-specs/features/tax-id.feature`.
- `02-architecture/`: `00-estructura.md`, `01-modelo-datos.md`, `openapi.yaml` y los ADR 001–006.
- `../bitacora.md`, entradas #1 a #7, y los prompts 01 a 04f.
