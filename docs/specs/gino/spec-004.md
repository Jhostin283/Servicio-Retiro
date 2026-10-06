# SPEC-004: Respuestas de Eventos y Pasarela Bancaria ACH/SWIFT

- **Nombre**: Actualización Reactiva UI y Consumidores de Eventos / Pasarela Bancaria
- **Responsable**: Gino
- **Objetivo**: Integrar la simulación de liquidación bancaria ACH/SWIFT, la recepción de eventos de fondos y la actualización reactiva en la UI del cliente.
- **Alcance por Capas**:
  - **Frontend (Angular 17)**: Notificaciones toast en vivo y actualización reactiva de estados en la interfaz web vía RxJS BehaviorSubjects.
  - **Backend (NestJS / RabbitMQ / Bank)**: Consumidores de eventos RabbitMQ (`RetiroEventosControlador` para `withdrawal.completed`/`failed`) y adaptador `PasarelaBancariaAdaptador`.
- **Archivos Involucrados**:
  - `frontend/`
  - `retiros-usd-service/`
- **Dependencias**: SPEC-003.
- **Criterios de Aceptación**:
  - Consumo correcto de eventos AMQP y actualización del estado en PostgreSQL.
  - Integración del simulador de pasarela bancaria asignando `referencia_bancaria`.
  - Notificación reactiva y cambio de estado visible en el cliente Angular.
- **Commits Esperados**:
  - `git add frontend/` -> `git commit -m "feat(frontend): agregar servicio de notificaciones en vivo y actualizacion reactiva de estado"`
  - `git add retiros-usd-service/` -> `git commit -m "feat(backend): implementar consumidores de eventos amqp y adaptador de pasarela bancaria ach"`
