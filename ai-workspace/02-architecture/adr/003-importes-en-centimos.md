# ADR-003 · Importes en céntimos e IVA guardado en cada simulación

**Estado:** aceptado

**Contexto.** `0.1 + 0.2 !== 0.3` en JavaScript. Un error de redondeo en un presupuesto es justo lo que un comercial no puede permitirse. Además, el IVA de un país puede cambiar.

**Decisión.** Todos los importes son enteros en céntimos, en dominio, BD y API. El IVA se expresa como porcentaje entero y su importe es `Math.round(baseCents * vatRate / 100)`. Cada simulación guarda `vatRate`, `vatCents` y `totalCents`.

**Alternativas.** Decimales en coma flotante (errores de redondeo). Librería de decimales (correcta, pero innecesaria con enteros). Recalcular el historial al leerlo (cambiaría importes ya presupuestados).

**Consecuencias.** El frontend divide entre 100 solo para mostrar y aplica el tipo de cambio en ese momento. El historial es inmutable.
