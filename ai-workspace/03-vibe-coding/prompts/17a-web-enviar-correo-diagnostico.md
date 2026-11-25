# Prompt 17a · "Enviar" no abre el correo en algunos ordenadores (diagnóstico)

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** entender por qué "Enviar" no abre el correo en algunos ordenadores y proponer una solución. **Sin tocar código todavía.**

&nbsp;

**Por qué está escrito así**

Solo describo el problema y las condiciones; la solución la propone Codex. Primero se diagnostica y se propone, después se escribe en la spec y al final se implementa (primero la spec).

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/02-interfaz.md (sección 6,
Historial, y sección 6 bis, "Correo de una simulación") y
ai-workspace/03-vibe-coding/prueba-manual.md (resultados).
NO cambies ningún archivo en este prompt: solo diagnostica y propón.

EL PROBLEMA
- En cada simulación del historial, "Enviar" es un enlace mailto: con el
  destinatario, el asunto y el cuerpo (lib/simulationEmail.ts).
- En el móvil (iPhone) funciona: se abre la app de correo con todo
  relleno.
- En mi ordenador con Windows, en Chrome, no pasa nada: en la pestaña
  Red el enlace aparece como (canceled) y no sale ningún error.
- En el mismo ordenador, en Edge, al pulsar "Enviar" me lleva a Google
  en lugar de abrir un correo.
- Ese Windows no tenía ninguna app asociada a mailto:, y en Chrome
  mail.google.com estaba en la lista de sitios bloqueados para
  gestionar protocolos.
- Ya existe "Copiar" como alternativa, pero quiero que "Enviar" abra un
  correo listo para mandar también en un ordenador, como en el móvil.

CONDICIONES
- La demo es pública y sin login: no se envían correos desde la api ni
  se guardan claves de servicios de correo.
- Tiene que seguir funcionando en el móvil igual que ahora.
- Solo clases del tema (ADR-008), nada entre corchetes, y ningún archivo
  de más de ~150 líneas.
- El texto del correo sale de lib/simulationEmail.ts, que ya tiene
  tests: cualquier enlace nuevo se arma ahí y con su test.

LO QUE TE PIDO
1. Explica por qué pasa lo de Chrome y lo de Edge (qué hace el
   navegador con mailto: cuando no hay app asociada).
2. Dime qué se puede arreglar desde la web y qué depende solo de la
   configuración del equipo.
3. Propón una o dos soluciones, con lo que cambiaría en la interfaz,
   los archivos que tocarías y cómo lo probarías.
4. Para aquí y espera a que elija una.
```

---

&nbsp;

**Qué revisaremos al terminar**

Que el diagnóstico separa lo que es de la web y lo que es del equipo.

Que la propuesta no envía correos desde la api ni guarda claves.

&nbsp;

**Resultado**

Mientras Codex lo diagnosticaba, el problema se resolvió en la configuración del equipo, sin cambiar código: en Chrome, `mail.google.com` estaba en la lista de sitios bloqueados para gestionar protocolos. Al quitarlo y permitir que Gmail abra los enlaces `mailto:`, "Enviar" abre el correo con todo relleno, igual que en el móvil.

Confirma el diagnóstico de la prueba en producción: el código estaba bien y depende de que el equipo tenga una app asociada a `mailto:`. Para quien no la tenga, está "Copiar" (14k).
