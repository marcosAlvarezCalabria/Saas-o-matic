# language: es
Característica: Cálculo del coste mensual por tramos
  Como comercial
  Quiero calcular el coste mensual según el número de usuarios
  Para dar un presupuesto preciso al cliente

  Regla: Tarificación acumulativa por tramos
    Tramo 1: usuarios 1 a 10 a 10 €
    Tramo 2: usuarios 11 a 50 a 8 €
    Tramo 3: a partir del usuario 51 a 5 €

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

    Esquema del escenario: Número de usuarios no válido
      Dado que el cliente tiene <usuarios> usuarios activos
      Cuando calculo el coste base
      Entonces se rechaza con el error "usuarios no válidos"

      Ejemplos:
        | usuarios |
        | 0        |
        | -5       |
        | 2.5      |

  Regla: Se suma el IVA del país del cliente

    Escenario: Cliente español con 15 usuarios
      Dado un cliente de "ES" con 15 usuarios activos
      Cuando calculo el coste mensual
      Entonces el coste base es 140,00 €
      Y el IVA aplicado es del 21 %
      Y el importe de IVA es 29,40 €
      Y el total es 169,40 €

    Escenario: País sin tipo de IVA definido
      Dado un cliente de un país que no está en la tabla de IVA
      Cuando calculo el coste mensual
      Entonces se rechaza con el error "país no soportado"

# Nota: los importes se calculan internamente en céntimos (140,00 € = 14000).
