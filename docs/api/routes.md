# Matriz de Rutas y Endpoints API

## 1. Endpoints Síncronos REST (HTTP)

| Método | Ruta | Servicio | Función / Descripción | Estado |
|---|---|---|---|---|
| **POST** | `/api/v1/retiros` | `retiros-usd-service` | Registrar una nueva solicitud de retiro en USD | Implementado |
| **GET** | `/api/v1/retiros/{id}` | `retiros-usd-service` | Obtener el detalle de un retiro por UUID | Implementado |
| **GET** | `/api/v1/retiros?usuarioId={usuarioId}` | `retiros-usd-service` | Listar el historial de retiros de un usuario | Implementado |
| **GET** | `/api/docs` | `retiros-usd-service` | Documentación interactiva Swagger UI | Implementado |

---

## Integración con billetera USD

El backend consulta por HTTP `GET /api/v1/billetera/usuarios/{userId}/wallet` y solicita `POST /api/v1/billetera/wallets/{id}/retiros`. El endpoint de débito documentado por billetera no garantiza idempotencia ni reversión. El contrato de eventos anterior es histórico y no está activo.
