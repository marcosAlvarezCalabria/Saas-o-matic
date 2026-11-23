# Prompt 07b · Lógica pura del front, con TDD

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** las funciones de `web/src/lib/` que tienen reglas que pueden fallar sin que se vea: divisa, IVA, tema y países.

&nbsp;

**Por qué está escrito así**

Es la única lógica del front que merece tests (`02-interfaz.md`, sección 9). Son funciones puras, sin React ni navegador, y van con el test primero.

`formatVatRate` va aquí porque convierte puntos básicos en un porcentaje para mostrarlo: con Finlandia (2550 → "25,5 %") es fácil equivocarse.

`Intl.NumberFormat` separa la cifra y el símbolo con un espacio que no es el normal (U+00A0). Se avisa en el prompt para que el test no falle por eso y Codex no lo "arregle" cambiando el valor esperado.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md, ai-workspace/04-design/00-diseno.md
(y sus capturas en screens/), 02-architecture/00-estructura.md y los ADR-007 y 008.
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni de api/, ni nada fuera de lo que pide esta tarea.
Haz solo este prompt y para.

1. Tests primero, en web/src/lib/ (Vitest, entorno node):
   - money.test.ts:
     · convertCents(16940, 1) === 169.4; convertCents(16940, 1.09) ≈ 184.646
       (sin redondear).
     · formatMoney(169.4, "EUR") === "169,40\u00a0€" y
       formatMoney(184.646, "USD") === "184,65\u00a0US$" (Intl es-ES usa
       U+00A0 entre la cifra y el símbolo).
   - vatRate.test.ts: formatVatRate(2100) === "21\u00a0%",
     formatVatRate(2550) === "25,5\u00a0%", formatVatRate(0) === "0\u00a0%".
   - theme.test.ts:
     · resolveTheme("dark", false) === "dark"; resolveTheme("light", true) === "light"
     · resolveTheme(null, true) === "dark"; resolveTheme("azul", false) === "light"
     · readStoredTheme(storage) devuelve null si storage.getItem lanza.
   - countries.test.ts: 28 países; códigos únicos; están GB y GR; no están
     EL, UK, US ni CH; ordenados por nombre en español.
   Añade a web/package.json el script test (vitest run) y vitest como
   dependencia de desarrollo. Ejecuta y comprueba que fallan.
   Commit: test(web): divisa, IVA, tema y países

2. Implementa en web/src/lib/:
   - money.ts: convertCents(cents, rate) y formatMoney(amount, currency).
     Se redondea solo al formatear.
   - vatRate.ts: formatVatRate(basisPoints), con Intl en es-ES y estilo percent.
   - theme.ts: type Theme = "light" | "dark"; THEME_STORAGE_KEY =
     "saas-o-matic-theme"; resolveTheme(stored, prefersDark);
     readStoredTheme(storage) y saveTheme(storage, theme), las dos con
     try/catch.
   - countries.ts: COUNTRIES con { code, name } de los 28 países de la tabla
     de IVA de 00-analisis.md (Grecia es GR), ordenados por nombre.
   Commit: feat(web): divisa, IVA, tema y países

Los valores esperados están calculados. Si un test falla, no cambies el
valor esperado ni el código para forzarlo: para y avísame con el caso.
```

---

&nbsp;

**Qué revisaremos al terminar**

Los dos commits, test antes que implementación.

`formatMoney` no redondea nada antes de `Intl`.

La lista de países es la misma que la tabla de IVA de `00-analisis.md`.

`pnpm test` en la raíz pasa también los tests de `web`.
