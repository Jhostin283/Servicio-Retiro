# SPEC-002: Servicio HTTP Client & Evento RabbitMQ Retiro Solicitado

- **Nombre**: Cliente HTTP Frontend e Integración AMQP RabbitMQ
- **Responsable**: Almerco
- **Objetivo**: Conectar el servicio HTTP del cliente web con el backend y emitir eventos de mensajería asíncrona tras el registro.
- **Alcance por Capas**:
  - **Frontend (Angular 17)**: Servicio `RetirosService` con `HttpClient`, mapeo de respuestas DTO e interceptor de manejo de errores RxJS.
  - **Backend (NestJS / RabbitMQ)**: Publicación del evento `withdrawal.requested` en RabbitMQ y persistencia TypeORM mediante `RepositorioRetiroAdaptador`.
- **Archivos Involucrados**:
  - `frontend/`
  - `retiros-usd-service/`
- **Dependencias**: SPEC-001.
- **Criterios de Aceptación**:
  - Envío exitoso de la solicitud desde Angular al microservicio.
  - Emisión confirmada del evento `withdrawal.requested` a RabbitMQ.
  - Inserción relacional verificada en PostgreSQL `db_servicio_retiros_usd`.
- **Commits Esperados**:
  - `git add frontend/` -> `git commit -m "feat(frontend): crear servicio cliente http con manejo de errores rxjs"`
  - `git add retiros-usd-service/` -> `git commit -m "feat(backend): implementar publicador de eventos rabbitmq y adaptador de persistencia postgres"`
