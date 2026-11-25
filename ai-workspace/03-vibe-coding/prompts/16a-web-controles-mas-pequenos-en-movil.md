# Prompt 16a · Controles más pequeños en móvil

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que en móvil los controles de la cabecera y el botón "+" no se vean desproporcionados.

&nbsp;

**Por qué está escrito así**

Visto en el iPhone: con la cabecera a 48 px, unos controles de 44 px casi la llenan, y el "+" de la barra del buscador se ve demasiado grande. Los 44 px son una recomendación de Apple, no una regla; el mínimo de accesibilidad (WCAG 2.2, criterio 2.5.8) es de 24 px. Bajan solo en móvil; desde tablet todo sigue igual.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (sección 4) y
ai-workspace/04-design/00-diseno.md (Cabecera y Cabecera de la página).
La spec ya está commiteada.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. CurrencySelector.tsx: alto h-9 en móvil y md:h-11.
2. ThemeToggle.tsx: círculo h-9 w-9 en móvil y md:h-11 md:w-11; icono de
   18 px en móvil y 20 desde md (si Icon no admite tamaños por ancho,
   usa 18 en los dos).
3. Button.tsx, tamaño "icon": h-10 w-10 en móvil y md:h-11 md:w-11.
   CustomerToolbar.tsx: el icono del "+" a 18 px.
Comprueba: lint, typecheck, test y build de web en verde. Prueba a 375 px
(cabecera y barra del buscador) y a 1280 px (sin cambios).
Commit: style(web): controles más pequeños en móvil
```

---

&nbsp;

**Qué revisaremos al terminar**

A 375 px, el selector y el botón de tema miden 36 px y el "+" 40 px. A 1280 px nada ha cambiado.
