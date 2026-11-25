# Prompt 13a · Importes en otra divisa sin cortes

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que en cualquier divisa el total del simulador quepa en su caja y las filas del historial se lean bien.

&nbsp;

**Por qué está escrito así**

Lo vi en producción con CHF a 1280 px (bitácora #10):
- el `≈` quedaba en una línea y el número en otra;
- "/ mes" y los euros se salían por el borde de la caja del precio;
- en el historial, "Base" quedaba separado de su importe.

Las causas son tres:
1. un espacio normal entre `≈` y el número;
2. una caja con tres columnas iguales;
3. base e IVA con dos líneas cada uno en una fila estrecha.

Además hay que quitar una clase con un valor a mano que entró en el 09c.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (secciones 4 y 6) y
ai-workspace/04-design/00-diseno.md (Simulador, Historial y Detalle
compacto en escritorio), y el ADR-008. La spec ya está commiteada.
No toques ai-workspace/ ni api/. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes en
una clase ([#…], [13px], [minmax(…)]…).

1. Money.tsx:
   - Entre "≈" y el número, el espacio que no se parte ( ).
   - Una prop variant: "stacked" (por defecto, como ahora: convertido
     arriba y euros debajo) e "inline" (solo "≈ X CHF" en una línea, sin
     los euros). En EUR, las dos se ven igual.
   - Nada se corta: el contenido puede bajar de línea, pero no se sale
     de su caja (sin whitespace-nowrap en el bloque entero).
2. PriceSummary.tsx, desde lg: dos zonas, no tres columnas iguales. A la
   izquierda, base e IVA apilados (ocupan lo que sobra); a la derecha, el
   total (ocupa lo que necesita), con un borde vertical entre las dos.
   Solo con flex o grid y clases del tema.
3. SimulationHistoryList.tsx:
   - base e IVA con <Money variant="inline" />, en una línea:
     "Base ≈ 2453,00 CHF · IVA (19 %) ≈ 466,07 CHF"; el total de la fila
     sigue en "stacked";
   - sustituye lg:grid-cols-[minmax(0,1fr)_auto] por una solución con
     clases del tema (por ejemplo flex con min-w-0 y shrink-0).
4. Busca en todo web/src cualquier otra clase con "[" y, si hay, avísame
   con la lista; no la cambies si no está en este prompt.

Comprueba: lint, typecheck, test y build en verde. Prueba en el navegador
con CHF y SEK a 1280 px y a 375 px, en claro y en oscuro.
Commit: fix(web): importes en otra divisa sin cortes
```

---

&nbsp;

**Qué revisaremos al terminar**

Con CHF a 1280 px, el total del simulador cabe con "/ mes" y los euros, y el `≈` va en la misma línea que el número.

En el historial, "Base ≈ … · IVA (…) ≈ …" va en una línea.

`grep -rn "\[" web/src --include=*.tsx | grep className` no devuelve ninguna clase con corchetes.
