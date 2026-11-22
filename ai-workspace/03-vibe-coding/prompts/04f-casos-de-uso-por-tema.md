# Prompt 04f · Casos de uso agrupados por tema

**Para:** Codex

**Fecha:** 2026-11-20

**Objetivo:** mover los casos de uso de clientes a `application/use-cases/customers/`, sin cambiar su comportamiento.

&nbsp;

**Por qué está escrito así**

Decisión de Marcos al repasar el código: con seis casos de uso, una carpeta `use-cases` agrupada por tema dice qué hay dentro y deja junto todo lo de clientes o de simulaciones. Está en `00-estructura.md` (arquitectura v0.6).

Es solo un movimiento de archivos. Por eso el prompt prohíbe cambiar nada más: si los tests siguen en verde, el comportamiento no ha cambiado.

`application/use-cases/simulations/` no se crea todavía: se creará con su primer caso de uso, para no dejar carpetas vacías.

Se ejecuta después de los prompts 04c, 04d y 04e, para no mover archivos mientras se corrigen.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/02-architecture/00-estructura.md.
No toques nada de ai-workspace/.

1. Mueve con git mv a api/src/application/use-cases/customers/:
   createCustomer.ts, getCustomer.ts y searchCustomers.ts.
2. Actualiza todos los imports que apuntan a ellos (src y test) y los
   imports relativos de dentro de esos tres archivos.
3. ports/ y errors.ts se quedan en api/src/application/.
4. No cambies ninguna línea de código que no sea un import.
5. Ejecuta tests, typecheck y lint. Todo tiene que seguir en verde.
Commit: refactor(application): casos de uso de clientes en su carpeta

Si algo falla, para y avísame.
```

---

&nbsp;

**Qué revisaremos al terminar**

`git show --stat` muestra los tres archivos como renombrados, no como borrados y creados.

El diff solo cambia líneas de `import`.

Los tests siguen pasando, con el mismo número que antes.
