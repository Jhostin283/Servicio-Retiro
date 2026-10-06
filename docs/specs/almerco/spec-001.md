# SPEC-001: Solicitud de Retiros USD (Formulario UI & Endpoint POST)

- **Nombre**: Formulario de Solicitud de Retiro y Endpoint HTTP `POST /retiros`
- **Responsable**: Almerco
- **Objetivo**: Implementar la funcionalidad completa de registro de solicitudes de retiro, integrando la UI en Angular 17 con la capa de aplicación NestJS.
- **Alcance por Capas**:
  - **Frontend (Angular 17)**: Componente reactivo `FormularioRetiroComponent` con validación de montos entre $1.00 y $10,000.00 USD, selector de banco SWIFT y número de cuenta.
  - **Backend (NestJS)**: Caso de Uso `CrearRetiroCasoUso` y Controlador HTTP `@Post('/retiros')` para recibir DTOs y validar reglas de dominio.
- **Archivos Involucrados**:
  - `frontend/`
  - `retiros-usd-service/`
- **Dependencias**: Ninguna.
- **Criterios de Aceptación**:
  - Formulario con validación síncrona de inputs en Angular.
  - Endpoint `POST /retiros` respondiendo 201 Created con entidad registrada en estado `PENDIENTE`.
  - Pruebas unitarias en Frontend y Backend con cobertura >80%.
- **Commits Esperados**:
  - `git add frontend/` -> `git commit -m "feat(frontend): implementar componente de formulario de solicitud de retiro con validacion de rango"`
  - `git add retiros-usd-service/` -> `git commit -m "feat(backend): implementar caso de uso crear retiro y controlador HTTP POST /retiros"`
