# language: es
# Todos @integracion: tests de endpoint con SQLite en memoria.
# El cálculo ya está probado en el dominio (pricing.feature); aquí se prueba
# que los endpoints lo usan, lo guardan y nunca confían en el cliente.
# Importes calculados con el algoritmo de tramos + IVA.

Característica: Simulación y historial
  Como comercial
  Quiero ver el precio mientras muevo el slider y guardar las simulaciones
  Para presupuestar al cliente y consultar lo que le ofrecí

  Antecedentes:
    Dado un cliente de "ES" registrado
    Y un cliente de "FR" registrado

  Regla: Previsualizar (POST /simulations/preview) calcula sin guardar

    @integracion
    Esquema del escenario: Desglose según país y usuarios
      Cuando previsualizo <usuarios> usuarios para el cliente de "<país>"
      Entonces la respuesta es 200 con base <base>, IVA <iva_bp> puntos básicos, importe de IVA <importe> y total <total> céntimos

      Ejemplos:
        | país | usuarios | base  | iva_bp | importe | total |
        | ES   | 15       | 14000 | 2100   | 2940    | 16940 |
        | FR   | 51       | 42500 | 2000   | 8500    | 51000 |

    @integracion
    Escenario: El preview no se guarda en el historial
      Cuando previsualizo 15 usuarios para el cliente de "ES"
      Entonces el historial del cliente de "ES" está vacío

  Regla: Crear simulación (POST /simulations) calcula y guarda

    @integracion
    Escenario: Se guarda con el desglose completo
      Cuando creo una simulación de 15 usuarios, 100 GB y 50000 llamadas para el cliente de "ES"
      Entonces la respuesta es 201 con base 14000, IVA 2100 puntos básicos, importe de IVA 2940 y total 16940 céntimos
      Y la simulación tiene un id y una fecha
      Y el historial del cliente de "ES" contiene esa simulación

    @integracion
    Escenario: Almacenamiento y llamadas son opcionales
      Cuando creo una simulación de 15 usuarios sin almacenamiento ni llamadas
      Entonces la respuesta es 201 con almacenamiento 0 y llamadas 0

    @integracion
    Escenario: Se ignoran los importes que envía el cliente
      Cuando creo una simulación de 15 usuarios para el cliente de "ES" enviando "totalCents": 1
      Entonces la respuesta es 201 con total 16940 céntimos

  Regla: Entrada no válida (preview y crear)

    @integracion
    Esquema del escenario: Datos no válidos
      Cuando envío a <endpoint> el campo <campo> con valor <valor>
      Entonces la respuesta es 400 con el código "VALIDATION_ERROR"

      Ejemplos:
        | endpoint             | campo      | valor |
        | /simulations/preview | users      | 0     |
        | /simulations/preview | users      | 2.5   |
        | /simulations/preview | users      | "15"  |
        | /simulations         | storageGb  | -1    |
        | /simulations         | apiCalls   | 1.5   |
        | /simulations         | customerId | 0     |

    @integracion
    Esquema del escenario: Cliente inexistente
      Cuando envío a <endpoint> el cliente 9999
      Entonces la respuesta es 404 con el código "CUSTOMER_NOT_FOUND"

      Ejemplos:
        | endpoint             |
        | /simulations/preview |
        | /simulations         |

  Regla: Historial (GET /customers/:id/simulations)
    Orden: las más recientes primero (empate en fecha → id mayor primero).

    @integracion
    Escenario: Varias simulaciones, la última primero
      Dado que creo simulaciones de 15, 40 y 51 usuarios para el cliente de "ES", en ese orden
      Cuando pido su historial
      Entonces obtengo 3 simulaciones con usuarios 51, 40 y 15

    @integracion
    Escenario: Sin simulaciones
      Cuando pido el historial del cliente de "FR"
      Entonces obtengo una lista vacía

    @integracion
    Escenario: Historial de un cliente inexistente
      Cuando pido el historial del cliente 9999
      Entonces la respuesta es 404 con el código "CUSTOMER_NOT_FOUND"

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
      Cuando un caso de uso lanza un error que no es de dominio ni de aplicación
      Entonces la respuesta es 500 con el código "INTERNAL_ERROR"
      Y el mensaje no incluye la traza del error
