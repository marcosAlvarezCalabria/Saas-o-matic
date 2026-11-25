# Prompt 13d · En otra divisa, el euro en una sola línea "Se factura"

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que en otra divisa los importes se lean limpios, y que el euro aparezca una sola vez y explicado.

&nbsp;

**Por qué está escrito así**

En la prueba en producción, aunque ya nada se salía de su caja, los euros pequeños debajo de cada importe en CHF parecían un error. Comparé tres maquetas y elegí esta: todo en la divisa elegida y una línea al final que dice lo que se cobra ("Se factura en euros: 166,60 € / mes").

El euro no se puede quitar del todo: es lo que se guarda y lo que vale para presupuestar. Por eso va en un componente propio, con una frase que lo explica, en lugar de colgar debajo de cada número.

Va después del 13c porque toca `PriceSummary` y el historial.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (sección 4, "Cómo se
muestra un importe") y ai-workspace/04-design/00-diseno.md (Simulador e
Historial), y el ADR-008. La spec ya está commiteada.
No toques ai-workspace/ ni api/. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. Money.tsx: un solo formato. En EUR, "166,60 €"; en otra divisa,
   "≈ 153,06 CHF". El suffix ("/ mes") sigue igual. Quita la
   variante "stacked" y la prop variant si ya no hace falta.
2. components/BilledInEuros.tsx: no pinta nada en EUR. En otra divisa:
   - variant "full": "Se factura en euros: <strong>166,60 € / mes</strong>"
     (small, text-muted; el importe en text y font-medium), con un borde
     superior discontinuo y 8 px de separación;
   - variant "short": "se factura 3177,30 €" (caption, text-muted).
   Usa formatMoney y convertCents de lib/money.
3. PriceSummary.tsx: debajo del total, <BilledInEuros variant="full"
   cents={result.totalCents} suffix="/ mes" />.
4. SimulationHistoryList.tsx: debajo del total de cada fila,
   <BilledInEuros variant="short" cents={simulation.totalCents} />.

Comprueba: lint, typecheck, test y build en verde. Prueba en EUR (no
aparece ninguna línea "Se factura") y en CHF y SEK, a 1280 y a 375 px,
en claro y en oscuro.
Commit: feat(web): en otra divisa, el euro en una línea "Se factura"
```

---

&nbsp;

**Qué revisaremos al terminar**

En EUR se ve igual que antes, sin líneas nuevas.

En CHF, la caja del precio tiene todo en CHF y una sola línea "Se factura en euros".

En el historial, cada total lleva debajo "se factura … €".

`Money` ya no tiene la variante "stacked".
