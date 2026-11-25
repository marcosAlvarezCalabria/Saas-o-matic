# Prompt 14e · web: dividir `Field.tsx`

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que `Field.tsx` (228 líneas) pase a archivos pequeños, uno por componente.

&nbsp;

**Por qué está escrito así**

`AGENTS.md` pide archivos de una sola responsabilidad y de ~150 líneas como mucho. `Field.tsx` tiene el contenedor común y tres campos distintos. Estaba en la lista de correcciones desde el 07e.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. En web/src/components/ui/:
   - FieldShell.tsx: FieldShell y mergeDescribedBy (exporta los dos);
   - TextField.tsx, NumberField.tsx y SelectField.tsx: un campo cada uno,
     usando FieldShell.
   - Borra Field.tsx y actualiza ui/index.ts para exportar lo mismo que
     antes. Ningún import de fuera de ui/ tiene que cambiar.
2. No cambia ningún comportamiento ni ninguna clase.
Comprueba: lint, typecheck, test y build de web en verde. Ningún archivo
de más de ~150 líneas.
Commit: refactor(web): un archivo por cada campo
```

---

&nbsp;

**Qué revisaremos al terminar**

Fuera de `components/ui/` no cambia ningún import.
