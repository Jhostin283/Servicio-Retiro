# Funcionalidad: Creación de Retiro en Dólares (USD)

## User Story / Historia de Usuario
> **US-RET-01**: Como **cliente de la billetera digital**, quiero **solicitar un retiro de fondos en dólares estadounidenses (USD)**, para **transferir dinero a mi cuenta bancaria de destino de manera segura**.

### Criterios de Aceptación de la Historia
- Moneda obligatoria: Dólares USD.
- Monto mínimo: $1.00 USD, Monto máximo: $10,000.00 USD.
- Registro en base de datos en estado `PENDIENTE`.
- Emisión inmediata del evento AMQP `withdrawal.requested`.

---

## Purpose
Definir los requisitos de validación financiera y registro síncrono para las solicitudes de retiro en USD asociadas directamente a la historia de usuario **US-RET-01**.

## Requirements

### Requirement: REQ-RET-001 - Validación de Moneda y Montos Límites (US-RET-01)
El sistema DEBE procesar únicamente transacciones en dólares USD y validar los montos dentro de la regla de negocio ($1.00 USD mínimo a $10,000.00 USD máximo).

#### Scenario: 001.1 - Solicitar retiro exitoso en USD
- **GIVEN** un usuario autenticado con datos bancarios válidos
- **WHEN** envía una solicitud de retiro por un valor de $150.00 USD
- **THEN** el sistema registra la solicitud en estado PENDIENTE y responde con HTTP 201 Created.

#### Scenario: 001.2 - Rechazar solicitud con monto inferior al mínimo
- **GIVEN** un usuario realizando una solicitud
- **WHEN** ingresa un monto de $0.50 USD
- **THEN** el sistema rechaza la petición con HTTP 400 Bad Request por estar por debajo de $1.00 USD.

#### Scenario: 001.3 - Rechazar solicitud con monto superior al máximo
- **GIVEN** un usuario realizando una solicitud
- **WHEN** ingresa un monto de $15,000.00 USD
- **THEN** el sistema rechaza la petición con HTTP 400 Bad Request por exceder el tope de $10,000.00 USD.

### Requirement: REQ-RET-002 - Publicación de Evento Inicial (US-RET-01)
El sistema DEBE emitir automáticamente un evento AMQP `withdrawal.requested` tras registrar la solicitud.

#### Scenario: 002.1 - Emisión del evento tras persistencia
- **GIVEN** un retiro guardado en base de datos en estado PENDIENTE
- **WHEN** finaliza la transacción de escritura
- **THEN** el microservicio publica el evento `withdrawal.requested` al exchange de RabbitMQ.
