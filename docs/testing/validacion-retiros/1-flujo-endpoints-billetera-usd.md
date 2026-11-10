# Flujo de endpoints: retiros y billetera USD

Este ejemplo muestra la prueba local de un retiro ficticio de USD 1 para el usuario `jhostin`. La web y el backend de retiros se ejecutan en la computadora local; la billetera corresponde al servicio del otro equipo.

```text
Tu web: http://127.0.0.1:4200
       │
       │ 1. POST http://localhost:3004/api/v1/retiros
       │    Solicita retirar USD 1 para jhostin.
       ▼
Tu backend de retiros
       │
       │ 2. GET http://54.167.69.62/api/v1/billetera/usuarios/jhostin/wallet
       │    Busca la billetera del usuario.
       ▼
Billetera del otro equipo
       │
       │ 3. Devuelve el ID y el saldo de la billetera.
       ▼
Tu backend de retiros
       │
       │ 4. POST http://54.167.69.62/api/v1/billetera/wallets/<ID>/retiros
       │    Solicita descontar USD 1.
       ▼
Billetera del otro equipo
       │
       │ 5. Confirma el descuento o lo rechaza.
       ▼
Tu backend de retiros
       │
       │ 6. Procesa el desembolso simulado si se confirmó el débito
       │    y devuelve el estado.
       ▼
La web muestra: COMPLETADO, RECHAZADO, FALLIDO o PENDIENTE.
```

La respuesta HTTP `201` del servicio de retiros indica que la solicitud se registró; el campo `estado` muestra su resultado. La pasarela es simulada y no realiza una transferencia bancaria real. Si se pierde la respuesta del débito, el retiro queda `PENDIENTE` para revisión manual; si falla la pasarela después de un débito confirmado, queda `FALLIDO` y la devolución requiere gestión manual.

## ¿Por qué ambos endpoints se llaman «retiros»?

| Endpoint | Responsable | Función |
| --- | --- | --- |
| `POST /api/v1/retiros` | Servicio de retiros | Recibe los datos del cliente, registra la solicitud, coordina el débito y la pasarela, y guarda el estado. |
| `POST /api/v1/billetera/wallets/<ID>/retiros` | Servicio de billetera | Recibe la solicitud de débito del backend de retiros y descuenta el saldo de la billetera. |

El nombre es similar, pero sus responsabilidades son diferentes. El equipo de billetera podría elegir una ruta como `/debitos` para describir mejor el descuento; no es necesario para que la integración funcione. Si cambia la ruta, debe actualizar su contrato y avisar al equipo de retiros para adaptar el cliente HTTP.

`localhost` y `127.0.0.1` solo apuntan a la computadora donde se abre la web. Para integrar otra aplicación, reemplaza la dirección local del backend por el DNS público de retiros después de desplegarlo. La IP de billetera es la dirección de prueba compartida por el otro equipo y puede cambiar.
