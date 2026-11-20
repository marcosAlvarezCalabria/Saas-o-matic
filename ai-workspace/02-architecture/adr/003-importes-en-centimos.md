# ADR-003 · Importes en céntimos e IVA guardado en cada simulación

**Estado:** aceptado

**Contexto.** `0.1 + 0.2 !== 0.3` en JavaScript. Un error de redondeo en un presupuesto es justo lo que un comercial no puede permitirse. Además, el IVA de un país puede cambiar.

**Decisión.** Todos los importes son enteros en céntimos, en dominio, BD y API. El IVA se expresa como porcentaje entero y su importe es `Math.round(baseCents * vatRate / 100)`. Cada simulación guarda `vatRate`, `vatCents` y `totalCents`.

**Actualización (2026-11-20).** Al ampliar la tabla a toda la UE apareció Finlandia, con un 25,5 %. Para seguir sin decimales, el tipo pasa a **puntos básicos** (centésimas de punto): 21 % = 2100; 25,5 % = 2550. El importe es `Math.round(baseCents * vatRateBasisPoints / 10_000)`. El campo se llama `vatRateBasisPoints` en dominio y API, y `vat_rate_basis_points` en la BD. Alternativas descartadas: guardar 25.5 como decimal (rompe la regla de enteros) y dejar fuera a Finlandia (un supuesto evitable).

**Alternativas.** Decimales en coma flotante (errores de redondeo). Librería de decimales (correcta, pero innecesaria con enteros). Recalcular el historial al leerlo (cambiaría importes ya presupuestados).

**Consecuencias.** El frontend divide entre 100 solo para mostrar y aplica el tipo de cambio en ese momento. El historial es inmutable.
