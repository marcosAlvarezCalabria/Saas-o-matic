# Prompt 07i · Historial y guardar simulación

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** guardar la simulación y ver el historial del cliente.

&nbsp;

**Por qué está escrito así**

Al guardar, el historial se vuelve a pedir a la api en vez de añadir la fila desde el front: la api es la fuente de verdad del orden y de la fecha (`02-interfaz.md`, sección 6).

Es el último prompt de vistas. Después va la revisión manual completa de la sección 11 de `02-interfaz.md`.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md, ai-workspace/04-design/00-diseno.md
(y sus capturas en screens/), 02-architecture/00-estructura.md y los ADR-007 y 008.
Reglas de estilo (ADR-008):
- Solo clases del tema de styles/tokens.css. Nada de valores a mano
  (bg-[#4040E3], p-[13px]) ni de la paleta por defecto de Tailwind.
- El HTML de Stitch es referencia de estructura: no lo pegues tal cual.
- Los textos, los de 02-interfaz.md y 04-design (no los de la maqueta).
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni de api/, ni nada fuera de lo que pide esta tarea.
Haz solo este prompt y para.

1. hooks/useSimulations.ts: listSimulations(customerId) con
   AbortController; { status, simulations, reload }.
2. components/SimulationHistory.tsx, como 04-design, sección 6:
   - md y más: tabla Fecha · Usuarios · Base · IVA · Total, con los GB y las
     llamadas en una línea pequeña bajo la fecha.
   - Móvil: una mini tarjeta por simulación (fecha y total arriba).
   - "{n} simulaciones" en la cabecera; importes con Money; fecha en es-ES.
   - Estados: cargando, vacío y error con "Reintentar".
3. Simulator: botón "Guardar simulación" (lg, con el icono de guardar).
   Llama a createSimulation con users, storageGb y apiCalls; "Guardando…" y
   desactivado mientras guarda; desactivado si users no es válido.
   Al guardar: InlineAlert de éxito "Simulación guardada" (se puede cerrar)
   y reload del historial. Si falla: InlineAlert de error (el 429, con su
   mensaje).
4. CustomerDetailPage: sustituye la Card vacía por SimulationHistory.

Comprueba: lint, typecheck, test y build en verde. A mano, con la api:
guardar 15, 40 y 51 usuarios los muestra en el historial en orden inverso;
un cliente sin simulaciones muestra el vacío; el historial respeta la
divisa elegida.
Commit: feat(web): historial y guardar simulación
```

---

&nbsp;

**Qué revisaremos al terminar**

Tras guardar, la simulación nueva aparece arriba del historial sin recargar la página.

En móvil cada simulación es una mini tarjeta con el total arriba a la derecha.

Después, la lista completa de la sección 11 de `02-interfaz.md`, en claro y en oscuro.

&nbsp;

**Resultado de la revisión**

Hecho en `37fb6ff`. Historial en tabla desde `md` y en mini tarjetas en móvil; vacío, cargando y error con "Reintentar". Guardar usa los usuarios al momento (no los del debounce), se desactiva con valores no válidos o mientras guarda, y al terminar recarga el historial y muestra "Simulación guardada".

Detalle: al recargar el historial tras guardar, la lista se sustituye un instante por "Cargando historial…" en vez de mantenerse.
