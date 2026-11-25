# Prueba manual en local · 24/11/2026

La sección 11 de `01-specs/02-interfaz.md`, en pasos concretos. Se hace **después del commit del 08c** y **sin el seed**: así se prueba también el alta a mano.

Marca cada paso con ✅ o ❌. Si algo falla, anota qué viste y sigue: los fallos van juntos en un solo prompt de correcciones.

&nbsp;

## 0. Arranque

- [x] En la raíz: `pnpm dev`. Se levantan la api en `:3000` y la web en `:5173`. La web usa `web/.env` con `VITE_API_URL=http://localhost:3000`.
- [ x] Abre `http://localhost:5173` con las herramientas del navegador abiertas (Consola y Red). Durante toda la prueba, ningún error rojo en Consola.

## 1. Dashboard y alta

- [ ] Con la BD vacía se ve el estado vacío del dashboard.
- [ ] Alta con un CIF no válido (`B12345678`): error en el campo y no se cierra el modal.
- [ ] Alta válida: Nube Norte S.L., `B76432103`, ES, pro, `facturacion@nubenorte.example.com`. Aparece la tarjeta.
- [ ] Repite el alta con el mismo NIF: aviso de duplicado (409).
- [ ] Da de alta dos más: Nube Sur Consultores S.L., `B91827360`, ES · Bergwerk Software GmbH, `DE811234567`, DE.
- [ ] Busca "nube": salen 2. Busca "nub" y borra deprisa: no se queda una búsqueda antigua en pantalla.
- [ ] Todo el alta con teclado: Tab hasta el botón, Enter, rellenar, Enter para enviar, Esc para cerrar.

## 2. Simulador

- [ ] Entra en Nube Norte. El preview se calcula solo con 15 usuarios.
- [ ] Mueve el slider deprisa de un lado a otro: en Red salen pocas peticiones a `/simulations/preview` y el total final es el del último valor.
- [ ] Prueba los tres tramos: 5, 30 y 120 usuarios. El total cambia y el IVA es del 21 %.
- [ ] En Bergwerk el IVA es del 19 %.

## 3. Guardar, duplicados e historial

- [ ] Guarda una simulación: mensaje de éxito y aparece en el historial **sin** pasar por "Cargando historial…" (la lista se atenúa).
- [ ] Sin cambiar nada: botón desactivado y "Ya hay una simulación guardada con estos valores.".
- [ ] Doble clic rápido en "Guardar" con valores nuevos: solo se guarda una.
- [ ] Guarda hasta tener 7 con valores distintos: aparece "Página 1 de 2". "Anterior" está desactivado en la 1 y "Siguiente" en la 2.
- [ ] Desde la página 2, guarda una más: vuelve a la página 1.
- [ ] Guardar con teclado: Tab hasta el botón y Enter.

## 4. Enviar por correo

- [ ] En EUR, pulsa "Enviar": se abre el correo para `facturacion@nubenorte.example.com`, con el asunto y el cuerpo de la sección 6 bis, las tildes y el "€" bien y una línea por dato.
- [ ] En USD, lo mismo, pero con la línea "Equivale a ≈ … US$ al tipo de cambio del …".

## 5. Divisas (incluye la prueba pendiente del 07d)

- [ ] Cambia a USD, GBP y CHF: importes con `≈` y el importe en euros debajo. El historial no tiene scroll lateral en ninguna divisa.
- [ ] **Divisas bloqueadas:** en Red, bloquea `open.er-api.com` (clic derecho → Bloquear dominio) y recarga. Aviso "No se pudieron cargar los tipos de cambio…", selector desactivado en EUR y la app funciona. Quita el bloqueo, pulsa "Reintentar" y el selector vuelve a funcionar.

## 6. Errores de la api

- [ ] Para la api (Ctrl+C en la terminal) con la web abierta:
  - el dashboard muestra el error con "Reintentar";
  - el detalle de un cliente, también;
  - el preview y el guardar muestran su error sin romper la página.
- [ ] Vuelve a arrancar la api y pulsa "Reintentar": se recupera.
- [ ] Ve a `/customers/9999`: "cliente no encontrado".

## 7. Tema (incluye la prueba pendiente del 07d)

- [ ] Cambia a oscuro y recarga varias veces (con Ctrl+Shift+R también): **ningún destello claro**.
- [ ] Recorre dashboard, modal y detalle en oscuro: todo legible, sin blancos sueltos.

## 8. Tamaños

Con el modo responsive de las herramientas del navegador, en claro y en oscuro:

- [ ] 375 px: dashboard, modal y detalle sin scroll lateral.
- [ ] 768 px: lo mismo.
- [ ] 1280 × 800 px: el detalle de Nube Norte (con 5 o más simulaciones) se ve entero sin scroll vertical.

## 9. Archivar y recuperar (después del 09c)

Borra antes `api/saas-o-matic.sqlite` y lanza `pnpm --filter api seed`: la BD vieja no tiene la columna `archived_at`.

- [ ] Nube Norte: 6 activas (2 páginas) y, en "Archivadas", 1 con su fecha.
- [ ] Archiva una: desaparece de "Activas" y sale "Simulación archivada." con "Deshacer". "Deshacer" la devuelve.
- [ ] Archiva la única de la página 2: pasa sola a la página 1.
- [ ] En "Archivadas", "Recuperar" la devuelve a "Activas".
- [ ] Archiva una y guarda en el simulador sus mismos valores: deja guardar (la archivada no cuenta como duplicada).
- [ ] Con la api parada, "Archivar" muestra el error y la lista sigue igual.
- [ ] Todo con teclado: Tab hasta el interruptor "Ver archivadas" (espacio para cambiarlo), "Archivar", "Deshacer" y "Recuperar".

&nbsp;

## Resultado

| Paso | Qué falló | Gravedad (bloquea / molesta / detalle) |
|---|---|---|
| 6 · Enviar | En un ordenador sin programa de correo, "Enviar" no hace nada (en móvil sí funciona). | molesta → prompt 14k ("Copiar") |
| 9 · Archivar | Una simulación recién guardada y archivada sigue bloqueando "Guardar" con los mismos valores. | bloquea → prompt 15a |
| 1 · Dashboard | A 375 px se ven dos botones "Nuevo cliente". | molesta → prompt 15b |
| 8 · Tamaños | A 1280 × 800 el detalle no cabe entero, sobre todo en CHF. | molesta → v1.1 |
| 9 · Archivar | "Recuperar" se anunciaba sin fecha. | detalle → prompt 14i |
| 8 · Tamaños | Email y fecha de alta recortados con "…" (es a propósito, con el texto completo al pasar el ratón). | detalle → se deja |

Resultados del 25/11, en producción (versión hasta el 13e), con un agente en el navegador más mis pruebas. Lo que el agente no pudo medir (destello del tema, caída de las divisas, api parada) queda para la prueba a mano.
