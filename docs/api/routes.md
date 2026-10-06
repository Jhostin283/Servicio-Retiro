# Matriz de Rutas y Endpoints API

## 1. Endpoints Síncronos REST (HTTP)

| Método | Ruta | Servicio | Función / Descripción | Estado |
|---|---|---|---|---|
| **POST** | `/api/v1/retiros` | `retiros-usd-service` | Registrar una nueva solicitud de retiro en USD | Implementado |
| **GET** | `/api/v1/retiros/{id}` | `retiros-usd-service` | Obtener el detalle de un retiro por UUID | Implementado |
| **GET** | `/api/v1/retiros/usuario/{usuarioId}` | `retiros-usd-service` | Listar el historial de retiros de un usuario | Implementado |
| **GET** | `/api/docs` | `retiros-usd-service` | Documentación interactiva Swagger UI | Implementado |

---

## 2. Eventos Asíncronos AMQP (RabbitMQ)

| Tipo | Routing Key / Evento | Origen / Destino | Descripción | Estado |
|---|---|---|---|---|
| **Publicado** | `withdrawal.requested` | NestJS -> RabbitMQ | Emitido al crear una solicitud de retiro | Implementado |
| **Consumido** | `withdrawal.funds_reserved` | RabbitMQ -> NestJS | Procesa el retiro con la pasarela bancaria | Implementado |
| **Consumido** | `withdrawal.funds_rejected` | RabbitMQ -> NestJS | Marca el retiro como rechazado por saldo | Implementado |
| **Publicado** | `withdrawal.completed` | NestJS -> RabbitMQ | Emitido tras confirmar transferencia bancaria | Implementado |
| **Publicado** | `withdrawal.failed` | NestJS -> RabbitMQ | Emitido tras fallo catastrófico o cuenta inválida | Implementado |
