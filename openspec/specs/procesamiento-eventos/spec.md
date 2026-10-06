# Funcionalidad: Procesamiento Asíncrono de Eventos y Pasarela Bancaria

## User Story / Historia de Usuario
> **US-EVT-01**: Como **sistema bancario / administrador de pagos**, quiero **procesar asíncronamente las reservas de fondos y conectar con la pasarela bancaria USD**, para **completar la transferencia a la cuenta de destino o marcar el retiro como rechazado/fallido en tiempo real**.

### Criterios de Aceptación de la Historia
- Consumo asíncrono del evento AMQP `withdrawal.funds_reserved`.
- Ejecución de la transacción en la pasarela bancaria simulada USD.
- Transición de estado a `COMPLETADO` (con evento `withdrawal.completed`), `RECHAZADO` (vía `withdrawal.funds_rejected`) o `FALLIDO` (con evento `withdrawal.failed`).

---

## Purpose
Especificar los requisitos de integraciones asíncronas y pasarela bancaria asociados a la historia de usuario **US-EVT-01**.

## Requirements

### Requirement: REQ-EVT-001 - Procesamiento de Fondos Reservados (US-EVT-01)
El sistema DEBE procesar los eventos `withdrawal.funds_reserved` invocando la pasarela bancaria para completar el retiro.

#### Scenario: 001.1 - Transferencia exitosa en pasarela bancaria
- **GIVEN** un evento `withdrawal.funds_reserved` recibido desde la cola de RabbitMQ
- **WHEN** la pasarela bancaria confirma la transferencia bancaria exitosa
- **THEN** el sistema actualiza el estado del retiro a COMPLETADO y emite el evento `withdrawal.completed`.

#### Scenario: 001.2 - Fallo por datos de cuenta bancaria inválidos
- **GIVEN** un evento `withdrawal.funds_reserved` con una cuenta de destino inactiva o inválida
- **WHEN** la pasarela bancaria retorna un rechazo de transferencia
- **THEN** el sistema marca el retiro como FALLIDO y emite el evento `withdrawal.failed`.

### Requirement: REQ-EVT-002 - Procesamiento de Fondos Rechazados (US-EVT-01)
El sistema DEBE actualizar el estado a RECHAZADO al recibir el evento `withdrawal.funds_rejected`.

#### Scenario: 002.1 - Saldo insuficiente en cuenta origen
- **GIVEN** un evento `withdrawal.funds_rejected` con motivo "Saldo insuficiente"
- **WHEN** el consumidor de eventos procesa el mensaje
- **THEN** el sistema actualiza el retiro a estado RECHAZADO y registra la justificación.
