# 3 · Simulaciones, protección de la api y frontend

**Fechas:** 22–24/11/2026 · **Con:** Claude (texto y voz) · **Fase:** backend completo y frontend

&nbsp;

**Qué se buscaba**

Terminar la api (simulaciones, historial y preview), protegerla para una demo pública y construir el frontend entendiendo cada pieza.

&nbsp;

**Qué se decidió**

- **Simulaciones ligadas al cliente**, con un tope de 100 000 usuarios y almacenamiento y llamadas como datos informativos (prompts 05a–05f).
- **La demo va a tener un enlace público y no hay login**, así que hacen falta:
  - **CORS** limitado a los orígenes de la web (06a);
  - **límite de peticiones por IP**: 30 por minuto en escritura y 120 en el resto, con un 429 y `Retry-After` (06b).
- **El estilo con la marca de Roams**, la empresa que evalúa: su azul, Montserrat y tema claro y oscuro.
- **Una maqueta antes del código.** La hice con Google Stitch, y como Stitch entrega Tailwind, cambié la decisión de CSS Modules (ADR-007) por **Tailwind con nuestro tema y sin la paleta por defecto** (ADR-008), para no hacer dos veces el mismo trabajo.
- **El front casi sin lógica:** `fetch` y hooks propios, sin TanStack Query ni Redux. La lógica que puede fallar sin que se vea, como el 25,5 % o la conversión de divisa, va en `lib/` y con tests.

&nbsp;

**Qué corregí o rechacé**

- **Cambié el ritmo.** Sentí que Codex iba demasiado rápido y yo no seguía el código. A partir de ahí:
  - prompts más pequeños;
  - repaso de lo hecho antes de pasar al siguiente, en el orden `lib/` → `api/` → hooks → componentes;
  - no se avanza hasta que lo entiendo.
- Quité MXN de las divisas.
- Pregunté por qué Claude había cambiado cosas en los prompts, y me explicó cada una. Por ejemplo, el 07a va sin script de test a propósito: así `pnpm test` nunca pasa en verde sin probar nada, que fue el error #2.

&nbsp;

**Errores de la IA que se detectaron**

- **La spec no ponía tope a los usuarios:** se añadió en la spec y en la BD (#8).
- **Un error 500 no dejaba rastro en los logs:** se registra en el servidor sin enseñar la traza al cliente (#9).
- **Claude:**
  - escribió en un ejemplo del ADR-008 una clase que no existía (`text-muted` en lugar de `text-text-muted`);
  - en un prompt se le coló un espacio invisible en vez del texto ` `, que habría hecho fallar un test sin motivo aparente.

  Se corrigieron antes de pasárselos a Codex.

&nbsp;

**Qué salió de aquí**

- `01-specs/02-interfaz.md`, `features/cors.feature` y `features/rate-limit.feature`.
- `04-design/`, con la spec de diseño y las capturas.
- Los ADR-007 y 008, y los prompts 05a a 08c.
- `../bitacora.md`, #8 y #9.
