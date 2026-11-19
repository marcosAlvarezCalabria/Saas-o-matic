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

## Patrones que voy viendo

Cuando una tarea mezcla una parte grande (mover carpetas) y una pequeña (una línea de configuración), la pequeña se pierde.

Solución: tareas cortas, numeradas y con un commit cada una.
