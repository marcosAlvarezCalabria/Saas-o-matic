# ADR-005 · better-sqlite3 con SQL a mano, sin ORM

**Estado:** aceptado

**Contexto.** El enunciado exige SQLite. Hay dos tablas y unas pocas consultas.

**Decisión.** better-sqlite3 (síncrono, rápido, sin callbacks) con sentencias preparadas. El esquema está en `schema.sql` y se aplica al arrancar con `CREATE TABLE IF NOT EXISTS`. La ruta del archivo viene de `DATABASE_PATH`; en tests, `:memory:`.

**Alternativas.** Prisma o Drizzle (migraciones y tipos, pero más capa que explicar y generar). sqlite3 asíncrono (más complejo sin ventaja aquí).

**Consecuencias.** Todo el SQL es visible y explicable en la presentación. Las sentencias preparadas evitan inyección SQL. Si el esquema creciera, se añadiría un sistema de migraciones (mejora futura).
