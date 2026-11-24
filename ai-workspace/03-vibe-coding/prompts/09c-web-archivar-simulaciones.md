# Prompt 09c · Archivar, deshacer y ver archivadas (web)

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** archivar desde el historial con "Deshacer", y una vista "Archivadas" para recuperarlas.

&nbsp;

**Por qué está escrito así**

Archivar no pide confirmación porque se puede deshacer al momento: eso molesta menos que un diálogo, y "Deshacer" usa el mismo endpoint que "Recuperar".

La comprobación de duplicados sigue usando solo las activas. Si una archivada bloqueara guardar, el comercial no entendería por qué.

Las archivadas se piden solo al abrir su vista, con el mismo `useSimulations` y `customerId` a `null` mientras está cerrada. Así no hay un hook nuevo para lo mismo, y el detalle no hace una petición de más al entrar.

La lógica de archivar y recuperar (petición, botón ocupado y aviso) va en su propio hook, para que `SimulationHistory` no pase de ~150 líneas.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (sección 6, Historial,
y sección 11), ai-workspace/04-design/00-diseno.md (sección 6, Historial),
02-architecture/openapi.yaml y los ADR-007 y 008.
Reglas de estilo (ADR-008):
- Solo clases del tema de styles/tokens.css. Nada de valores a mano
  (bg-[#4040E3], p-[13px]) ni de la paleta por defecto de Tailwind.
- Usa los componentes de components/ui/ (Button, Card, Icon, InlineAlert…).
La spec ya está actualizada y commiteada. La api ya tiene los endpoints.
No toques nada de ai-workspace/ ni de api/, ni nada fuera de lo que pide
esta tarea. Haz solo este prompt y para.

1. Tests primero, en web/src/api/simulations.test.ts, con el mismo mock de
   fetch que apiClient.test.ts:
   - listSimulations(1) pide /customers/1/simulations;
     listSimulations(1, { archived: true }) pide
     /customers/1/simulations?archived=true.
   - archiveSimulation(7) hace POST a /simulations/7/archive y
     restoreSimulation(7), POST a /simulations/7/restore; los dos
     devuelven la simulación.
   Ejecuta y comprueba que fallan.
   Commit: test(web): archivar y recuperar simulaciones

2. Implementa:
   - api/types.ts: Simulation con archivedAt: string | null.
   - api/simulations.ts: listSimulations(customerId, { archived }?, signal?),
     archiveSimulation(id) y restoreSimulation(id).
   - hooks/useSimulations.ts: segundo parámetro archived (por defecto
     false).
   - hooks/useSimulationArchive.ts: archive(simulation) y
     restore(simulation), el id que está en curso, y el aviso
     (success "Simulación archivada." con acción "Deshacer", success
     "Simulación recuperada.", o los errores de la sección 6; un 429 con
     el mensaje de la sección 10). Después de cada operación llama a
     onChanged.
   - SimulationHistory:
     · vista "active" | "archived" con los dos botones de la cabecera
       (aria-pressed). Al cambiar: página 1 y sin aviso.
     · archivadas con useSimulations(view === 'archived' ? customerId :
       null, true).
     · el aviso, sobre la lista; el contador, el de la vista abierta.
     · onChanged recarga las activas (el reload que recibe del padre) y
       las archivadas si su vista está abierta.
     · saca la paginación a su propio componente si hace falta para no
       pasar de ~150 líneas.
   - SimulationHistoryList: en activas, "Archivar" junto a "Enviar"
     (Button secondary, size compact, icono Archive, aria-label
     "Archivar la simulación del {fecha}", desactivado si está en curso);
     en archivadas, "Archivada el {fecha}" y "Recuperar" (icono
     ArchiveRestore) en lugar de "Enviar".
   - CustomerDetailPage: pasa a SimulationHistory lo que necesite para
     recargar las activas. El Simulator sigue recibiendo solo las activas.

Comprueba: lint, typecheck, test y build en verde. Ningún archivo de más
de ~150 líneas.
Commit: feat(web): archivar, deshacer y ver archivadas
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el de implementación.

Las archivadas solo se piden al abrir su vista (pestaña Red).

Archivar la única simulación de la página 2 lleva sola a la página 1.

Una archivada no bloquea guardar los mismos valores.

Ningún archivo pasa de ~150 líneas.
