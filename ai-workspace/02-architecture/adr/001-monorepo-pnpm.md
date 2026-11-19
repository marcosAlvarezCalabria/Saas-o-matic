# ADR-001 · Monorepo con pnpm workspaces

**Estado:** aceptado

**Contexto.** El reto pide frontend y backend que se comuniquen, y el evaluador tiene que levantarlos en local en pocos pasos.

**Decisión.** Un solo repositorio con dos workspaces de pnpm: `api` y `web`. Scripts en la raíz (`pnpm dev`, `pnpm test`, `pnpm build`) que lanzan los de cada paquete.

**Alternativas.** Dos repositorios (más fricción para el evaluador y para el CI). npm workspaces (funciona, pero pnpm es más rápido y estricto con dependencias no declaradas).

**Consecuencias.** Un `git clone`, un `pnpm install`. El CI corre una sola pipeline. Los tipos de la API no se comparten como paquete: el frontend define los suyos en `web/src/api` a partir del OpenAPI, para no acoplar los dos lados.
