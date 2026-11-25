# Prompt 15b · Un solo "Nuevo cliente" en móvil

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que a 375 px solo se vea el botón "+", no también el de escritorio.

&nbsp;

**Por qué está escrito así**

Lo encontró la prueba en producción: a 375 px salen dos botones "Nuevo cliente" y el buscador queda apretado. El de escritorio lleva `hidden md:inline-flex`, pero `Button` ya trae `inline-flex` en sus clases base, y en Tailwind esa clase gana a `hidden`, así que nunca llega a ocultarse.

No se arregla tocando las clases base de `Button`, que usan muchos sitios: el botón se mete en un contenedor que es el que se oculta.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/01-specs/02-interfaz.md (sección 5,
Buscador). No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. CustomerToolbar.tsx: envuelve el Button de escritorio en un
   <div className="hidden md:block"> y quítale "hidden md:inline-flex".
   El botón "+" (size icon) sigue con md:hidden.
2. Busca en web/src otros Button o LinkButton con "hidden" en su
   className y avísame con la lista (no los cambies).
Comprueba: lint, typecheck, test y build de web en verde. Prueba a 375,
768 y 1280 px: un solo botón de alta en cada ancho.
Commit: fix(web): un solo Nuevo cliente en móvil
```

---

&nbsp;

**Qué revisaremos al terminar**

A 375 px, solo el "+"; desde 768 px, solo "Nuevo cliente" con texto.
