# Prompt 07d · Cabecera, tema y tipos de cambio

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** la cabecera de todas las vistas, con el selector de divisa, el de tema y el aviso cuando fallan los tipos de cambio.

&nbsp;

**Por qué está escrito así**

La divisa afecta a todos los importes de la app, así que va en un contexto de React (ADR-007). El tema no: vive en `<html data-theme>` y en `localStorage`.

El script de `index.html` tiene que poner el tema **antes** de que React pinte, para que no haya un destello claro en oscuro. No puede importar `lib/theme.ts` (todavía no hay módulos cargados), así que repite su regla en pocas líneas, con un comentario que lo diga.

`Money` va aquí porque depende del contexto de divisa, y lo usan el simulador y el historial.

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

1. index.html: un script en línea en el <head>, antes de cualquier CSS, que
   lee "saas-o-matic-theme" de localStorage (con try/catch) y, si no hay un
   valor válido, usa prefers-color-scheme. Pone data-theme en <html>.
   Comentario: repite la regla de lib/theme.ts porque se ejecuta antes que
   los módulos.
2. hooks/useTheme.ts: lee el tema de <html>, y toggle() lo cambia y lo guarda
   con saveTheme.
3. hooks/useExchangeRates.ts: una sola llamada a fetchExchangeRates al
   montarse; { status: "loading" | "error" | "success", rates, updatedAt,
   retry }.
4. context/CurrencyContext.tsx: la divisa elegida (EUR por defecto, no se
   guarda) y el resultado de useExchangeRates. Si los tipos no están en
   "success", la divisa efectiva es EUR. Solo ofrece las divisas de
   02-interfaz.md (EUR, USD, GBP, CHF, SEK, PLN) que vengan en rates.
5. components/: Header, CurrencySelector, ThemeToggle, RatesBanner, Footer y
   Money, como dicen 02-interfaz.md (sección 4) y 04-design (secciones 2 y 6):
   - CurrencySelector desactivado mientras cargan o si fallan los tipos.
   - RatesBanner solo con error, con "Reintentar".
   - Footer con la fecha de los tipos (es-ES) y el enlace a ExchangeRate-API.
   - Money recibe céntimos de euro: en EUR muestra el importe; en otra
     divisa, "≈ {importe}" y debajo el importe en euros. Con tabular-nums.
6. Un componente Layout con Header, RatesBanner, <main> y Footer, que
   envuelve las rutas de App.tsx.

Comprueba: lint, typecheck, test y build en verde. A mano: recargar en
oscuro no da destello; bloqueando open.er-api.com en las herramientas del
navegador sale el aviso y el selector queda en EUR.
Commit: feat(web): cabecera, tema y tipos de cambio
```

---

&nbsp;

**Qué revisaremos al terminar**

Recargar en oscuro no da un destello claro.

Con los tipos de cambio bloqueados: aviso, "Reintentar" funciona y todo en EUR.

El botón de tema tiene `aria-label` y cambia de icono.

Ningún componente lee `localStorage` directamente: solo `lib/theme.ts` y el script de `index.html`.

&nbsp;

**Resultado de la revisión**

Hecho en `5672c19`. Lint, typecheck y build en verde; sin colores ni medidas a mano. El script del tema queda en el HTML compilado antes del CSS y del JavaScript de React.

Pendiente de probar en el navegador: que recargar en oscuro no da destello, y que con open.er-api.com bloqueado sale el aviso y todo queda en euros.

Detalles para la ronda de correcciones del final:
- `useTheme` cambia el atributo de `<html>` y guarda el tema dentro de la función que actualiza el estado; debería hacerlo en el manejador del clic.
- El selector de divisa son dos `<select>` (móvil y escritorio) que se muestran o se ocultan con CSS; podría ser uno.
