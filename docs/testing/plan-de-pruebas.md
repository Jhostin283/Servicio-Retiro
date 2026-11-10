# Plan de pruebas: retiros USD

El flujo vigente utiliza la API de retiros, PostgreSQL, la API HTTP de billetera y una pasarela bancaria simulada. Los resultados manuales y automatizados se registran por separado.

| Caso | Condición y acción | Quién debe responder | Resultado esperado | Prueba automatizada relacionada |
| --- | --- | --- | --- | --- |
| Retiro completado | Billetera confirma el débito y la pasarela acepta. | Billetera, pasarela y servicio de retiros. | Se guardan los identificadores del movimiento y el estado `COMPLETADO`. | `crear-retiro.caso-uso.spec.ts`: «registra el débito y completa el retiro después del desembolso». |
| Saldo insuficiente | Billetera responde 422 al débito. | Billetera y servicio de retiros. | Estado `RECHAZADO`; no se llama a la pasarela. | `crear-retiro.caso-uso.spec.ts`: «rechaza fondos insuficientes sin llamar al banco». |
| Débito incierto | Se pierde o no puede interpretarse la respuesta del débito. | Adaptador de billetera y servicio de retiros. | `PENDIENTE`, revisión manual y sin reintento automático. | `crear-retiro.caso-uso.spec.ts`: «mantiene pendiente un débito incierto sin reintentar ni llamar al banco». |
| Fallo tras débito | Débito confirmado y pasarela simulada falla. | Billetera, pasarela y servicio de retiros. | `FALLIDO`, con indicación de devolución manual. | `crear-retiro.caso-uso.spec.ts`: «marca FALLIDO y deja constancia de la devolución manual cuando falla la pasarela». |
| No se pudo debitar | No se pudo consultar la billetera o el débito no se realizó. | Adaptador de billetera y servicio de retiros. | `FALLIDO`; no se ejecuta la pasarela. | `crear-retiro.caso-uso.spec.ts`: «marca FALLIDO sin contactar al banco si el débito no fue realizado». |
| Contrato de billetera | El adaptador consulta y solicita el débito. | Servidor HTTP simulado. | Usa las rutas y campos documentados por billetera. | `billetera-usd-http.integracion.spec.ts`: «consulta y debita usando HTTP y los nombres del contrato de billetera». |
| Validación de monto | Se envía un monto menor a USD 1. | API de retiros. | HTTP 400. | `monto-usd.vo.spec.ts`: «debe lanzar excepción si el monto es menor a $1.00 USD»; el HTTP 400 se comprobó manualmente. |
| Consulta e historial | Se consulta un retiro por ID o por usuario. | API de retiros y repositorio. | Se devuelven los registros correspondientes. | `consultar-retiro.caso-uso.spec.ts` y `retiro-rutas.http.spec.ts`. |

Ejecutar el backend con `npm test -- --runInBand` desde `retiros-usd-service`. El [registro de resultados](validacion-retiros/resultados-billetera-usd-http.md) distingue las pruebas locales simuladas de la prueba con la billetera del otro equipo. La integración con Kubernetes debe probarse por separado.
