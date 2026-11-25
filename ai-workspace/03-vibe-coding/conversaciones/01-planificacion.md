# 1 · Planificación

**Fechas:** 18–19/11/2026 · **Con:** Claude · **Fase:** antes de escribir código

&nbsp;

**Qué se buscaba**

Entender el enunciado y decidir cómo construirlo antes de que la IA escribiera una línea. El enunciado reparte la nota así: planificación 35 %, calidad del software 30 %, criterio técnico 25 % y README y despliegue 10 %.

&nbsp;

**Qué se decidió**

- **Monorepo con pnpm**, con `api/` y `web/`. La api en Node, TypeScript, Express y SQLite; la web en React y Vite.
- **Clean Architecture ligera**: dominio puro, casos de uso y adaptadores (SQLite y HTTP), sin librerías de inyección de dependencias ni Redux. Quería poder explicar cada línea en la presentación, así que nada de capas que no aporten.
- **TDD donde puede fallar sin que se vea**: tramos, IVA y NIF. Tests de integración para los endpoints. Sin tests para un botón.
- **El cálculo solo en el backend.** Para el slider en tiempo real elegí un endpoint `POST /simulations/preview`, que calcula sin guardar, en lugar de repetir el algoritmo en el front.
- **Importes en céntimos**, como enteros.
- **CI/CD en la v1, no en una v2.** Primero lo dejé para después; luego decidí que, ya que lo hacía, lo hacía bien: Docker en mi VPS de Hetzner y la web en Netlify.

&nbsp;

**Qué corregí o rechacé**

- Cambié varias veces de herramienta para el código (Claude Code o Codex) y me quedé con **Codex**, que es la que uso a diario. Claude se queda con las specs, la arquitectura y la revisión.
- **Claude no hace commits.** Al principio hizo alguno; le pedí que los rehiciera a mi nombre y quedó como regla: los commits los hacemos Codex o yo.
- Pedí repetir y simplificar varias explicaciones (SOLID, interfaces, capas) hasta poder contarlas yo con mis palabras.

&nbsp;

**Qué salió de aquí**

- `01-specs/00-analisis.md`: análisis, supuestos, stack y estrategia de tests.
- `01-specs/01-casos-de-uso.md` y `01-specs/features/pricing.feature`.
- El reparto de roles del `../README.md`.
