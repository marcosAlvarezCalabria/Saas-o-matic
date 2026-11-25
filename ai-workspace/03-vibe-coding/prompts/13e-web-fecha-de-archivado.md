# Prompt 13e · "Archivada el…" fuera de la fila del total

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que en la vista de archivadas la fecha de archivado no se monte encima del total.

&nbsp;

**Por qué está escrito así**

Lo vi en producción con GBP: "Archivada el 25/11/2026" iba en la misma fila que el total y "Recuperar", y en la tarjeta del historial no caben los tres, así que el texto se pintaba encima del importe. Como dato secundario que es, va abajo, con el resto de datos de la simulación.

Va después del 13d porque toca el mismo archivo.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (sección 6,
"Recuperar") y ai-workspace/04-design/00-diseno.md (Historial).
La spec ya está commiteada.
No toques ai-workspace/ ni api/. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. SimulationHistoryList.tsx, vista "archived":
   - quita "Archivada el {fecha}" de la fila del total;
   - ponlo como última línea de los datos de la fila (debajo de base e
     IVA), en caption y text-muted;
   - en la fila del total quedan solo la fecha, el total (con su línea
     "se factura" del 13d) y el botón "Recuperar".
2. Comprueba que nada se monta en la vista de archivadas con GBP, CHF y
   SEK, a 1280, 1024 y 375 px.
3. README.md, en "Mejoras futuras", añade al final: "Correo de la
   simulación en el idioma del cliente, con el nombre local del impuesto
   (VAT, MwSt., TVA…).".

Comprueba: lint, typecheck, test y build en verde.
Commit: fix(web): fecha de archivado fuera de la fila del total
```

---

&nbsp;

**Qué revisaremos al terminar**

En "Ver archivadas", con GBP a 1280 px, la fecha de archivado está debajo de base e IVA y no toca el total.
