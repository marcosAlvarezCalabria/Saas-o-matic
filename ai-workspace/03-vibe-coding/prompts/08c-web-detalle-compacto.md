# Prompt 08c · Detalle compacto y campos numéricos sin flechas

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** que en escritorio el detalle del cliente quepa en una pantalla y que los campos numéricos no muestren las flechas del navegador.

&nbsp;

**Por qué está escrito así**

Con los márgenes y rellenos actuales, el detalle no cabe en 1280 × 800 px: hay que hacer scroll para llegar al botón de guardar. Las medidas compactas van en `04-design` ("Detalle compacto en escritorio"), y solo se aplican desde `lg`: el móvil no cambia.

Las flechas de los campos numéricos son el estilo por defecto del navegador y desentonan con el resto. Se quitan con CSS; las flechas del teclado siguen funcionando.

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

1. global.css: los input type="number" sin flechas del navegador
   (appearance: textfield y ::-webkit-inner-spin-button /
   ::-webkit-outer-spin-button con appearance: none y margin 0).
2. Detalle compacto desde lg, como 04-design, sección 6, "Detalle compacto
   en escritorio":
   - CustomerDetailPage: márgenes verticales de 24 px.
   - CustomerSummary en una sola fila (iniciales, nombre en title-md y plan
     a la izquierda; NIF, país, email y fecha a la derecha).
   - Simulator y SimulationHistory: relleno de 24 px y 16 px entre bloques;
     almacenamiento y llamadas en una fila; caja del precio con 16 px.
   Si una tarjeta necesita otro relleno, añade una prop al componente (por
   ejemplo Card con padding="compact"); no repitas clases en cada vista.
3. Aprovecha para dejar Simulator.tsx por debajo de ~150 líneas (saca la
   caja del precio a su propio componente, PriceSummary).

Comprueba: lint, typecheck, test y build en verde.
Commit: feat(web): detalle compacto y campos numéricos sin flechas
```

---

&nbsp;

**Qué revisaremos al terminar**

A 1280 × 800 px, con el aviso de divisas cerrado, se ven los datos del cliente, el simulador entero con su botón y el historial sin hacer scroll.

En móvil el detalle se ve igual que antes.

Los campos numéricos no tienen flechas, y las flechas del teclado siguen subiendo y bajando el valor.
