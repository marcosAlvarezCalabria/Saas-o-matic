# Prompt 15a · Una simulación archivada no bloquea "Guardar"

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que, después de archivar una simulación, se puedan volver a guardar sus mismos valores, como dice la spec.

&nbsp;

**Por qué está escrito así**

Lo encontró la prueba en producción (bloque 9). `SaveSimulation` guarda en su propio estado (`savedSimulations`) las simulaciones que crea, para que no se pueda guardar dos veces mientras el historial se recarga. Pero esa lista no se vacía nunca, así que si después archivas una de ellas, sigue contando como duplicada.

La lista de activas que llega del padre ya es la verdad: después de guardar, el historial se recarga y la trae. Lo único que hay que cubrir es el rato de la recarga, y para eso basta con desactivar el botón mientras dura, sin una segunda lista que se desincronice.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/01-specs/02-interfaz.md (sección 6,
"Sin duplicados" y "Archivar"). No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.

1. SaveSimulation.tsx:
   - quita el estado savedSimulations; el duplicado se comprueba solo
     con simulations (las activas que llegan del padre);
   - el botón se desactiva también mientras el historial se recarga
     después de guardar (estado "loading" de las activas), para que no
     se pueda guardar dos veces seguidas.
2. CustomerDetailPage.tsx / Simulator.tsx: pasa lo que haga falta para
   saber si el historial de activas está cargando.
Comprueba: lint, typecheck, test y build de web en verde. Prueba a mano:
guardar → archivar esa simulación → con los mismos valores, "Guardar"
vuelve a estar activo y no sale el aviso de duplicado. Y doble clic
rápido en "Guardar" sigue guardando una sola.
Commit: fix(web): una simulación archivada no bloquea Guardar
```

---

&nbsp;

**Qué revisaremos al terminar**

`savedSimulations` ya no existe.

Guardar, archivar y volver a guardar los mismos valores funciona.

El doble clic sigue guardando una sola.
