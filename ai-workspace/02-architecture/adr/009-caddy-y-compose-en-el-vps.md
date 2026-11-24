# ADR-009 · Docker Compose con Caddy en el VPS

**Estado:** aceptado.

**Contexto.** La web está en Netlify, con HTTPS. El navegador bloquea las llamadas de una página HTTPS a una api por HTTP, así que la api necesita HTTPS con un certificado válido. Además, tiene que estar detrás de algo que limite lo que se expone del VPS y que el límite de peticiones vea la IP real del cliente.

**Decisión.**
- La api en Docker y, delante, **Caddy** como proxy inverso. Caddy pide y renueva solo el certificado de Let's Encrypt para `API_DOMAIN`. Toda su configuración son tres líneas en `deploy/Caddyfile`.
- Un solo `docker-compose.yml`, con Caddy en el perfil `prod`: en local se levanta solo la api y en el VPS, las dos.
- La api publica el 3000 solo en `127.0.0.1` y la app confía en un proxy (`TRUST_PROXY=1`).

**Alternativas.**
- **Nginx con Certbot:** más conocido, pero son más archivos y un proceso aparte para renovar el certificado.
- **Exponer la api directamente con HTTPS en Node:** obliga a gestionar los certificados en el código.
- **Un PaaS (Render, Railway, Fly):** menos trabajo, pero el SQLite en disco necesita un volumen persistente, que suele ser de pago, y se pierde el control del VPS que ya tengo.

**Consecuencias.**
- HTTPS sin mantenimiento.
- Un servicio más en el compose y un dominio con un registro DNS apuntando al VPS.
- La IP del cliente llega bien al límite de peticiones gracias a `TRUST_PROXY=1`. Si algún día se quita Caddy, hay que volver a ponerlo a 0.
