# Prompt 13c · Interruptor "Ver archivadas" y sin la nota de informativos

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que se vea claro si el historial enseña las activas o las archivadas, y quitar la nota que ocupa sitio en el simulador.

&nbsp;

**Por qué está escrito así**

Lo vi en la prueba en producción:
- **Los dos botones** "Activas" y "Archivadas" se parecían demasiado y no se sabía cuál estaba elegido. Un interruptor tiene solo dos estados, y se ve de un vistazo en cuál está.
- **La nota** ocupaba una franja entera del simulador para algo secundario. Pero sin ninguna pista, cambiar los GB y ver que el precio no se mueve parecería un fallo. Por eso queda una "i" al lado de cada etiqueta, con el texto. No vale solo "al pasar el ratón": en móvil no hay ratón y con teclado tampoco se llegaría. Por eso se abre también con Tab y tocándola, y el texto va enlazado al campo con `aria-describedby`.

Va después del 13a y del 13b porque toca los mismos componentes.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (sección 6,
Simulador e Historial) y ai-workspace/04-design/00-diseno.md (Simulador
e Historial), y el ADR-008. La spec ya está commiteada.
No toques ai-workspace/ ni api/. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. components/ui/Switch.tsx: un interruptor reutilizable.
   - <button role="switch" aria-checked={checked}> con la etiqueta
     asociada; se cambia con clic, espacio o Enter.
   - Medidas y colores de 04-design (pista de 44 × 24 px, apagado con
     border y surface, encendido con primary), con el contorno de foco
     común. Expórtalo en components/ui/index.ts.
2. SimulationHistoryHeader.tsx: sustituye los dos botones por
   <Switch label="Ver archivadas" checked={view === 'archived'} … />.
   El resto del comportamiento no cambia (página 1, sin aviso, contador
   de la vista abierta).
3. components/ui/InfoTip.tsx: un botón "i" (icono Info de 16 px, zona
   táctil de 24 px, aria-label "Más información") con un globo de texto
   (role="tooltip", con id). Se abre al pasar el ratón, con el foco y al
   tocarlo; se cierra al salir, al perder el foco, al tocar fuera o con
   Esc. Estilo de 04-design. Expórtalo en components/ui/index.ts.
4. Simulator.tsx: quita la nota informativa y pon un InfoTip detrás de
   las etiquetas de almacenamiento y de llamadas, con el texto
   "Informativo: no cambia el precio. El precio solo depende del número
   de usuarios.". Cada campo lleva aria-describedby con el id del texto.

Comprueba: lint, typecheck, test y build en verde. Prueba con teclado
(Tab hasta el interruptor y la "i"; espacio para cambiar; Esc para
cerrar el globo), con el móvil (tocar la "i") y en claro y en oscuro.
Commit: feat(web): interruptor de archivadas y sin la nota de informativos
```

---

&nbsp;

**Qué revisaremos al terminar**

Se ve a simple vista si el historial está en activas o en archivadas.

Un lector de pantalla anuncia "Ver archivadas, interruptor, activado" o "desactivado".

El simulador queda más compacto. La "i" se abre con el ratón, con Tab y tocándola, y el globo no tapa el campo de usuarios.
