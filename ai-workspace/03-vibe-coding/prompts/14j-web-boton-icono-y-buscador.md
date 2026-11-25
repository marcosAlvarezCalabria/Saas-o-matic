# Prompt 14j · web: botón "+" con `Button` y un solo nombre en el buscador

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que el botón "+" del móvil use el componente `Button` y que el buscador no se anuncie dos veces.

&nbsp;

**Por qué está escrito así**

En el 13b, el "+" del móvil es un `<button>` hecho a mano que copia los estilos de `Button`: si cambia el estilo de los botones, este se queda atrás. Y el buscador tiene a la vez un `<label>` oculto y un `aria-label`, así que el lector de pantalla puede leerlo dos veces.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. En web/src/components/ui/Button.tsx, un tamaño "icon": 44 × 44 px,
   redondo y sin relleno lateral (clases del tema). Pensado para botones
   con solo icono, que siempre llevan aria-label.
2. En CustomerToolbar.tsx:
   - el "+" del móvil pasa a <Button size="icon" icon={Plus}
     aria-label="Nuevo cliente" … />;
   - el buscador se queda solo con su <label> (quita el aria-label).
Comprueba: lint, typecheck, test y build de web en verde. Prueba a 375 px.
Commit: refactor(web): botón icono y un solo nombre en el buscador
```

---

&nbsp;

**Qué revisaremos al terminar**

En `CustomerToolbar` no queda ningún `<button>` suelto.
