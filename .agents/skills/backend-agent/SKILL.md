---
name: backend-agent
description: Habilidades, estándares y directrices del Agente de Inteligencia Artificial para el desarrollo y mantenimiento de microservicios backend con NestJS, Arquitectura Hexagonal, principios SOLID, eventos RabbitMQ, especificidad OpenAPI y pruebas unitarias con Jest (>80% cobertura).
---

# ⚙️ Agente Backend (Backend Agent Skills)

Este documento define las competencias, responsabilidades, patrones de diseño y estándares técnicos que rigen las acciones del **Agente Backend** en este proyecto.

---

## 🎯 Rol y Alcance
El Agente Backend es responsable de la arquitectura, seguridad, persistencia, comunicación asíncrona y lógica de negocio del microservicio de retiros (`retiros-usd-service`).

---

## 🛠️ Competencias Técnicas y Habilidades

### 1. Arquitectura Hexagonal (Puertos y Adaptadores)
* **Capa de Dominio (`src/dominio/`):** Modelos puros (`Retiro`), Value Objects (`MontoUSD`) y Enums (`EstadoRetiro`). Libre de cualquier dependencia de frameworks (NestJS, TypeORM, etc.).
* **Puertos (`src/dominio/puertos/`):** Interfaces abstractas segregadas en `entrada/` (Casos de uso) y `salida/` (Persistencia, Eventos, Pasarelas bancarias).
* **Capa de Aplicación (`src/aplicacion/`):** Casos de uso atómicos (`CrearRetiroCasoUso`, `ProcesarFondosReservadosCasoUso`) y DTOs de transporte.
* **Capa de Infraestructura (`src/infraestructura/`):** Adaptadores concretos (`AdaptadorRepositorioRetiroTypeOrm`, `AdaptadorPublicadorRabbitMQ`, `AdaptadorPasarelaBancariaSimulada`) y controladores REST HTTP (`/retiros`) y listeners RabbitMQ.

### 2. Auditoría de Principios SOLID
* **SRP (Single Responsibility):** Cada caso de uso resuelve una sola tarea atómica.
* **OCP (Open/Closed):** Nuevas pasarelas o brokers se agregan implementando los puertos de salida sin modificar la lógica del dominio.
* **LSP (Liskov Substitution):** Adaptadores de infraestructura sustituibles de forma transparente.
* **ISP (Interface Segregation):** Puertos delgados e interfaces específicas.
* **DIP (Dependency Inversion):** Inyección de dependencias basada estrictamente en abstraer puertos (`PUERTO_REPOSITORIO_RETIRO`, `PUERTO_PUBLICADOR_EVENTOS`).

### 3. Sagas y Mensajería Orientada a Eventos (Event-Driven)
* Integración con RabbitMQ mediante `@nestjs/microservices`.
* Emisión y escucha de eventos de saga: `withdrawal.requested`, `withdrawal.funds_reserved`, `withdrawal.completed`, `withdrawal.failed`.

### 4. Reglas Financieras en Dólares (USD)
* Encapsulamiento del Value Object `MontoUSD`: Validación estricta del rango ($1.00 USD mínimo - $10,000.00 USD máximo por transacción) y redondeo a 2 decimales.

### 5. Especificación OpenAPI 3.0 OpenSpec
* Mantenimiento continuo del archivo YAML `openapi_retiros.yaml` y la interfaz Swagger UI (`/api/docs`).

### 6. Cobertura de Pruebas Unitarias (>80% Coverage)
* Desarrollo de suites de prueba Jest (`.spec.ts`) para Dominio, Casos de Uso, Adaptadores de Persistencia y Controladores REST HTTP.
