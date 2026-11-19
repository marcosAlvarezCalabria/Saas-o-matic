# ADR-006 · Búsqueda con GET y el texto en la URL

**Estado:** aceptado

**Contexto.** El buscador recibe un nombre de empresa o un identificador fiscal. En un GET el texto va en la URL (`/customers?search=B58754201`), y las URLs pueden quedar en logs del servidor, del proxy y en el historial del navegador. El resto de endpoints ya llevan los datos en el cuerpo; en la URL solo va el id del cliente, que no es sensible.

**Decisión.** Mantener `GET /customers?search=`.

**Motivos.**
- El CIF de una empresa es un dato público (registros mercantiles, facturas).
- Es una herramienta interna, sin exposición a terceros.
- GET es la semántica correcta para una lectura: es idempotente, cacheable y enlazable.

**Alternativas.** `POST /customers/search` con el texto en el cuerpo (no deja rastro en la URL, pero usa POST para una lectura y rompe la convención REST).

**Riesgo asumido.** Si el cliente es un autónomo, su NIF coincide con su DNI, que sí es un dato personal. Mitigación: no registrar la query string en los logs de la api (el logger registra método, ruta y estado, no los parámetros).

**Revisar si** la herramienta se abre a usuarios externos o se registran clientes personas físicas de forma habitual: entonces se pasa a POST.
