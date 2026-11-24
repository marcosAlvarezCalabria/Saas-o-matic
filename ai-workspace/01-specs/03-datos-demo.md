# 03 Datos de demostración (seed)

Para que el evaluador, al abrir el enlace, vea la herramienta con datos y pueda probar el buscador, la paginación, los duplicados y el estado vacío sin crear nada a mano.

&nbsp;

## Decisiones

- **Comando manual**, nunca al arrancar: `pnpm --filter api seed` en local y `node dist/seed.js` en el contenedor, una vez tras desplegar. La api no mete datos por su cuenta.
- **Pasa por los casos de uso** (`CreateCustomer`, `CreateSimulation`, `SearchCustomers`), no por SQL. Los NIF pasan la validación real y los importes salen de `calculateMonthlyCost`: el seed no tiene ningún precio escrito.
- **Se puede lanzar dos veces sin duplicar nada:** si ya hay algún cliente (sea del seed o no), no hace nada y lo dice.
- **Todas las simulaciones con la fecha del momento** en que se lanza. No se tocan repositorios ni puertos para fechas inventadas.
- **Correos `@*.example.com`**, que es un dominio reservado: el botón "Enviar" nunca escribe a una empresa real.
- Ninguna simulación usa los valores por defecto del simulador (15 usuarios, 100 GB, 50 000 llamadas). Si alguna los usara, el botón "Guardar" saldría desactivado nada más entrar.

&nbsp;

## Clientes

| # | Empresa | NIF | País | Plan | Email | Simulaciones |
|---|---|---|---|---|---|---|
| 1 | Nube Norte S.L. | B76432103 | ES | pro | facturacion@nubenorte.example.com | 7 |
| 2 | Nube Sur Consultores S.L. | B91827360 | ES | basic | admin@nubesur.example.com | 2 |
| 3 | Laura Gómez Ruiz | 48213576X | ES | basic | laura@gomezruiz.example.com | 1 |
| 4 | Taller Ibérico | X3958214Y | ES | pro | hola@talleriberico.example.com | 0 |
| 5 | Construcciones Arganda S.A. | A28461531 | ES | enterprise | compras@arganda.example.com | 1 |
| 6 | Datos Atlânticos Lda. | PT509876543 | PT | pro | financeiro@atlanticos.example.com | 3 |
| 7 | Lumière Logiciels SAS | FR40123456789 | FR | enterprise | compta@lumiere.example.com | 2 |
| 8 | Bergwerk Software GmbH | DE811234567 | DE | enterprise | buchhaltung@bergwerk.example.com | 2 |
| 9 | Nordvik Analytics AB | SE556123456701 | SE | pro | ekonomi@nordvik.example.com | 1 |

Qué enseña cada uno:

- **1:** más de 5 simulaciones, así que se ve la paginación; además, tiene simulaciones de los tres tramos.
- **1 y 2:** buscar "nube" devuelve dos resultados.
- **3 y 4:** el DNI y el NIE. El 4 sirve para ver el estado vacío del historial.
- **4 y 6:** buscar "iberico" o "atlanticos" sin tilde también los encuentra.
- **5:** un CIF de tipo A.
- **6 a 9:** IVA de otros países: 23 %, 20 %, 19 % y 25 %.

&nbsp;

## Simulaciones (usuarios · GB · llamadas/mes)

- **1 · Nube Norte:** 5 · 20 · 10 000 / 10 · 50 · 25 000 / 12 · 80 · 40 000 / 25 · 150 · 90 000 / 40 · 200 · 120 000 / 60 · 400 · 250 000 / 120 · 1 000 · 600 000
- **2 · Nube Sur:** 3 · 10 · 2 000 / 8 · 30 · 8 000
- **3 · Laura Gómez:** 1 · 5 · 500
- **5 · Arganda:** 45 · 300 · 200 000
- **6 · Atlânticos:** 20 · 100 · 30 000 / 35 · 250 · 70 000 / 55 · 300 · 150 000
- **7 · Lumière:** 75 · 500 · 300 000 / 150 · 2 000 · 900 000
- **8 · Bergwerk:** 200 · 3 000 · 1 500 000 / 500 · 8 000 · 4 000 000
- **9 · Nordvik:** 30 · 120 · 60 000

En total, 9 clientes y 19 simulaciones.
