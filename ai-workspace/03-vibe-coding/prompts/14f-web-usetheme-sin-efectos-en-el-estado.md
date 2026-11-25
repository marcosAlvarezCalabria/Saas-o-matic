# Prompt 14f · web: `useTheme` sin efectos dentro de `setTheme`

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que cambiar el tema no toque el DOM ni `localStorage` desde dentro de la función que calcula el estado.

&nbsp;

**Por qué está escrito así**

Hoy `toggle` cambia `data-theme` y guarda en `localStorage` dentro de `setTheme(current => …)`. Esa función tiene que ser pura: React puede llamarla dos veces (en modo estricto lo hace a propósito) y entonces el efecto se repite. Estaba en la lista de correcciones desde el 07d.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.

1. En web/src/hooks/useTheme.ts:
   - toggle calcula el siguiente tema a partir de theme (el del estado),
     aplica data-theme, lo guarda con persistTheme y después llama a
     setTheme(nextTheme), sin función dentro;
   - toggle con useCallback y theme en sus dependencias.
2. No cambia el comportamiento: el tema se cambia, se guarda y sigue sin
   destello al recargar.
Comprueba: lint, typecheck, test y build de web en verde. Prueba a mano
cambiar de tema y recargar.
Commit: refactor(web): useTheme sin efectos dentro de setTheme
```

---

&nbsp;

**Qué revisaremos al terminar**

Dentro de `setTheme` no queda ninguna función.
