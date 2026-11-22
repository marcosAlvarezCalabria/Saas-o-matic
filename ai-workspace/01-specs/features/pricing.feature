# language: es
Característica: Cálculo del coste mensual por tramos
  Como comercial
  Quiero calcular el coste mensual según el número de usuarios
  Para dar un presupuesto preciso al cliente

  Regla: Tarificación acumulativa por tramos
    Tramo 1: usuarios 1 a 10 a 10 €
    Tramo 2: usuarios 11 a 50 a 8 €
    Tramo 3: a partir del usuario 51 a 5 €
    Usuarios: entero de 1 a 100 000 (tope para que el importe sea siempre un entero exacto).

    Esquema del escenario: Coste base según el número de usuarios
      Dado que el cliente tiene <usuarios> usuarios activos
      Cuando calculo el coste base
      Entonces el coste base es <coste> €

      Ejemplos:
        | usuarios | coste | motivo                      |
        | 1        | 10    | mínimo                      |
        | 10       | 100   | límite del tramo 1          |
        | 11       | 108   | entra en el tramo 2         |
        | 15       | 140   | ejemplo del enunciado       |
        | 50       | 420   | límite del tramo 2          |
        | 51       | 425   | entra en el tramo 3         |
        | 1000     | 5170  | tercer tramo con muchos usuarios |
        | 100000   | 500170 | tope de usuarios            |

    Esquema del escenario: Número de usuarios no válido
      Dado que el cliente tiene <usuarios> usuarios activos
      Cuando calculo el coste base
      Entonces se rechaza con el error "usuarios no válidos"

      Ejemplos:
        | usuarios |
        | 0        |
        | -5       |
        | 2.5      |
        | 100001   |

  Regla: Se suma el IVA del país del cliente
    El tipo se expresa en puntos básicos: 21 % = 2100; 25,5 % = 2550.
    Importe de IVA = round(base × puntos básicos / 10 000), al céntimo.

    Escenario: Cliente español con 15 usuarios
      Dado un cliente de "ES" con 15 usuarios activos
      Cuando calculo el coste mensual
      Entonces el coste base es 140,00 €
      Y el IVA aplicado es de 2100 puntos básicos (21 %)
      Y el importe de IVA es 29,40 €
      Y el total es 169,40 €

    Escenario: Tipo con decimales y redondeo
      Dado un cliente de "FI" con 51 usuarios activos
      Cuando calculo el coste mensual
      Entonces el coste base es 425,00 €
      Y el IVA aplicado es de 2550 puntos básicos (25,5 %)
      Y el importe de IVA es 108,38 €
      Y el total es 533,38 €
      # 42 500 × 2550 / 10 000 = 10 837,5 céntimos → se redondea a 10 838

    Escenario: País sin tipo de IVA definido
      Dado un cliente de un país que no está en la tabla de IVA
      Cuando calculo el coste mensual
      Entonces se rechaza con el error "país no soportado"

# Nota: los importes se calculan internamente en céntimos (140,00 € = 14000).
