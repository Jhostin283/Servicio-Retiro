# Base de datos del servicio de retiros USD

El backend usa PostgreSQL y la entidad [EntidadRetiroORM](../../retiros-usd-service/src/infrastructure/adapters/persistence/entidad-retiro.orm.ts). La base pertenece al servicio de retiros: no se consultan directamente las tablas de billetera.

## Tabla `retiros`

| Columna | Tipo en la entidad | Descripción |
| --- | --- | --- |
| `id` | UUID, clave primaria | Identificador generado por la aplicación. |
| `usuario_id` | VARCHAR(100), obligatorio | Identificador del usuario en billetera: alias o UUID. |
| `monto_usd` | DECIMAL(12,2), obligatorio | Monto solicitado en dólares. |
| `moneda` | VARCHAR(10), valor inicial USD | Moneda del retiro. |
| `cuenta_destino` | VARCHAR(100), obligatorio | Cuenta proporcionada para el desembolso simulado. |
| `tipo_cuenta` | VARCHAR(50), valor inicial AHORROS | Tipo de cuenta de destino. |
| `estado` | ENUM, valor inicial PENDIENTE | Estado del retiro. |
| `referencia_bancaria` | VARCHAR(100), nullable | Referencia devuelta por la pasarela simulada. |
| `razon_fallo` | VARCHAR(255), nullable | Motivo del fallo, rechazo o revisión manual. |
| `movimiento_billetera_id` | VARCHAR(100), nullable | Identificador de movimiento confirmado por billetera. |
| `billetera_id` | VARCHAR(100), nullable | Identificador de la billetera debitada. |
| `fecha_creacion` | TIMESTAMP, obligatorio | Fecha de creación. |
| `fecha_actualizacion` | TIMESTAMP, obligatorio | Fecha de última actualización. |

Hay índices sobre `usuario_id` y `estado`. El enum de la entidad incluye `PENDIENTE`, `RESERVADO`, `COMPLETADO`, `RECHAZADO` y `FALLIDO`; el flujo HTTP actual no asigna `RESERVADO`. La entidad no declara la columna `codigo_banco`.

Las reglas de monto mínimo, máximo y decimales se aplican en la aplicación; no se debe asumir que la entidad declare un CHECK equivalente en PostgreSQL. TypeORM está configurado con `synchronize: true` y puede modificar el esquema al iniciar: úsalo solo con bases de prueba y conserva los datos necesarios.

## Integración con billetera

Retiros busca la billetera del usuario mediante HTTP y solicita el débito. Tras la confirmación guarda `billetera_id` y `movimiento_billetera_id` antes de ejecutar la pasarela simulada. El contrato de billetera no documenta reversión ni idempotencia; un débito incierto requiere revisión manual y un fallo posterior al débito requiere gestión manual de la devolución.
