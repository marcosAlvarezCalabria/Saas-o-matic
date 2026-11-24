# Prompt 09a · Seed de datos de demostración

**Para:** Codex

**Fecha:** 2026-11-24

**Objetivo:** un comando que llena la BD con clientes y simulaciones inventados, para que la demo se vea con datos.

&nbsp;

**Por qué está escrito así**

El evaluador abre un enlace público. Con la BD vacía no puede probar la paginación, los duplicados ni el buscador sin crear antes muchas simulaciones a mano.

El seed usa los casos de uso, no SQL. Es un adaptador más de la capa de aplicación, como las rutas HTTP: los datos pasan las mismas validaciones y los importes salen del dominio. Por eso no lleva ningún precio escrito, y su test no comprueba importes.

La función `seedDemoData` recibe los casos de uso. El archivo `seed.ts` solo monta las piezas, igual que `main.ts`. Así se prueba con una BD en memoria sin lanzar ningún proceso.

&nbsp;

---

```
Lee AGENTS.md, ai-workspace/01-specs/03-datos-demo.md y
ai-workspace/02-architecture/00-estructura.md. La spec ya está
actualizada y commiteada.
No toques nada de ai-workspace/ ni de web/, ni nada fuera de lo que pide
esta tarea. Haz solo este prompt y para.

1. Test primero, en api/test/infrastructure/seedDemoData.test.ts, con
   createDatabase(':memory:') y los repositorios y casos de uso reales:
   - Con la BD vacía: devuelve { status: 'seeded', customers: 9,
     simulations: 19 } y la búsqueda vacía devuelve 9 clientes.
   - "Nube Norte S.L." tiene 7 simulaciones y "Taller Ibérico", 0.
   - Buscar "nube" devuelve 2 clientes, y "iberico", 1.
   - Todos los emails terminan en ".example.com".
   - Si se lanza por segunda vez: { status: 'skipped' } y siguen 9 y 19.
   - Si la BD ya tiene un cliente que no es del seed: 'skipped' y no
     añade nada.
   Ejecuta y comprueba que falla.
   Commit: test(api): seed de datos de demostración

2. Implementa:
   - api/src/infrastructure/seed/demoData.ts: los 9 clientes y sus
     simulaciones de 03-datos-demo.md, copiados tal cual. Solo datos.
   - api/src/infrastructure/seed/seedDemoData.ts:
     seedDemoData({ createCustomer, searchCustomers, createSimulation }).
     Si searchCustomers.execute('') devuelve algún cliente → 'skipped'.
     Si no, crea cada cliente y sus simulaciones con el id que devuelve
     createCustomer. Sin SQL ni repositorios aquí.
   - api/src/seed.ts: crea la BD con DATABASE_PATH (el mismo valor por
     defecto que main.ts), los repositorios y los tres casos de uso, llama
     a seedDemoData e imprime una línea: "Datos de demostración cargados:
     9 clientes y 19 simulaciones." o "La base de datos ya tiene clientes;
     no se carga nada.".
   - api/package.json: "seed": "tsx src/seed.ts". El build ya incluye
     src/, así que dist/seed.js sale solo.
   Ejecuta tests, typecheck y lint. Comprueba que pnpm --filter api seed
   funciona dos veces seguidas sobre una BD nueva (la segunda dice que ya
   hay clientes). No commitees ningún .sqlite.
   Commit: feat(api): seed de datos de demostración

Si un NIF de la tabla no pasa la validación, no lo cambies: para y
avísame con el caso.
```

---

&nbsp;

**Qué revisaremos al terminar**

El commit de test va antes que el de implementación.

`seedDemoData.ts` no importa nada de `db/`, solo los casos de uso.

Lanzado dos veces, no duplica nada.

En la web: paginación en Nube Norte, historial vacío en Taller Ibérico y el buscador con "nube" y con "iberico".
