# Funcionalidad: Creación de Retiro en Dólares (USD)

## User Story / Historia de Usuario
> **US-RET-01**: Como **cliente de la billetera digital**, quiero **solicitar un retiro de fondos en dólares estadounidenses (USD)**, para **transferir dinero a mi cuenta bancaria de destino de manera segura**.

### Criterios de Aceptación de la Historia
- Moneda obligatoria: Dólares USD (rechazo de otras divisas).
- Monto mínimo: $1.00 USD, Monto máximo: $10,000.00 USD.
- Precisión monetaria: Máximo dos decimales y montos estrictamente positivos (> 0).
- Registro en base de datos en estado `PENDIENTE`.
- Cuenta de destino obligatoria; tipo de cuenta opcional.
- Consulta y débito de la billetera USD mediante HTTP.

---

## Purpose
Definir los requisitos de validación financiera y registro síncrono para las solicitudes de retiro en USD asociadas directamente a la historia de usuario **US-RET-01**.

## Requirements

### Requirement: REQ-RET-001 - Validación de Moneda y Montos Límites (US-RET-01)
El sistema DEBE procesar únicamente transacciones en dólares USD y validar los montos dentro de la regla de negocio ($1.00 USD mínimo a $10,000.00 USD máximo).

#### Scenario: 001.1 - Solicitar retiro exitoso en USD
- **GIVEN** un usuario con datos de destino válidos
- **WHEN** envía una solicitud de retiro por un valor de $150.00 USD
- **THEN** el sistema registra la solicitud inicialmente como PENDIENTE y responde HTTP 201 con el estado resultante.

#### Scenario: 001.2 - Rechazar solicitud con monto inferior al mínimo
- **GIVEN** un usuario realizando una solicitud
- **WHEN** ingresa un monto de $0.50 USD
- **THEN** el sistema rechaza la petición con HTTP 400 Bad Request por estar por debajo de $1.00 USD.

#### Scenario: 001.3 - Rechazar solicitud con monto superior al máximo
- **GIVEN** un usuario realizando una solicitud
- **WHEN** ingresa un monto de $15,000.00 USD
- **THEN** el sistema rechaza la petición con HTTP 400 Bad Request por exceder el tope de $10,000.00 USD.

#### Scenario: 001.4 - Rechazar montos con precisión inválida o valores menores o iguales a cero
- **GIVEN** un usuario realizando una solicitud de retiro
- **WHEN** ingresa un monto con más de dos decimales (ej. $50.125 USD) o un valor menor o igual a cero ($0.00 USD o negativo)
- **THEN** el sistema rechaza la petición con HTTP 400 Bad Request indicando formato de monto inválido.

#### Scenario: 001.5 - Rechazar moneda no soportada diferente a USD
- **GIVEN** un usuario realizando una solicitud
- **WHEN** especifica una divisa distinta a USD (ej. "EUR" o "COP")
- **THEN** el sistema rechaza la petición con HTTP 400 Bad Request indicando que la única moneda admitida es USD.

### Requirement: REQ-RET-002 - Débito en billetera USD
El servicio DEBE consultar la billetera por el identificador del usuario y solicitar el débito por HTTP antes de invocar la pasarela bancaria simulada.

#### Scenario: Fondos insuficientes
- **GIVEN** una solicitud de retiro válida
- **WHEN** billetera responde HTTP 422 por fondos insuficientes
- **THEN** el retiro se registra como RECHAZADO y no se invoca la pasarela.

#### Scenario: Resultado de débito incierto
- **GIVEN** una solicitud enviada a billetera
- **WHEN** no se puede confirmar la respuesta
- **THEN** el retiro permanece PENDIENTE con motivo de revisión manual y no se reintenta el débito automáticamente.

### Requirement: REQ-RET-003 - Validación de Datos Bancarios de Destino (US-RET-01)
El sistema DEBE validar la obligatoriedad y formato de los datos de la cuenta bancaria externa receptora (número de cuenta).

#### Scenario: 003.1 - Solicitud con datos bancarios incompletos o ausentes
- **GIVEN** un usuario enviando una solicitud de retiro
- **WHEN** la cuenta de destino está vacía o ausente
- **THEN** el sistema rechaza la petición con HTTP 400 Bad Request detallando los campos faltantes.

