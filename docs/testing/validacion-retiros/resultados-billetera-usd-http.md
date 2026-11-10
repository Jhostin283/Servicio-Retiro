# Resultados de prueba: integración HTTP con billetera USD

Se ejecutaron pruebas locales con PostgreSQL aislado y una billetera USD simulada. Los datos y saldos fueron ficticios.

| Caso | Solicitud o acción | Resultado observado |
| --- | --- | --- |
| Retiro exitoso | `POST /api/v1/retiros`, USD 25.50 | HTTP 201 y estado `COMPLETADO`; consulta por ID e historial correctos. |
| Saldo insuficiente | `POST /api/v1/retiros`, USD 600 frente a saldo simulado de USD 500 | HTTP 201 y estado `RECHAZADO`; estado consultable por ID. |
| Fallo de pasarela | Retiro con cuenta simulada `0000` | HTTP 201 y estado `FALLIDO`; se guarda el ID del movimiento de billetera y se indica la devolución manual. |
| Monto inválido | `POST /api/v1/retiros`, USD 0.50 | HTTP 400; validación de monto mínimo. |
| Aplicación web | Crear retiro simulado de USD 20 y actualizar historial | La web mostró `COMPLETADO` y el retiro apareció en el historial. |

En esa ejecución también pasaron 44 pruebas automatizadas en 15 suites y compilaron el backend y el frontend. Después de retirar las pruebas del flujo anterior, pasaron 34 pruebas en 10 suites. La prueba automatizada de integración HTTP utiliza una billetera simulada.

## Prueba con la billetera del otro equipo

Con autorización para usar saldo ficticio, se inició el frontend y backend localmente con PostgreSQL temporal y se conectó el backend a la billetera del otro equipo. Desde la web se solicitó un único retiro de USD 1 con una cuenta de destino ficticia. La web mostró `COMPLETADO` y el retiro apareció en el historial.

- La consulta a la billetera confirmó que el saldo pasó de USD 400 a USD 399.
- La consulta al retiro confirmó el movimiento de billetera `c8152e16-1b21-4170-bb18-02dc0a74e860` y el retiro `43e499e4-78c4-44cd-a064-e16657e5f46d`. La pasarela fue simulada.
- La base de datos utilizada fue temporal, por lo que el registro local no persiste después de finalizar la prueba. El movimiento en la billetera del otro equipo sí queda registrado allí.

No se verificó un despliegue en Kubernetes. La API de billetera no documenta reversión ni idempotencia, por lo que un débito incierto requiere revisión manual y no debe repetirse automáticamente.
