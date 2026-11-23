# Prompt 05c · Repositorio SQLite de simulaciones

**Para:** Codex

**Fecha:** 2026-11-22

**Objetivo:** guardar y listar simulaciones en SQLite, con el tope de usuarios también en la BD.

&nbsp;

**Por qué está escrito así**

El CHECK de usuarios es la segunda barrera (`01-modelo-datos.md`): si un día el dominio falla, la BD no guarda un dato imposible.

La fecha la pone la BD. El repositorio devuelve la fila leída de la BD para que `createdAt` sea el valor guardado, no uno inventado en el código.

&nbsp;

---

```
Lee AGENTS.md y ai-workspace/02-architecture/01-modelo-datos.md.
La spec ya está actualizada y commiteada.
No toques nada de ai-workspace/ ni nada fuera de lo que pide esta tarea.

1. api/src/infrastructure/db/schema.ts: el CHECK de users pasa a
   BETWEEN 1 AND 100000, como en 01-modelo-datos.md. No cambies nada más
   del esquema.

2. api/src/infrastructure/db/SqliteSimulationRepository.ts implementa
   SimulationRepository:
   - Sentencias preparadas, nunca texto concatenado.
   - create: INSERT sin created_at (lo pone la BD) y devuelve la fila
     guardada leída de la BD (RETURNING o SELECT por lastInsertRowid).
   - findByCustomerId: WHERE customer_id = ?
     ORDER BY created_at DESC, id DESC.
   - snake_case en la BD y camelCase fuera; la traducción, solo aquí.
   - No captures los errores de SQLite: que lleguen al errorHandler (500).

Ejecuta tests, typecheck y lint. Todo tiene que seguir en verde.
Commit: feat(api): repositorio SQLite de simulaciones

No añadas dependencias.
```

---

&nbsp;

**Qué revisaremos al terminar**

Ningún SQL se construye concatenando texto.

El desempate por `id DESC` está en la consulta.

**Antes de arrancar la api en local:** borrar el `.sqlite` de desarrollo. Con `CREATE TABLE IF NOT EXISTS`, una BD antigua no recibe el CHECK nuevo.

&nbsp;

**Resultado de la revisión**

Hecho en `f4e839f`. Sentencias preparadas, `INSERT … RETURNING *` (la fecha sale de la BD) y `ORDER BY created_at DESC, id DESC`. CHECK de 1 a 100 000 en `schema.ts`.
