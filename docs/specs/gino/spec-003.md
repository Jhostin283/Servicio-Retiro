# SPEC-003: Historial de Retiros USD (Tabla UI & Endpoint GET)

- **Nombre**: Componente de Tabla de Historial y Endpoint HTTP `GET /retiros/usuario/:usuarioId`
- **Responsable**: Gino
- **Objetivo**: Implementar la visualización del historial de retiros transaccionales en la UI y la consulta indexada en la base de datos backend.
- **Alcance por Capas**:
  - **Frontend (Angular 17)**: Componente `TablaHistorialComponent` con renderizado de listas, formato de divisas y badges de estado (`PENDIENTE`, `COMPLETADO`, `FALLIDO`, `RECHAZADO`).
  - **Backend (NestJS)**: Caso de Uso `ConsultarRetiroCasoUso` y Controlador HTTP `@Get('/retiros/usuario/:usuarioId')` optimizado con el índice B-Tree `idx_retiros_usuario_id`.
- **Archivos Involucrados**:
  - `frontend/`
  - `retiros-usd-service/`
- **Dependencias**: Ninguna.
- **Criterios de Aceptación**:
  - Renderizado dinámico del historial por usuario en Angular.
  - Endpoint HTTP GET respondiendo arreglo de transacciones en <50ms.
  - Cobertura de pruebas unitarias >80%.
- **Commits Esperados**:
  - `git add frontend/` -> `git commit -m "feat(frontend): implementar componente de tabla de historial de retiros con insignias de estado"`
  - `git add retiros-usd-service/` -> `git commit -m "feat(backend): implementar caso de uso consultar retiro y endpoint HTTP GET por usuario"`
