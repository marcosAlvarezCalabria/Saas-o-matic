# language: es
# @integracion: tests de endpoint con supertest. Ver 02-interfaz.md, sección 10.

Característica: Orígenes permitidos (CORS)
  Como front desplegado en otro dominio
  Quiero que la api me deje llamarla
  Para que el navegador no bloquee las peticiones

  Antecedentes:
    Dado que CORS_ORIGINS es "http://localhost:5173,https://saas-o-matic.netlify.app"

  @integracion
  Esquema del escenario: Origen permitido
    Cuando pido "GET /health" con el origen "<origen>"
    Entonces la respuesta lleva Access-Control-Allow-Origin "<origen>"

    Ejemplos:
      | origen                              |
      | http://localhost:5173               |
      | https://saas-o-matic.netlify.app    |

  @integracion
  Escenario: Petición previa (preflight) de un POST
    Cuando envío "OPTIONS /simulations" con el origen "http://localhost:5173", método "POST" y cabecera "Content-Type"
    Entonces la respuesta es 204
    Y permite el método POST y la cabecera Content-Type

  @integracion
  Escenario: Origen no permitido
    Cuando pido "GET /health" con el origen "https://otra-web.com"
    Entonces la respuesta no lleva Access-Control-Allow-Origin

  @integracion
  Escenario: Sin la variable, solo el front de desarrollo
    Dado que CORS_ORIGINS no está definida
    Cuando pido "GET /health" con el origen "http://localhost:5173"
    Entonces la respuesta lleva Access-Control-Allow-Origin "http://localhost:5173"
