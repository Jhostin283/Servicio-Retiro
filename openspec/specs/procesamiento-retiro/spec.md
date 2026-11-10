# Procesamiento de retiro con billetera USD HTTP

## Purpose
El servicio de retiros consulta y debita la billetera USD mediante HTTP y luego ejecuta una pasarela bancaria simulada. El contrato de billetera recibido no documenta reserva, idempotencia ni reversión para el débito; este flujo es para el taller.

## Requirements

### Requirement: Consultar y debitar la billetera
El servicio DEBE consultar `GET /api/v1/billetera/usuarios/{userId}/wallet`, verificar que corresponda al usuario y opere en USD, y solicitar `POST /api/v1/billetera/wallets/{id}/retiros` con `monto` como cadena decimal.

#### Scenario: Débito confirmado
- **GIVEN** billetera confirma el débito con HTTP 201 y devuelve el identificador del movimiento
- **WHEN** se registra la referencia y la pasarela simulada confirma el desembolso
- **THEN** el retiro pasa a COMPLETADO.

#### Scenario: Saldo insuficiente
- **GIVEN** la billetera responde HTTP 422
- **WHEN** se procesa la respuesta
- **THEN** el retiro pasa a RECHAZADO y no se llama a la pasarela.

#### Scenario: Resultado incierto de débito
- **GIVEN** se envió el débito a billetera
- **WHEN** la respuesta se pierde, excede el tiempo de espera o no puede interpretarse
- **THEN** el retiro permanece PENDIENTE con una indicación de revisión manual; no se reintenta automáticamente.

#### Scenario: Fallo después de débito confirmado
- **GIVEN** billetera confirmó el débito y se guardó su identificador
- **WHEN** la pasarela simulada falla
- **THEN** el retiro pasa a FALLIDO y se indica que la devolución es manual.

El sistema no garantiza idempotencia en el débito ni reversión automática; antes de usar dinero real se requiere un contrato que las soporte.
