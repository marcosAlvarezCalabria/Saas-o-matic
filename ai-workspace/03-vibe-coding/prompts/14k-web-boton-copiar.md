# Prompt 14k · web: botón "Copiar" junto a "Enviar"

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que el texto de una simulación se pueda copiar para pegarlo en cualquier correo, también en los equipos sin programa de correo.

&nbsp;

**Por qué está escrito así**

En la prueba en producción, "Enviar" funcionó en el móvil pero en el ordenador no hizo nada: Windows no tenía ningún programa asignado a `mailto:`. El código estaba bien, pero al evaluador le puede pasar lo mismo. "Copiar" usa el mismo texto que el correo, así que la lógica es la que ya tiene tests: solo se reparte en dos funciones.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (sección 6, Historial, y sección 6 bis) y ai-workspace/04-design/00-diseno.md (Historial). La spec ya está actualizada y commiteada.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.
Reglas de estilo (ADR-008): solo clases del tema. Nada entre corchetes.

1. Tests primero, en web/src/lib/simulationEmail.test.ts:
   buildSimulationClipboardText(customer, simulation, conversion)
   devuelve "Para: compras@acme.es", "Asunto: Simulación de SaaS-O-Matic
   para Acme Ibérica S.L.", una línea vacía y el mismo cuerpo que ya
   prueba el test del mailto, todo separado por "\n". Comprueba que
   falla.
   Commit: test(web): texto de una simulación para copiar
2. Implementa:
   - lib/simulationEmail.ts: una función interna que da { to, subject,
     body }; buildSimulationMailto y buildSimulationClipboardText la
     usan. El test del mailto no cambia.
   - components/CopySimulationButton.tsx: copia con
     navigator.clipboard.writeText; al copiar, icono Check 2 s y un
     <span role="status"> oculto con "Texto copiado"; si falla, llama a
     onError. Botón soft, size compact, icono Copy, aria-label "Copiar la
     simulación del {fecha}"; en escritorio solo el icono, como "Enviar".
   - SimulationHistoryList.tsx: el botón en las activas, junto a
     "Enviar". Si falla, el historial muestra "No se pudo copiar el
     texto." en su aviso de error.
Comprueba: lint, typecheck, test y build de web en verde. Prueba a mano
pegar el texto en un correo, en claro y en oscuro, a 375 y a 1280 px.
Commit: feat(web): botón Copiar junto a Enviar
```

---

&nbsp;

**Qué revisaremos al terminar**

El texto pegado es el del correo, con tildes y €. El test del mailto no ha cambiado.
