# Pruebas de retiros USD con Postman

## 1. Importar y configurar

1. En Postman, selecciona **Import** e importa [retiros-usd.postman_collection.json](retiros-usd.postman_collection.json). Si ya habías importado una versión anterior, vuelve a importarla y asegúrate de usar la colección actualizada.
2. Abre la colección **Retiros USD - Pruebas de despliegue** y entra a **Variables**.
3. En el valor actual de `baseUrl`, escribe la dirección del balanceador con protocolo y sin barra final, por ejemplo `http://ejemplo.us-east-1.elb.amazonaws.com`. No incluyas `/api/v1/retiros`. Para pruebas locales se puede usar `http://localhost:3004`.
4. Configura `baseUrlBilletera` con la dirección base del servicio del otro equipo, por ejemplo `http://54.167.69.62`, sin `/acceso` ni barra final. Configura `usuarioId` con una cuenta de prueba autorizada y `cuentaDestino` con una cuenta ficticia para la pasarela simulada. La colección no necesita contraseñas.
5. Comprueba que los pods estén listos y el Service tenga una dirección antes de probar. El DNS se obtiene con:

```powershell
kubectl get service backend-service -n retiros-usd-system
```

Si una URL está vacía o no incluye el protocolo, los scripts correspondientes omiten las solicitudes. Los valores en un entorno de Postman pueden tener prioridad sobre las variables de la colección; comprueba que no haya otro `baseUrl`, `baseUrlBilletera` o `usuarioId` activo.

Usa una versión de Postman compatible con [`pm.execution.skipRequest()`](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-execution), que permite omitir una solicitud desde su script previo.

## 2. Comprobar la API sin debitar

Ejecuta las solicitudes de la carpeta **1 - Comprobaciones sin débito**. Se prueban Swagger, historial, usuario faltante, retiro inexistente, monto menor al mínimo y cuenta faltante. Las solicitudes POST inválidas deben responder `400` sin solicitar un débito a billetera. El UUID de `idNoExistente` debe no existir para que la prueba de `404` sea válida.

La pestaña **Test Results** muestra qué verificaciones pasaron. Una lista vacía en el historial es válida.

## 3. Consultar el saldo antes del retiro

Envía **2 - Consultar billetera antes del retiro → Consultar billetera y saldo inicial**. Esta solicitud consulta directamente el endpoint de billetera desde Postman y guarda el saldo y el ID. Debe responder HTTP `200`, con el usuario esperado y moneda `USD`. Esta consulta no descuenta saldo.

## 4. Crear un retiro autorizado de USD 1

La carpeta **3 - Solicitar retiro autorizado** contiene una solicitud que puede descontar USD 1 de la billetera. Úsala solo con saldo ficticio y autorización del equipo de billetera.

1. En las variables de la colección, cambia el valor actual de `permitirDebito` de `NO` a `SI`.
2. Envía **Retiro de prueba USD 1 - envío único** una vez. El script restablece la variable a `NO` antes de enviar; para otro intento hay que habilitarla nuevamente.
3. Revisa el campo `estado` de la respuesta. HTTP `201` significa que la solicitud se registró, pero no garantiza que haya terminado en `COMPLETADO`.
4. El test espera `COMPLETADO` para el caso exitoso. Si la respuesta contiene otro estado, la prueba aparece fallida y debes revisar `razonFallo` y el estado de billetera.

El `retiroId` se guarda en las variables de la colección cuando la respuesta es HTTP 201 y contiene un ID. Si hay pérdida de conexión o respuesta incierta, **no repitas el envío** hasta consultar con el equipo de billetera: el contrato no documenta idempotencia ni reversión.

El `POST` se envía al **servicio de retiros**. Es el backend de retiros quien consulta y llama a billetera para debitar; Postman no envía un segundo débito directamente.

## 5. Consultar el retiro

Ejecuta las dos solicitudes de **4 - Consultar el retiro registrado**. Utilizan el `retiroId` guardado para consultar el detalle y comprobar que aparece en el historial. También puedes escribir manualmente el ID de un retiro existente. Sin ID, las solicitudes se omiten.

## 6. Consultar el saldo después del retiro

Envía **5 - Consultar billetera después del retiro → Consultar billetera y saldo después**. Postman consulta de nuevo la API de billetera y, si capturó un saldo previo y un retiro `COMPLETADO` con ID de movimiento para el mismo usuario y billetera, comprueba que el saldo bajó USD 1. Si falta alguna de esas condiciones, se omite la comparación.

Si hubo otros movimientos simultáneos, la comparación del saldo puede fallar aunque el retiro se haya procesado correctamente. El ID de movimiento de la respuesta de retiros sirve para consultar con el equipo de billetera. La dirección que Postman usa para estas consultas directas y la configurada en el backend de retiros deben apuntar a la misma billetera; la colección no modifica la configuración del clúster.

El desembolso es simulado. Un fallo de pasarela después de un débito confirmado puede requerir devolución manual. La colección valida lo que responde la API; confirmar el movimiento y saldo en billetera requiere consultar con ese equipo.
