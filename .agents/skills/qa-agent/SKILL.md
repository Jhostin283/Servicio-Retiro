---
name: qa-agent
description: Habilidades, estándares y directrices del Agente de Control de Calidad (QA Agent) para pruebas E2E, pruebas de integración, auditoría de cobertura (>80%), validación de especificaciones OpenAPI y pruebas de carga y resiliencia.
---

# 🧪 Agente de Control de Calidad (QA Agent Skills)

Este documento define las competencias, responsabilidades y estándares de prueba que rigen las acciones del **Agente de QA (Quality Assurance)** en este proyecto.

---

## 🎯 Rol y Alcance
El Agente de QA es responsable de garantizar la calidad, estabilidad, resiliencia y conformidad de los requerimientos funcionales y no funcionales del sistema de microservicios y del cliente web.

---

## 🛠️ Competencias Técnicas y Habilidades

### 1. Auditoría de Cobertura de Pruebas (>80% Coverage)
* Verificar que la suite de pruebas unitarias mantenga una cobertura superior al 80% en los módulos críticos:
  * **Backend (`retiros-usd-service`):** Dominio, Value Objects (`MontoUSD`), Casos de Uso, Adaptadores y Controllers REST.
  * **Frontend (`frontend`):** Servicios Angular `HttpClient` y Componentes Standalone.

### 2. Pruebas E2E y de Integración (Saga / Event-Driven)
* Validar el flujo extremo a extremo de las transacciones de retiro:
  1. Registro de la solicitud en la API REST (`POST /retiros`).
  2. Publicación y entrega del evento `withdrawal.requested` en RabbitMQ.
  3. Procesamiento simulado con la Pasarela Bancaria USD.
  4. Verificación de actualización del estado final (`COMPLETADO`, `FALLIDO` o `RECHAZADO`).

### 3. Validación de Contratos API (OpenAPI 3.0 OpenSpec)
* Auditar el cumplimiento del archivo `openapi_retiros.yaml` y Swagger UI (`/api/docs`).
* Garantizar el correcto uso de códigos de estado HTTP (`202 ACCEPTED`, `400 BAD REQUEST`, `404 NOT FOUND`) y la estructura de los payloads de respuesta DTO.

### 4. Simulación de Escenarios de Error y Resiliencia
* **Simulación de Rechazo Bancario ACH:** Ejecución de pruebas enviando la cuenta `0000` para verificar la captura del error y emisión de `withdrawal.failed`.
* **Validación de Límites Financieros USD:** Inyección de montos inválidos (menores a $1.00 USD o mayores a $10,000.00 USD) para verificar la respuesta inmediata del Value Object `MontoUSD`.
* **Pruebas de Rechazo por Saldo Insuficiente:** Simulación del evento `withdrawal.funds_rejected` para verificar que el estado pase a `RECHAZADO`.

### 5. Pruebas de Usabilidad e Interfaz en Angular
* Validar que la interfaz web de Angular refleje dinámicamente los cambios de estado mediante badges de colores y toasts de notificación sin requerir recargar la página.
