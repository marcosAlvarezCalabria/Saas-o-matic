# language: es
Característica: Validación del identificador fiscal
  Como comercial
  Quiero que el sistema rechace identificadores fiscales falsos
  Para no dar de alta clientes con datos incorrectos

  Antecedentes:
    Dado que el identificador se normaliza antes de validarlo:
      mayúsculas, sin espacios y sin guiones

  Regla: Normalización

    Esquema del escenario: El identificador se guarda normalizado
      Cuando normalizo el identificador "<entrada>"
      Entonces el resultado es "<normalizado>"

      Ejemplos:
        | entrada        | normalizado |
        | 12345678z      | 12345678Z   |
        | 12345678-Z     | 12345678Z   |
        | 12 345 678 z   | 12345678Z   |
        | x-1234567-l    | X1234567L   |

  Regla: DNI español (8 dígitos + letra de control)
    La letra es "TRWAGMYFPDXBNJZSQVHLCKE" en la posición (número mod 23).

    Esquema del escenario: DNI válido
      Dado un cliente de "ES"
      Cuando valido el identificador "<dni>"
      Entonces el identificador es válido

      Ejemplos:
        | dni       | motivo                    |
        | 12345678Z | 12345678 mod 23 = 14 → Z  |
        | 00000000T | 0 mod 23 = 0 → T          |
        | 99999999R | límite superior           |

    Esquema del escenario: DNI no válido
      Dado un cliente de "ES"
      Cuando valido el identificador "<dni>"
      Entonces se rechaza con el error "identificador fiscal no válido"

      Ejemplos:
        | dni        | motivo                  |
        | 12345678A  | letra de control errónea |
        | 1234567Z   | solo 7 dígitos          |
        | 123456789Z | 9 dígitos               |
        | 12345678   | sin letra               |
        | 1234567ZZ  | letra en posición de dígito |

  Regla: NIE español (X, Y o Z + 7 dígitos + letra de control)
    X, Y y Z se sustituyen por 0, 1 y 2, y se aplica el algoritmo del DNI.

    Esquema del escenario: NIE válido
      Dado un cliente de "ES"
      Cuando valido el identificador "<nie>"
      Entonces el identificador es válido

      Ejemplos:
        | nie       | motivo                      |
        | X1234567L | 01234567 mod 23 → L         |
        | Y1234567X | 11234567 mod 23 → X         |
        | Z1234567R | 21234567 mod 23 → R         |

    Esquema del escenario: NIE no válido
      Dado un cliente de "ES"
      Cuando valido el identificador "<nie>"
      Entonces se rechaza con el error "identificador fiscal no válido"

      Ejemplos:
        | nie        | motivo                    |
        | X1234567A  | letra de control errónea  |
        | W1234567L  | prefijo no permitido      |
        | X123456L   | solo 6 dígitos            |

  Regla: CIF español (letra de organización + 7 dígitos + control)
    Letras de organización válidas: A B C D E F G H J N P Q R S U V W.
    Suma: dígitos en posición par (2ª, 4ª, 6ª) tal cual; en posición impar
    (1ª, 3ª, 5ª, 7ª) se multiplican por 2 y se suman sus cifras.
    Control = (10 - suma mod 10) mod 10, o la letra "JABCDEFGHI"[control].
    A, B, E y H solo admiten control numérico.
    N, P, Q, R, S y W solo admiten control con letra.
    El resto (C, D, F, G, J, U, V) admite cualquiera de los dos.

    Esquema del escenario: CIF válido
      Dado un cliente de "ES"
      Cuando valido el identificador "<cif>"
      Entonces el identificador es válido

      Ejemplos:
        | cif       | motivo                              |
        | B58754201 | sociedad limitada, control numérico |
        | A58754201 | sociedad anónima, control numérico  |
        | Q2826000H | organismo público, control letra    |
        | P0800000B | corporación local, control letra    |
        | N0012345E | entidad extranjera, control letra   |
        | G12345674 | asociación, control numérico        |
        | G1234567D | asociación, control letra           |

    Esquema del escenario: CIF no válido
      Dado un cliente de "ES"
      Cuando valido el identificador "<cif>"
      Entonces se rechaza con el error "identificador fiscal no válido"

      Ejemplos:
        | cif        | motivo                                  |
        | B58754202  | dígito de control erróneo               |
        | B5875420A  | B no admite control con letra           |
        | Q28260008  | Q no admite control numérico            |
        | Q2826000A  | letra de control errónea                |
        | I1234567D  | letra de organización no permitida      |
        | B587542    | longitud incorrecta                     |

  Regla: España no acepta formatos de otros países

    Escenario: Identificador extranjero con país España
      Dado un cliente de "ES"
      Cuando valido el identificador "FR12345678901"
      Entonces se rechaza con el error "identificador fiscal no válido"

  Regla: Otros países, validación básica de formato
    Tras normalizar: solo letras y dígitos, entre 4 y 20 caracteres.
    No se comprueba dígito de control.

    Esquema del escenario: Identificador extranjero
      Dado un cliente de "<país>"
      Cuando valido el identificador "<id>"
      Entonces el resultado es "<resultado>"

      Ejemplos:
        | país | id              | resultado | motivo                 |
        | FR   | FR12345678901   | válido    | formato alfanumérico   |
        | DE   | DE123456789     | válido    | formato alfanumérico   |
        | GB   | 123             | rechazado | menos de 4 caracteres  |
        | FR   | FR123$456       | rechazado | carácter no permitido  |
        | DE   | DE1234567890123456789 | rechazado | más de 20 caracteres |

  Regla: Identificador duplicado (test de integración de POST /customers)

    Escenario: Mismo identificador escrito de otra forma
      Dado un cliente de "ES" ya registrado con el identificador "12345678Z"
      Cuando registro otro cliente con el identificador "12345678-z"
      Entonces la respuesta es 409 con el código "TAX_ID_ALREADY_EXISTS"

# Nota: los casos válidos se han calculado con el algoritmo antes de escribirlos.
# Fuera de alcance: NIF especiales K, L y M (personas físicas sin DNI).
