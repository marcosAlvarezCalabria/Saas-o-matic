# Prompt 13b · Dashboard: buscador fijo, paginación y cabecera fina en móvil

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que en el dashboard el buscador siga a la vista al hacer scroll, que la lista de clientes pagine de 6 en 6 y que en móvil la cabecera ocupe menos.

&nbsp;

**Por qué está escrito así**

- **Un comercial busca clientes todo el rato**: el buscador no puede quedarse arriba al bajar.
- **La lista no puede crecer sin fin.** Se pagina en el front, con el mismo `paginate` y el mismo componente de paginación que el historial: no hay código nuevo que probar. Con miles de clientes se haría en la api; está en las mejoras futuras.
- **En móvil, la cabecera fija y la barra fija se comerían la pantalla.** Por eso la cabecera baja a 48 px y la barra fija es una sola fila: el buscador y un botón "+".
- **`DashboardPage.tsx` ya tiene 148 líneas**, así que hay que sacar la barra y la lista paginada a sus propios componentes.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (secciones 4 y 5) y
ai-workspace/04-design/00-diseno.md (Cabecera, Cabecera de la página), y
el ADR-008. La spec ya está commiteada.
No toques ai-workspace/ ni api/. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. Cabecera: h-12 en móvil y h-16 desde md (Header.tsx), y el mismo alto
   en el relleno superior de Layout.tsx (pt-12 md:pt-16).
2. components/CustomerToolbar.tsx: el buscador y "Nuevo cliente".
   - sticky justo debajo de la cabecera (top-12 md:top-16), con fondo
     bg, borde inferior border y relleno vertical de 12 px; z por debajo
     de la cabecera y del modal;
   - en móvil, "Nuevo cliente" es un botón redondo de 44 px solo con el
     icono Plus y aria-label "Nuevo cliente"; desde md, como ahora.
   - El título "Clientes" queda fuera de la barra.
3. Paginación de clientes de 6 en 6 con paginate y el componente de
   paginación del historial (si hace falta, muévelo a components/ con un
   nombre general, por ejemplo Pagination.tsx, y úsalo en los dos
   sitios). Solo con más de 6. Al cambiar la búsqueda, página 1. Al
   cambiar de página, la vista sube al principio de la lista.
   La lista paginada va en su propio componente.
4. README.md, en "Mejoras futuras": añade "Paginar los clientes en la api
   (?page=&limit=) cuando haya miles; hoy se pagina en el front."

Comprueba: lint, typecheck, test y build en verde. Ningún archivo de más
de ~150 líneas. Prueba a 375, 768 y 1280 px, con scroll, en claro y en
oscuro, y que el modal de alta queda por encima de la barra fija.
Commit: feat(web): buscador fijo y paginación de clientes
```

---

&nbsp;

**Qué revisaremos al terminar**

Al hacer scroll en el dashboard, el buscador sigue visible y no tapa la primera tarjeta al cargar.

Con los 9 clientes de ejemplo hay 2 páginas, y al buscar "nube" vuelve a la página 1.

En 375 px, la cabecera mide 48 px y la barra fija es una sola fila.

El modal de alta se abre por encima de todo.
