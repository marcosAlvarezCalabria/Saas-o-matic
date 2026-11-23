# Prompt 07h · Detalle del cliente y simulador

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** la ficha del cliente y el simulador con el precio en tiempo real.

&nbsp;

**Por qué está escrito así**

El precio no lo calcula el front: lo pide al preview de la api (ADR-004). El preview se lanza 250 ms después del último cambio en usuarios y cancela el anterior. Almacenamiento y llamadas no lo disparan, porque no cambian el precio.

Mientras recalcula se deja el último resultado atenuado, sin borrarlo, para que la cifra no parpadee.

Guardar la simulación y el historial van en el 07i.

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

1. hooks/useCustomer.ts: getCustomer(id) con AbortController. Un 400 o un
   404 de la api es "notFound", no un error.
2. hooks/usePreview.ts: con users ya con debounce (250 ms); si users no es un
   entero de 1 a 100 000, no llama. Cancela la petición anterior e ignora
   AbortError. Estados: "loading" (primera vez), "refreshing" (mantiene el
   último resultado), "error" (con retry) y "success".
3. components/CustomerSummary.tsx: iniciales, nombre (h1), PlanBadge y la
   rejilla de datos de 04-design, sección 6 (fecha de alta en es-ES).
4. components/UsersSlider.tsx: input range de 1 a 500 y NumberField de 1 a
   100 000, sincronizados; por encima de 500 el slider se queda al final.
   Estilos del slider en global.css (pista, parte recorrida con --fill y
   tirador), con las variables del tema.
5. components/Simulator.tsx: UsersSlider, almacenamiento y llamadas (vacío =
   0), la nota informativa y la caja del precio (base, IVA con
   formatVatRate y total con Money y aria-live="polite"). "Entre 1 y 100 000
   usuarios" si el valor no es válido. Error con InlineAlert y "Reintentar".
   Deja preparado el sitio del botón de guardar (07i).
   El total mide 32 px en móvil y 36 px desde lg: añade a styles/tokens.css
   --text-amount-sm (32px, line-height 40px, letter-spacing -0.02em,
   font-weight 800) y usa text-amount-sm lg:text-amount. Nada de text-[32px].
6. pages/CustomerDetailPage.tsx: "← Clientes", CustomerSummary y, debajo,
   la rejilla de 12 columnas en lg (simulador 7, historial 5; el historial,
   de momento, una Card vacía con su título). "Cliente no encontrado." con
   StatusPanel si notFound.

Comprueba: lint, typecheck, test y build en verde. A mano, con la api:
mover el slider deprisa lanza pocas peticiones y el total final es el del
último valor; 15 usuarios en España dan 169,40 €; cambiar de divisa
convierte al momento sin pedir nada a la api; /customers/9999 y
/customers/abc muestran "Cliente no encontrado.".
Commit: feat(web): detalle del cliente y simulador
```

---

&nbsp;

**Qué revisaremos al terminar**

El preview no se lanza al cambiar almacenamiento ni llamadas.

El total no parpadea al mover el slider.

Un cliente de Finlandia muestra "IVA (25,5 %)".
