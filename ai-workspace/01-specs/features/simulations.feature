# language: es
# @dominio: TDD en api/test/domain. @integracion: endpoints con SQLite en memoria.
# El cálculo ya está probado en el dominio (pricing.feature); aquí se prueba
# que los endpoints lo usan, lo guardan y nunca confían en el cliente.
# Importes calculados con el algoritmo de tramos + IVA.

Característica: Simulación y historial
  Como comercial
  Quiero ver el precio mientras muevo el slider y guardar las simulaciones
  Para presupuestar al cliente y consultar lo que le ofrecí

  Regla: Almacenamiento y llamadas son informativos
    Opcionales. Si faltan, valen 0. No afectan al precio.
    Enteros ≥ 0 y seguros en JavaScript (Number.isSafeInteger: como mucho 9 007 199 254 740 991).

    @dominio
    Esquema del escenario: Valores válidos
      Dado un almacenamiento de <gb> GB y <llamadas> llamadas
      Cuando valido el uso de la simulación
      Entonces el almacenamiento queda en <gb_final> y las llamadas en <llamadas_final>

      Ejemplos:
        | gb        | llamadas  | gb_final | llamadas_final |
        | 100       | 50000     | 100      | 50000          |
        | 0         | 0         | 0        | 0              |
        | sin valor | sin valor | 0        | 0              |

    @dominio
    Esquema del escenario: Valores no válidos
      Dado un almacenamiento de <gb> GB y <llamadas> llamadas
      Cuando valido el uso de la simulación
      Entonces se rechaza con el código "VALIDATION_ERROR"

      Ejemplos:
        | gb               | llamadas         | motivo                  |
        | -1               | 0                | negativo                |
        | 1.5              | 0                | decimal                 |
        | 0                | -1               | negativo                |
        | 0                | 1.5              | decimal                 |
        | 9007199254740992 | 0                | deja de ser entero exacto |
        | 0                | 9007199254740992 | deja de ser entero exacto |

  Regla: Previsualizar (POST /simulations/preview) calcula sin guardar

    Antecedentes:
      Dado un cliente de "ES" registrado
      Y un cliente de "FR" registrado

    @integracion
    Esquema del escenario: Desglose según país y usuarios
      Cuando previsualizo <usuarios> usuarios para el cliente de "<país>"
      Entonces la respuesta es 200 con base <base>, IVA <iva_bp> puntos básicos, importe de IVA <importe> y total <total> céntimos

      Ejemplos:
        | país | usuarios | base     | iva_bp | importe  | total    |
        | ES   | 15       | 14000    | 2100   | 2940     | 16940    |
        | FR   | 51       | 42500    | 2000   | 8500     | 51000    |
        | ES   | 100000   | 50017000 | 2100   | 10503570 | 60520570 |

    @integracion
    Escenario: Solo devuelve el desglose
      Cuando previsualizo 15 usuarios para el cliente de "ES"
      Entonces la respuesta tiene exactamente los campos baseCents, vatRateBasisPoints, vatCents y totalCents

    @integracion
    Escenario: El preview no se guarda en el historial
      Cuando previsualizo 15 usuarios para el cliente de "ES"
      Entonces el historial del cliente de "ES" está vacío

  Regla: Crear simulación (POST /simulations) calcula y guarda

    Antecedentes:
      Dado un cliente de "ES" registrado

    @integracion
    Escenario: Se guarda con el desglose completo
      Cuando creo una simulación de 15 usuarios, 100 GB y 50000 llamadas para el cliente de "ES"
      Entonces la respuesta es 201 con base 14000, IVA 2100 puntos básicos, importe de IVA 2940 y total 16940 céntimos
      Y la simulación tiene un id, el id del cliente, 15 usuarios, 100 GB, 50000 llamadas y una fecha
      Y el historial del cliente de "ES" contiene esa simulación

    @integracion
    Escenario: Almacenamiento y llamadas son opcionales
      Cuando creo una simulación de 15 usuarios sin almacenamiento ni llamadas
      Entonces la respuesta es 201 con almacenamiento 0 y llamadas 0

    @integracion
    Escenario: Se ignoran los importes y los campos que envía el cliente
      Cuando creo una simulación de 15 usuarios para el cliente de "ES" enviando "baseCents": 1, "vatRateBasisPoints": 0, "vatCents": 0, "totalCents": 1 y "discount": 50
      Entonces la respuesta es 201 con base 14000, IVA 2100 puntos básicos, importe de IVA 2940 y total 16940 céntimos
      Y la respuesta no tiene el campo "discount"

  Regla: Entrada no válida (preview y crear)
    Orden: forma (capa HTTP) → valores (dominio) → cliente (404).
    customerId es un identificador: lo comprueba la capa HTTP (entero ≥ 1).

    Antecedentes:
      Dado un cliente de "ES" registrado

    @integracion
    Esquema del escenario: Datos no válidos
      Cuando envío a <endpoint> el campo <campo> con valor <valor> y el resto válido
      Entonces la respuesta es 400 con el código "VALIDATION_ERROR"

      Ejemplos:
        | endpoint             | campo      | valor   | motivo                 |
        | /simulations/preview | users      | 0       | por debajo del mínimo  |
        | /simulations/preview | users      | 2.5     | decimal                |
        | /simulations/preview | users      | "15"    | texto                  |
        | /simulations/preview | users      | null    | nulo                   |
        | /simulations/preview | users      | 100001  | por encima del tope    |
        | /simulations/preview | customerId | 0       | id no válido           |
        | /simulations         | users      | 100001  | por encima del tope    |
        | /simulations         | storageGb  | -1      | negativo               |
        | /simulations         | storageGb  | null    | nulo                   |
        | /simulations         | apiCalls   | 1.5     | decimal                |
        | /simulations         | apiCalls   | "50000" | texto                  |
        | /simulations         | customerId | 0       | id no válido           |
        | /simulations         | customerId | 1.5     | id decimal             |
        | /simulations         | customerId | "1"     | id como texto          |

    @integracion
    Esquema del escenario: Falta un campo obligatorio
      Cuando envío a <endpoint> un cuerpo sin <campo>
      Entonces la respuesta es 400 con el código "VALIDATION_ERROR"

      Ejemplos:
        | endpoint             | campo      |
        | /simulations/preview | users      |
        | /simulations/preview | customerId |
        | /simulations         | users      |
        | /simulations         | customerId |

    @integracion
    Escenario: El cuerpo no es un objeto
      Cuando envío a /simulations el cuerpo []
      Entonces la respuesta es 400 con el código "VALIDATION_ERROR"

    @integracion
    Escenario: La entrada se valida antes de buscar al cliente
      Cuando envío a /simulations 0 usuarios para el cliente 9999
      Entonces la respuesta es 400 con el código "VALIDATION_ERROR"

    @integracion
    Esquema del escenario: Cliente inexistente
      Cuando envío a <endpoint> 15 usuarios para el cliente 9999
      Entonces la respuesta es 404 con el código "CUSTOMER_NOT_FOUND"
      Y no se guarda ninguna simulación

      Ejemplos:
        | endpoint             |
        | /simulations/preview |
        | /simulations         |

  Regla: Historial (GET /customers/:id/simulations)
    Orden: las más recientes primero (empate en fecha → id mayor primero).

    Antecedentes:
      Dado un cliente de "ES" registrado
      Y un cliente de "FR" registrado

    @integracion
    Escenario: Varias simulaciones, la última primero
      Dado que creo simulaciones de 15, 40 y 51 usuarios para el cliente de "ES", en ese orden
      Cuando pido su historial
      Entonces obtengo 3 simulaciones con usuarios 51, 40 y 15
      # Se crean en el mismo milisegundo casi siempre: el test prueba también el desempate por id.

    @integracion
    Escenario: Cada simulación trae su desglose
      Dado que creo una simulación de 15 usuarios para el cliente de "ES"
      Cuando pido su historial
      Entonces la simulación tiene base 14000, IVA 2100 puntos básicos, importe de IVA 2940 y total 16940 céntimos

    @integracion
    Escenario: Solo salen las simulaciones del cliente
      Dado que creo una simulación de 15 usuarios para el cliente de "ES"
      Cuando pido el historial del cliente de "FR"
      Entonces obtengo una lista vacía

    @integracion
    Escenario: Sin simulaciones
      Cuando pido el historial del cliente de "FR"
      Entonces obtengo una lista vacía

    @integracion
    Escenario: Historial de un cliente inexistente
      Cuando pido el historial del cliente 9999
      Entonces la respuesta es 404 con el código "CUSTOMER_NOT_FOUND"

    @integracion
    Esquema del escenario: Id mal formado
      Cuando pido el historial del cliente "<id>"
      Entonces la respuesta es 400 con el código "VALIDATION_ERROR"

      Ejemplos:
        | id  |
        | abc |
        | 0   |
        | 1.0 |

  Regla: Errores comunes

    @integracion
    Escenario: Ruta inexistente
      Cuando pido "GET /no-existe"
      Entonces la respuesta es 404 con el código "NOT_FOUND"

    @integracion
    Escenario: JSON mal formado
      Cuando envío a /simulations un cuerpo que no es JSON válido
      Entonces la respuesta es 400 con el código "VALIDATION_ERROR"

    @integracion
    Escenario: Error inesperado
      Cuando un caso de uso lanza un Error("fallo interno de prueba")
      Entonces la respuesta es 500 con el código "INTERNAL_ERROR"
      Y la respuesta no incluye "fallo interno de prueba" ni la traza
      Y el error se registra en el servidor con su traza
