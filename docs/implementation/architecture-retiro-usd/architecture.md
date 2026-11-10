# Arquitectura técnica: retiros USD

El microservicio recibe solicitudes HTTP, registra retiros en su propia base de datos y se integra con billetera mediante HTTP. El cliente puede ser la web del proyecto o cualquier otra aplicación que implemente el contrato.

## Componentes

- **Controlador HTTP:** expone creación y consultas de retiros.
- **Casos de uso:** registran la solicitud, coordinan el débito, procesan la pasarela y consultan el historial.
- **Dominio:** contiene el retiro, sus estados y las reglas del monto en USD.
- **Adaptadores:** implementan la persistencia PostgreSQL, el cliente HTTP de billetera y la pasarela bancaria simulada.

El controlador y los casos de uso dependen de puertos; los adaptadores realizan las operaciones externas. La base de retiros pertenece al servicio y no se consultan directamente las tablas de billetera.

## Flujo

1. `POST /api/v1/retiros` registra un retiro en `PENDIENTE`.
2. Se consulta la billetera USD por usuario y se solicita el débito mediante HTTP.
3. Un débito confirmado permite ejecutar la pasarela simulada y guardar `COMPLETADO` o `FALLIDO`.
4. Saldo insuficiente produce `RECHAZADO`; si el resultado del débito es incierto, el retiro permanece `PENDIENTE` para revisión manual.

La pasarela no realiza una transferencia bancaria real. No existe reversión automática ni idempotencia documentada para el débito; si falla la pasarela después de descontar, la devolución es manual. Consulte [la especificación de procesamiento](../../../openspec/specs/procesamiento-retiro/spec.md) y [el contrato OpenAPI](../../../retiros-usd-service/openapi_retiros.yaml).
