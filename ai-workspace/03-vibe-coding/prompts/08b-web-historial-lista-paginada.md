# Prompt 08b · Historial: lista paginada, enviar y sin duplicados

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** que el historial no tenga scroll lateral, vaya de 5 en 5, permita enviar cada simulación por correo y no deje guardar duplicados.

&nbsp;

**Por qué está escrito así**

La tabla del historial no cabe en su columna de escritorio (unos 400 px) en cuanto los importes van en otra divisa y ocupan dos líneas, y con el botón "Enviar" cabría aún menos. Por eso pasa a ser una lista en todos los anchos, como ya era en móvil.

La lógica (páginas, duplicados y correo) ya está probada en el 08a: aquí solo se usa.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (secciones 6, 6 bis, 9 y 11),
ai-workspace/04-design/00-diseno.md (secciones 3 y 6) y los ADR-007 y 008.
Reglas de estilo (ADR-008):
- Solo clases del tema de styles/tokens.css. Nada de valores a mano
  (bg-[#4040E3], p-[13px]) ni de la paleta por defecto de Tailwind.
- Usa los componentes de components/ui/ (Button, Card, Icon…).
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni de api/, ni nada fuera de lo que pide esta tarea.
Haz solo este prompt y para.

1. SimulationHistory: una lista en todos los anchos, como 04-design,
   sección 6. Borra SimulationHistoryTable y deja una sola lista (adapta
   SimulationHistoryCards, o sustitúyela).
2. Paginación de 5 con paginate: "Anterior", "Página {n} de {total}" y
   "Siguiente" (Button secondary), desactivados en los extremos; solo con
   más de 5 simulaciones. La página vive en el estado de SimulationHistory.
3. Botón "Enviar" en cada simulación: un <a> con el estilo del Button soft
   (o LinkButton si encaja), href = buildSimulationMailto(customer,
   simulation, conversion). conversion es null en EUR y, si no, la divisa,
   el tipo y la fecha de los tipos del CurrencyContext. SimulationHistory
   recibe el cliente.
4. SaveSimulation: con isSimulationSaved(historial, valores), botón
   desactivado y el texto "Ya hay una simulación guardada con estos
   valores." debajo. Al guardar con éxito, el historial vuelve a la
   página 1.
5. Al recargar el historial tras guardar, la lista se mantiene a la vista
   al 50 % de opacidad en vez de cambiar a "Cargando historial…". El
   "Cargando historial…" solo sale si todavía no hay nada que enseñar.

Comprueba: lint, typecheck, test y build en verde. Ningún archivo nuevo
de más de ~150 líneas.
Commit: feat(web): historial paginado, enviar por correo y sin duplicados
```

---

&nbsp;

**Qué revisaremos al terminar**

A 1280 px el historial no tiene scroll lateral, ni en euros ni en dólares.

Con 6 simulaciones aparece la paginación; guardar vuelve a la página 1.

Guardar dos veces lo mismo: la segunda vez el botón está desactivado.

"Enviar" abre el correo con el destinatario, el asunto y el cuerpo bien escritos.
