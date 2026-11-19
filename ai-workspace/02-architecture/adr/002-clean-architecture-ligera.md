# ADR-002 · Clean Architecture ligera en la api

**Estado:** aceptado

**Contexto.** Las reglas de negocio (tramos, IVA, NIF) son lo que más se evalúa y lo que más fácil es romper. Tienen que poder testearse sin Express ni SQLite, y el código lo genera una IA, que tiende a mezclar capas.

**Decisión.** Tres capas en `api/src`: `domain` (funciones puras), `application` (un caso de uso por archivo, depende de interfaces de repositorio) e `infrastructure` (Express y SQLite). Inyección manual en `main.ts`.

**Alternativas.** Todo en controladores Express (rápido, pero el cálculo queda atado a HTTP y a la BD). Hexagonal completa con contenedor de inyección, DTOs por capa y mappers (sobreingeniería para 6 endpoints).

**Consecuencias.** El dominio se testea con TDD en milisegundos. Las únicas abstracciones son dos interfaces de repositorio; en los tests de integración se usa SQLite en memoria, no mocks. Regla para Codex: si una capa no aporta nada en un caso concreto, no se crea.
