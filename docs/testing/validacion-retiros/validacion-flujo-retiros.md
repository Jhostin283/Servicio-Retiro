# Validación del flujo de retiros

La validación vigente utiliza la API HTTP de retiros, PostgreSQL y la API HTTP de billetera. La pasarela bancaria es simulada.

| Caso | Condición y acción | Quién debe responder | Criterio para aprobar | Resultado observado |
| --- | --- | --- | --- | --- |
| Retiro exitoso | Crear una solicitud de USD 25.50 con saldo simulado suficiente. | Retiros, billetera simulada y pasarela simulada. | Retiros responde HTTP 201 con estado `COMPLETADO`; se puede consultar por ID e historial. | Pasó en el entorno local aislado. |
| Saldo insuficiente | Solicitar USD 600 frente a un saldo simulado de USD 500. | Billetera simulada responde 422; retiros procesa el rechazo. | Retiros responde HTTP 201 con estado `RECHAZADO`. | Pasó en el entorno local aislado. |
| Fallo de pasarela | Solicitar un retiro con la cuenta simulada `0000`. | Billetera confirma el débito; la pasarela simulada falla. | Estado `FALLIDO`, movimiento de billetera guardado e indicación de devolución manual. | Pasó en el entorno local aislado. |
| Monto inválido | Enviar USD 0.50. | API de retiros. | HTTP 400. | Pasó en el entorno local aislado. |
| Retiro desde la web | Solicitar USD 20 y actualizar el historial. | Web, retiros, billetera simulada y pasarela simulada. | La web muestra `COMPLETADO` y el retiro en el historial. | Pasó en el entorno local aislado. |
| Billetera del otro equipo | Solicitar USD 1 desde la web con una cuenta autorizada de prueba. | Web, retiros, billetera del otro equipo y pasarela simulada. | Se confirma el movimiento de billetera y la web muestra el estado final. | Pasó; el saldo pasó de USD 400 a USD 399 y se mostró `COMPLETADO`. |

Las pruebas automáticas relacionadas y sus nombres se encuentran en el [plan de pruebas](../plan-de-pruebas.md). Los detalles de la ejecución están en [resultados de integración HTTP](resultados-billetera-usd-http.md). No se ha validado el despliegue de Kubernetes de extremo a extremo.
