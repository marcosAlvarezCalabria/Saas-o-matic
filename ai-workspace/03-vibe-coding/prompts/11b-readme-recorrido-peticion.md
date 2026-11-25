# Prompt 11b · README: recorrido de una petición

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** que el README enseñe, con un diagrama, por qué carpetas pasa una petición y cómo vuelve la respuesta.

&nbsp;

**Por qué está escrito así**

Un diagrama de secuencia en Mermaid, que GitHub dibuja solo. Cada columna es una carpeta real del repo, así que el diagrama también sirve de mapa: quien quiera leer el código sabe por dónde empezar.

Se usa un caso concreto, guardar una simulación, porque pasa por todas las capas: validación de la forma, dominio (tramos e IVA), repositorio y BD. Los errores van en una nota aparte, para no llenar el dibujo de flechas.

&nbsp;

---

~~~
Lee AGENTS.md. No toques nada fuera de README.md.
Haz solo este prompt y para.

1. En README.md, justo debajo del título "## Arquitectura y decisiones" y
   antes de su primera viñeta, inserta el bloque de abajo, tal cual.
2. Comprueba que existen todos los archivos y carpetas que nombra. Si
   alguno no existe, no lo cambies: para y avísame.

Commit: docs: recorrido de una petición en el README
~~~

---

&nbsp;

## Bloque para el README

~~~markdown
### Recorrido de una petición

Así viaja "Guardar simulación" por las carpetas del proyecto. Cada capa solo conoce a la de debajo, y solo `errorHandler.ts` sabe de códigos HTTP.

```mermaid
sequenceDiagram
  autonumber
  actor U as Comercial
  participant C as web/src/components<br/>SaveSimulation.tsx
  participant W as web/src/api<br/>simulations.ts y apiClient.ts
  participant X as Caddy<br/>HTTPS
  participant H as api/src/infrastructure/http<br/>app.ts y routes/
  participant A as api/src/application<br/>use-cases/simulations
  participant D as api/src/domain<br/>pricing/
  participant R as api/src/infrastructure/db<br/>repositorios SQLite
  participant S as SQLite

  U->>C: pulsa "Guardar simulación"
  C->>W: createSimulation(customerId, users, storageGb, apiCalls)
  W->>X: POST /simulations con JSON
  X->>H: reenvía a api:3000
  H->>H: logger, CORS, límite de peticiones y forma del cuerpo
  H->>A: CreateSimulation.execute(input)
  A->>R: busca el cliente
  R-->>A: cliente con su país
  A->>D: calculateMonthlyCost(país, usuarios)
  D-->>A: base, IVA y total en céntimos
  A->>R: guarda la simulación
  R->>S: INSERT
  S-->>R: fila guardada
  R-->>A: Simulation
  A-->>H: Simulation
  H-->>W: 201 con JSON
  W-->>C: la simulación guardada
  C-->>U: "Simulación guardada" y el historial se recarga
  Note over H,D: Si algo falla, el dominio lanza DomainError y la aplicación ApplicationError.<br/>errorHandler.ts los convierte en 400, 404 o 409, y cualquier otro error en 500 sin traza.
```

| Capa | Carpeta | Qué hace | Conoce a |
|---|---|---|---|
| Interfaz | `web/src/components`, `pages`, `hooks` | pinta y recoge lo que hace el usuario | `web/src/api` |
| Cliente HTTP | `web/src/api` | el único sitio del front que habla con el exterior | — |
| HTTP | `api/src/infrastructure/http` | rutas, forma de la entrada y traducción de errores | `application` |
| Aplicación | `api/src/application` | un caso de uso por acción; define los puertos | `domain` y `ports` |
| Dominio | `api/src/domain` | reglas puras: tramos, IVA, NIF | nada |
| Datos | `api/src/infrastructure/db` | implementa los puertos con SQLite | `application/ports` |
~~~
