# Prompt 14g · web: un solo selector de divisa

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que haya un único `<select>` de divisa en lugar de dos.

&nbsp;

**Por qué está escrito así**

Hoy hay dos (uno para móvil, solo con el código, y otro para escritorio, con el símbolo) y se oculta uno u otro según el ancho. Son dos controles para lo mismo, con dos `id`. El texto de las opciones no se puede cambiar con CSS según el ancho, así que queda uno solo con el código en todos los tamaños, que es lo que ya se veía en móvil.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/04-design/00-diseno.md (Cabecera). La spec ya está actualizada y commiteada.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. En web/src/components/CurrencySelector.tsx: un solo <select>
   (id "currency"), con las opciones solo con el código (EUR, USD…).
   Quita CURRENCY_LABELS y la prop compact si ya no hacen falta.
2. El ancho se adapta: estrecho en móvil y algo más ancho desde md, con
   clases del tema.
Comprueba: lint, typecheck, test y build de web en verde. Prueba a 375 y
a 1280 px, y con las divisas caídas (selector bloqueado en EUR).
Commit: refactor(web): un solo selector de divisa
```

---

&nbsp;

**Qué revisaremos al terminar**

En el DOM solo hay un `<select>` de divisa.
