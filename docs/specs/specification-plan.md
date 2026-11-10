# Plan de especificaciones

El trabajo se divide por funcionalidad entre frontend Angular y backend NestJS. La integración con billetera se realiza por HTTP y la persistencia de retiros usa PostgreSQL.

| Spec | Responsable | Frontend | Backend |
| --- | --- | --- | --- |
| [SPEC-001](almerco/spec-001.md) | Almerco | Formulario de retiro | Creación y validación |
| [SPEC-002](almerco/spec-002.md) | Almerco | Cliente HTTP | Persistencia y cliente HTTP de billetera |
| [SPEC-003](gino/spec-003.md) | Gino | Consulta e historial | Consultas de retiros |
| [SPEC-004](gino/spec-004.md) | Gino | Visualización del estado | Pasarela simulada y actualización del estado |

La referencia funcional vigente está en [OpenSpec](../../openspec/FUENTE_DE_LA_VERDAD.md) y el contrato REST en [OpenAPI](../../retiros-usd-service/openapi_retiros.yaml).
