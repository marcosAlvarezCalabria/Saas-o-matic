# Prompt 14c · api: dos consultas SQL fijas para el historial

**Para:** Codex

**Fecha:** 2026-11-25

**Objetivo:** Que el SQL del historial no se arme con texto en mitad de la consulta.

&nbsp;

**Por qué está escrito así**

`findByCustomerId` hace `archived_at IS ${archived ? 'NOT NULL' : 'NULL'}`. Es seguro, porque es un booleano que no viene del usuario, pero se parece a una inyección SQL y obliga a pararse a comprobarlo. Con dos consultas fijas no hay nada que comprobar. Lo vi en la revisión del 09b.

&nbsp;

---

```
Lee AGENTS.md. No cambia la spec.
No toques nada fuera de lo que pide esta tarea. Haz solo este prompt y para.

1. En api/src/infrastructure/db/SqliteSimulationRepository.ts, dos
   constantes con el SQL completo (activas y archivadas) y elige una
   según archived. Nada de texto interpolado en el SQL.
2. No cambia ningún comportamiento: los tests existentes deben pasar
   sin tocarlos.
Comprueba: tests, typecheck y lint de api en verde.
Commit: refactor(api): consultas fijas para el historial
```

---

&nbsp;

**Qué revisaremos al terminar**

`grep -n '\${' api/src/infrastructure/db/` no encuentra nada dentro de un SQL.
