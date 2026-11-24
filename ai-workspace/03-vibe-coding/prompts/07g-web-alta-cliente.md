# Prompt 07g · Modal de alta de cliente

**Para:** Codex

**Fecha:** 2026-11-23

**Objetivo:** dar de alta un cliente desde el Dashboard, con cada error de la api junto a su campo.

&nbsp;

**Por qué está escrito así**

Las reglas (NIF, país, email) las aplica la api: el front solo comprueba que los campos estén rellenos (`02-interfaz.md`, sección 5). Lo que sí hace el front es poner cada error de la api en su sitio.

El `<dialog>` nativo ya resuelve el foco, Escape y el fondo: no hace falta una librería de modales.

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

1. components/CustomerFormDialog.tsx, con un <dialog> nativo (showModal):
   - Escritorio y tablet: centrado, máximo 512 px. Móvil (por debajo de md):
     hoja desde abajo. Fondo con --color-scrim (::backdrop).
   - Cabecera, campos y pie como 04-design, sección 5. Campos en este orden:
     nombre, país (SelectField con COUNTRIES), identificador fiscal, email y
     plan (fieldset con legend "Plan" y tres input radio).
   - Validación del navegador: required y type="email". Nada más.
   - Al enviar: createCustomer. Botón "Guardando…" desactivado.
   - Errores, según la tabla de 02-interfaz.md, sección 5: INVALID_TAX_ID y
     TAX_ID_ALREADY_EXISTS bajo el identificador; COUNTRY_NOT_SUPPORTED bajo
     el país; VALIDATION_ERROR, 429, 500 y sin conexión, arriba.
   - Al crear: se cierra y navega a /customers/:id del cliente nuevo.
   - Al cerrar (Escape, X o "Cancelar"), el formulario se vacía.
2. DashboardPage: "Nuevo cliente" (en la cabecera y en el estado vacío)
   abre el modal.

Comprueba: lint, typecheck, test y build en verde. A mano, con la api:
el NIF B58754201 se crea; uno inventado da el error bajo el campo; repetir el
mismo NIF da el 409 bajo el campo; todo se puede hacer con el teclado.
Commit: feat(web): alta de cliente
```

---

&nbsp;

**Qué revisaremos al terminar**

Cada error de la api sale en su campo, con `aria-invalid`.

Pulsar "Guardar cliente" dos veces seguidas no lanza dos peticiones.

En móvil el modal sale desde abajo y se puede cerrar con Escape y con la X.

&nbsp;

**Resultado de la revisión**

Hecho en `241ca9c`, repartido en `CustomerFormDialog`, `CustomerFormFields`, `CustomerPlanField` y `customerFormErrors`. `<dialog>` nativo, hoja desde abajo en móvil y centrado desde `md`. País antes que el identificador; el plan como grupo de radios accesible con el teclado. Cada error de la api va a su campo según la tabla de la spec (429 incluido). Un `ref` impide el doble envío, y Escape no cierra el modal mientras guarda.
