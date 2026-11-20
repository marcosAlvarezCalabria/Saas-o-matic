# language: es
# Etiquetas:
#   @dominio     → test unitario en api/test/domain (TDD)
#   @integracion → test de endpoint en api/test/integration (SQLite en memoria)
# Los NIF usados están calculados con el algoritmo (ver tax-id.feature).

Característica: Alta, búsqueda y ficha de clientes
  Como comercial
  Quiero registrar clientes corporativos y encontrarlos rápido
  Para simular su coste mensual

  Regla: Campos del cliente
    Nombre: obligatorio, se recorta, de 2 a 100 caracteres.
    Email: formato básico (texto@texto.texto, sin espacios).
    Plan: basic, pro o enterprise.
    País: se recorta y se pasa a mayúsculas; después, dos letras.

    @dominio
    Esquema del escenario: Campo no válido
      Cuando creo un cliente con <campo> igual a <valor>
      Entonces se rechaza con el código "VALIDATION_ERROR"

      Ejemplos:
        | campo       | valor              | motivo                |
        | companyName | "A"                | menos de 2 caracteres |
        | companyName | "   "              | vacío tras recortar   |
        | email       | "compras.acme.es"  | sin arroba            |
        | email       | "compras@acme"     | sin dominio           |
        | email       | "com pras@acme.es" | con espacio           |
        | plan        | "gold"             | plan no permitido     |
        | country     | "ESP"              | tres letras           |
        | country     | "E1"               | no son dos letras     |

    @dominio
    Esquema del escenario: País normalizado
      Cuando creo un cliente con country igual a <entrada>
      Entonces el país guardado es "ES"

      Ejemplos:
        | entrada  |
        | "es"     |
        | "Es"     |
        | " ES "   |

    @dominio
    Escenario: Nombre de 101 caracteres
      Cuando creo un cliente con un nombre de 101 caracteres
      Entonces se rechaza con el código "VALIDATION_ERROR"

    @dominio
    Esquema del escenario: Nombre normalizado para buscar
      Cuando calculo el nombre de búsqueda de <nombre>
      Entonces el resultado es <busqueda>

      Ejemplos:
        | nombre                | busqueda            | motivo                  |
        | "Café Ibérico S.L."   | "cafe iberico s.l." | minúsculas y sin tildes |
        | "  ACME Ibérica  "    | "acme iberica"      | se recorta              |
        | "Ñandú Logística"     | "nandu logistica"   | la ñ pasa a n           |

  Regla: Alta de cliente (POST /customers)
    Orden de validación: campos → país en la tabla de IVA → identificador fiscal → duplicado.

    @integracion
    Escenario: Alta correcta
      Cuando envío un cliente con nombre "  Acme Ibérica S.L. ", NIF "b-58754201", país "ES" y plan "pro"
      Entonces la respuesta es 201
      Y el cliente tiene un id y una fecha de alta
      Y el nombre guardado es "Acme Ibérica S.L."
      Y el NIF guardado es "B58754201"

    @integracion
    Escenario: NIF no válido
      Cuando envío un cliente de "ES" con NIF "B58754202"
      Entonces la respuesta es 400 con el código "INVALID_TAX_ID"

    @integracion
    Escenario: País sin IVA definido
      Cuando envío un cliente de "US" con NIF "123456789"
      Entonces la respuesta es 400 con el código "COUNTRY_NOT_SUPPORTED"

    @integracion
    Escenario: Falta un campo obligatorio
      Cuando envío un cliente sin email
      Entonces la respuesta es 400 con el código "VALIDATION_ERROR"

    @integracion
    Escenario: NIF duplicado escrito de otra forma
      Dado un cliente registrado con NIF "12345678Z"
      Cuando envío otro cliente con NIF "12345678-z"
      Entonces la respuesta es 409 con el código "TAX_ID_ALREADY_EXISTS"

    @integracion
    Escenario: Duplicado que llega a la base de datos (condición de carrera)
      Dado un cliente guardado con NIF "B58754201"
      Cuando el repositorio intenta guardar otro con el mismo NIF
      Entonces lanza ApplicationError con el código "TAX_ID_ALREADY_EXISTS"
      # Simula dos altas simultáneas que pasan la comprobación previa a la vez.
      # Sin esto, la restricción UNIQUE de SQLite acabaría en un 500.

  Regla: Búsqueda (GET /customers?search=)
    Un único buscador: coincidencia parcial en nombre o NIF.
    El nombre se compara sin mayúsculas ni tildes; el NIF, normalizado.
    Orden: los más recientes primero (empate en fecha → id mayor primero).

    Antecedentes:
      Dado que están registrados, en este orden:
        | nombre             | nif       | país |
        | Café Ibérico S.L.  | B58754201 | ES   |
        | Acme Deutschland   | DE123456789 | DE |
        | Logística Norte SA | A58754201 | ES   |

    @integracion
    Esquema del escenario: Buscar clientes
      Cuando busco "<texto>"
      Entonces obtengo <resultado>

      Ejemplos:
        | texto     | resultado                                                   | motivo                    |
        |           | Logística Norte SA, Acme Deutschland, Café Ibérico S.L. | sin texto: todos, recientes primero |
        | cafe      | Café Ibérico S.L.                                           | sin tilde                 |
        | ACME      | Acme Deutschland                                            | sin distinguir mayúsculas |
        | b-5875    | Café Ibérico S.L.                                           | NIF parcial con guion     |
        | 58754201  | Logística Norte SA, Café Ibérico S.L.                       | coincide en los dos NIF   |
        | zzz       | (lista vacía)                                               | sin resultados, no error  |

    @integracion
    Escenario: Los comodines se buscan como texto
      Cuando busco "%"
      Entonces obtengo una lista vacía

  Regla: Ficha de cliente (GET /customers/:id)
    El id tiene que ser solo dígitos, sin ceros a la izquierda: 1, 2, 3...

    @integracion
    Escenario: Cliente existente
      Dado un cliente registrado
      Cuando pido su ficha por id
      Entonces la respuesta es 200 con sus datos

    @integracion
    Esquema del escenario: Id no válido o inexistente
      Cuando pido la ficha del cliente "<id>"
      Entonces la respuesta es <estado> con el código "<código>"

      Ejemplos:
        | id   | estado | código             |
        | abc  | 400    | VALIDATION_ERROR   |
        | 0    | 400    | VALIDATION_ERROR   |
        | 1.0  | 400    | VALIDATION_ERROR   |
        | 1e0  | 400    | VALIDATION_ERROR   |
        | 0x1  | 400    | VALIDATION_ERROR   |
        | 9999 | 404    | CUSTOMER_NOT_FOUND |
