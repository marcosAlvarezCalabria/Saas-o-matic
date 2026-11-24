# Prompt 07f · Dashboard: buscador, tarjetas y estados

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** la vista principal, con el buscador, las tarjetas de clientes y sus cuatro estados.

&nbsp;

**Por qué está escrito así**

El buscador espera 300 ms tras la última tecla (debounce) y cancela la búsqueda anterior: así no se lanza una petición por letra ni una respuesta vieja pisa a una nueva (`02-interfaz.md`, sección 5).

El modal de alta va en el 07g. Aquí el botón "Nuevo cliente" ya está, pero todavía no abre nada.

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

1. hooks/useDebouncedValue.ts: devuelve el valor tras N ms sin cambios.
2. hooks/useCustomers.ts: llama a searchCustomers con el texto ya con
   debounce (300 ms) y un AbortController por búsqueda, que cancela la
   anterior. Ignora los AbortError. Devuelve { status, customers, retry }.
   El estado "loading" solo se muestra si tarda más de 200 ms.
3. components/CustomerCard.tsx, como 04-design, sección 4: CountryBadge,
   PlanBadge, nombre, NIF, email y "Ver detalle y simular →". Toda la
   tarjeta es un único enlace a /customers/:id.
4. pages/DashboardPage.tsx:
   - Cabecera: "Clientes", el subtítulo, el buscador y el botón "Nuevo
     cliente" (sin acción todavía).
   - Rejilla de 1, 2 (md) y 3 (lg) columnas.
   - Estados con StatusPanel: cargando, vacío sin búsqueda (con "Nuevo
     cliente"), sin resultados (con "Limpiar búsqueda", que vacía el
     buscador) y error (con "Reintentar").

Comprueba: lint, typecheck, test y build en verde. A mano, con la api
arrancada: buscar deprisa no deja resultados viejos; con la api apagada
sale el error y "Reintentar" funciona.
Commit: feat(web): dashboard con buscador y tarjetas
```

---

&nbsp;

**Qué revisaremos al terminar**

Escribir "acme" deprisa lanza una sola petición (pestaña Red).

Los cuatro estados se ven, cada uno con su texto de `04-design`.

La rejilla pasa de 1 a 2 columnas a 768 px y a 3 a 1024 px.

&nbsp;

**Resultado de la revisión**

Hecho en `016a955`. Lint, typecheck y build en verde; sin valores a mano ni textos de la maqueta. Buscador con debounce de 300 ms; `useCustomers` cancela la búsqueda anterior, ignora las cancelaciones y solo enseña "Cargando…" si tarda más de 200 ms. Los cuatro estados con sus textos y acciones (incluido "Limpiar búsqueda"); rejilla de 1, 2 (`md`) y 3 (`lg`) columnas; la tarjeta entera es un enlace.
