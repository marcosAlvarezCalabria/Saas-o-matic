# language: es
# @integracion: tests de endpoint con supertest. Ver 02-interfaz.md, sección 10.
# Los tests usan límites y ventanas pequeños (createApp los recibe como opciones)
# para no tener que lanzar 120 peticiones ni esperar un minuto.

Característica: Límite de peticiones por IP
  Como responsable de la demo publicada
  Quiero limitar cuántas peticiones hace cada IP
  Para que nadie llene la base de datos ni sature el servidor

  @integracion
  Escenario: Se supera el límite de escritura
    Dado un límite de escritura de 30 peticiones por minuto
    Cuando una IP envía 31 altas de cliente en un minuto
    Entonces la petición 31 es 429 con el código "RATE_LIMITED"
    Y la respuesta lleva la cabecera Retry-After

  @integracion
  Escenario: Pasada la ventana, vuelve a aceptar
    Dado que una IP ha superado el límite de escritura
    Cuando pasa la ventana de tiempo
    Entonces su siguiente alta ya no es 429

  @integracion
  Escenario: El límite de escritura no afecta al preview
    Dado que una IP ha superado el límite de escritura
    Cuando pide un preview
    Entonces la respuesta es 200

  @integracion
  Escenario: Se supera el límite general
    Dado un límite general de 120 peticiones por minuto
    Cuando una IP hace 121 peticiones en un minuto
    Entonces la petición 121 es 429 con el código "RATE_LIMITED"

  @integracion
  Escenario: /health nunca se limita
    Dado que una IP ha superado el límite general
    Cuando pide "GET /health"
    Entonces la respuesta es 200

  @integracion
  Escenario: El 429 lleva las cabeceras CORS
    Dado que una IP con el origen "http://localhost:5173" ha superado el límite de escritura
    Cuando envía otra alta de cliente
    Entonces la respuesta es 429 y lleva Access-Control-Allow-Origin "http://localhost:5173"
