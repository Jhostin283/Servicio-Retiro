# Funcionalidad: Consulta y Monitoreo de Retiros

## User Story / Historia de Usuario
> **US-CON-01**: Como **usuario de la plataforma**, quiero **consultar el estado de mi solicitud de retiro y ver mi historial de transacciones**, para **saber si mis fondos ya fueron procesados o si ocurrió un problema**.

### Criterios de Aceptación de la Historia
- Búsqueda directa de una transacción mediante su UUID único.
- Obtención del historial filtrado por identificador de usuario (`usuarioId`).
- Respuesta con lista vacía `[]` (HTTP 200 OK) cuando el usuario no cuenta con retiros previos.
- Historial ordenado cronológicamente de forma descendente (más reciente primero).
- Respuestas claras con códigos de estado HTTP estándar (200 OK, 400 Bad Request, 404 Not Found).

---

## Purpose
Establecer los requisitos para la obtención y consulta del estado de transacciones de retiro asociadas a la historia de usuario **US-CON-01**.

## Requirements

### Requirement: REQ-CON-001 - Consulta de Retiro por ID (US-CON-01)
El sistema DEBE retornar el detalle del retiro correspondiente al UUID consultado.

#### Scenario: 001.1 - Consultar retiro existente por UUID
- **GIVEN** un ID de retiro válido "b3f6e1a9-8c2d-4e9f-9a1b-3c4d5e6f7a8b"
- **WHEN** el cliente realiza una petición GET /api/v1/retiros/{id}
- **THEN** el sistema devuelve el objeto DTO con estado HTTP 200 OK y todos los campos del retiro.

#### Scenario: 001.2 - Retiro no encontrado por UUID
- **GIVEN** un ID de retiro inexistente
- **WHEN** el cliente realiza la petición GET /api/v1/retiros/{id}
- **THEN** el sistema responde con error HTTP 404 Not Found.

### Requirement: REQ-CON-002 - Consulta de Historial por Usuario (US-CON-01)
El sistema DEBE listar todos los retiros asociados a un usuario específico.

#### Scenario: 002.1 - Obtener lista de retiros de usuario
- **GIVEN** un `usuarioId` con retiros previos registrados
- **WHEN** el cliente consulta GET /api/v1/retiros?usuarioId={usuarioId}
- **THEN** el sistema retorna un arreglo JSON con el historial completo de solicitudes de retiro.

#### Scenario: 002.2 - Usuario sin transacciones previas
- **GIVEN** un `usuarioId` válido que no posee solicitudes de retiro registradas
- **WHEN** el cliente consulta GET /api/v1/retiros?usuarioId={usuarioId}
- **THEN** el sistema responde con HTTP 200 OK y un arreglo JSON vacío `[]`.

### Requirement: REQ-CON-003 - Ordenamiento y Paginación del Historial (US-CON-01)
El sistema DEBE retornar el historial de retiros ordenado cronológicamente de forma descendente.

#### Scenario: 003.1 - Orden cronológico descendente del historial
- **GIVEN** un usuario con múltiples solicitudes de retiro generadas en distintas fechas
- **WHEN** el cliente consulta su historial
- **THEN** el sistema retorna los registros ordenados desde el más reciente al más antiguo (`fechaCreacion DESC`).
