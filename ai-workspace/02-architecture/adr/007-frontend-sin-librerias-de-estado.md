# ADR-007 · Frontend sin librerías de estado, de peticiones ni de estilos

**Estado:** aceptado. La parte de estilos la sustituye el ADR-008 (Tailwind).

**Contexto.** El frontend tiene dos vistas, cinco llamadas a la api y una a la de divisas. Tengo que poder explicar cada línea, y el enunciado valora que no haya deuda técnica ni código innecesario.

**Decisión.**
- Peticiones con `fetch` en `web/src/api/` y hooks propios que devuelven `{ status: 'loading' | 'error' | 'success', data, error, retry }`. Las búsquedas y el preview cancelan la petición anterior con `AbortController`.
- Estado global solo para la divisa (un contexto de React). El tema vive en `<html data-theme>` y en `localStorage`, no en React.
- Estilos con CSS Modules y variables CSS en `styles/tokens.css`. El tema oscuro solo cambia los valores de las variables.
- `react-router` para las rutas.

**Alternativas.**
- TanStack Query: caché, reintentos y cancelación hechos. Para cinco llamadas sin datos compartidos entre vistas, es más de lo que hace falta y otra API que explicar.
- Redux o Zustand: no hay estado compartido que lo justifique.
- Tailwind o una librería de componentes: más rápido de escribir, pero añade configuración, dependencias y clases que no aportan para dos vistas. Con variables CSS, el tema oscuro sale casi gratis.

**Consecuencias.** Pocas dependencias y todo el código a la vista. Si la app creciera (más vistas, caché entre ellas), TanStack Query sería el primer cambio a considerar.
