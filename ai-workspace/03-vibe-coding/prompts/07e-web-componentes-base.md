# Prompt 07e · Componentes base

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** las piezas que se repiten en todas las vistas, para que las páginas no copien cadenas de clases.

&nbsp;

**Por qué está escrito así**

El ADR-008 dice que las combinaciones de clases que se repiten van en componentes. Si cada vista escribiera su propio botón, un cambio de estilo serían diez cambios.

Van antes que las vistas y sin vistas, para revisarlos solos. Sin tests: son presentación, y se revisan a mano (`02-interfaz.md`, sección 9).

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

Crea en web/src/components/ui/, con el aspecto de 04-design, sección 3:

1. Icon: envuelve un icono de lucide-react con size (16, 18, 20 o 24) y
   aria-hidden="true" por defecto.
2. Button: variantes primary, secondary, danger y soft; tamaño md (44 px) y
   lg (48 px); icono opcional; disabled al 50 % de opacidad. Pasa el resto de
   props al <button>. También un LinkButton con los mismos estilos para
   react-router.
3. Card: tarjeta de 12 px, con el borde y el relleno de 04-design (16, 24 y
   32 px según el ancho).
4. Badge: pastilla con variantes neutral, primary y success. PlanBadge elige
   la variante según el plan (Basic, Pro, Enterprise). CountryBadge muestra el
   código en negrita y el nombre, sin bandera.
5. Field: etiqueta, campo y error, con un id generado (useId), aria-invalid y
   aria-describedby. Variantes TextField, NumberField (con sufijo opcional) y
   SelectField. El error con el estilo de "Campo con error".
6. InlineAlert: variantes success, error, warning e info; botón de cerrar y
   acción opcionales.
7. StatusPanel: icono, título, texto y acción opcionales, para los estados
   vacíos y de error.
8. Spinner: el indicador giratorio de 04-design. Con prefers-reduced-motion,
   no gira.

Comprueba: lint, typecheck, test y build en verde.
Commit: feat(web): componentes base
```

---

&nbsp;

**Qué revisaremos al terminar**

Ningún componente tiene colores ni medidas a mano (busco `[#` y `px]` en `src/`).

Todos los controles tienen 44 px de alto como mínimo y foco visible.

`Field` enlaza la etiqueta y el error con el campo.

&nbsp;

**Resultado de la revisión**

Hecho en `9f7a4f5`. Lint, typecheck y build en verde; sin colores ni medidas a mano. Los ocho componentes están, con 44 px en los controles, foco visible, `Field` enlazando etiqueta y error (`aria-invalid` y `aria-describedby`) y el indicador de carga quieto con `prefers-reduced-motion`.

Para la ronda de correcciones del final:
- `Field.tsx` tiene 220 líneas, por encima de las ~150 de `00-estructura.md`, y repite en sus tres variantes el mismo icono de error y la misma unión de `aria-describedby`. Se divide en `FieldShell` y un archivo por variante, o se saca lo repetido.
- `NumberField` reserva el hueco del sufijo aunque no tenga sufijo.
