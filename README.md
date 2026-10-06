# 💵 Microservicio de Retiros en Dólares (USD)

Este repositorio contiene la implementación del **Microservicio de Retiros USD** desarrollado para la asignatura de **Desarrollo de Aplicaciones en la Nube (Taller 2 - Microservicios)**.

---

## 🎯 1. Descripción del Servicio

El **Servicio de Retiros USD** es un microservicio backend construido con **NestJS** y **Arquitectura Hexagonal**, encargado de gestionar las solicitudes de desembolso de fondos en dólares hacia cuentas bancarias externas (ACH / SWIFT).

### ⚙️ Características Clave:
* **Arquitectura Hexagonal**: Separación estricta entre Dominio, Casos de Uso e Infraestructura (Puertos y Adaptadores).
* **Patrón Database per Service**: Base de datos **PostgreSQL 15** propia (`db_servicio_retiros_usd`) aislada físicamente.
* **Persistencia con TypeORM**: Generación nativa de UUIDs (`gen_random_uuid()`), tipos ENUM (`estado_retiro_enum`), restricciones CHECK de rango (`$1` a `$10,000` USD) e índices B-Tree (`idx_retiros_usuario_id`, `idx_retiros_estado`).
* **Mensajería Asíncrona con RabbitMQ**: Publicación y consumo de eventos financieros (`withdrawal.requested`, `withdrawal.completed`, `withdrawal.failed`).
* **Pruebas Unitarias con Jest**: Cobertura superior al 80% en todas las capas del microservicio.
* **Especificación OpenAPI 3.0**: Contrato de API interactiva en Swagger UI (`/api/docs`).

---

## 🏗️ 2. Arquitectura Interna del Servicio

```text
retiros-usd-service/src/
├── domain/                      # Capa de Dominio (Modelos, Value Objects, Puertos)
│   ├── enums/                   # EstadoRetiro ('PENDIENTE', 'COMPLETADO', etc.)
│   ├── models/                  # Entidad de Dominio Retiro (.spec.ts)
│   ├── value-objects/           # MontoUSD (.spec.ts)
│   └── ports/                   # Puertos de Entrada y Salida (Interfaces)
├── application/                 # Capa de Aplicación (Casos de Uso y DTOs)
│   ├── dtos/                    # CrearRetiroDto, RespuestaRetiroDto
│   └── use-cases/               # CrearRetiro, ConsultarRetiro (.spec.ts)
└── infrastructure/              # Capa de Infraestructura (Adaptadores, Controladores, Módulos)
    ├── controllers/             # RetiroHttpController, RetiroEventosController (.spec.ts)
    └── adapters/                # TypeORM Postgres, RabbitMQ AMQP, Pasarela ACH (.spec.ts)
```

---

## 🔌 3. Endpoints HTTP REST & Mensajería AMQP

### 🌐 Endpoints REST (HTTP)

| Método | Ruta | Descripción | Estado de Respuesta |
| :--- | :--- | :--- | :---: |
| **POST** | `/retiros` | Registrar una nueva solicitud de retiro USD | `201 Created` |
| **GET** | `/retiros/:id` | Consultar detalle de un retiro por ID (UUID) | `200 OK` |
| **GET** | `/retiros/usuario/:usuarioId` | Listar el historial de retiros de un usuario | `200 OK` |
| **GET** | `/api/docs` | Documentación interactiva Swagger UI | `200 OK` |

### ✉️ Eventos RabbitMQ (AMQP)

| Tipo | Routing Key / Evento | Descripción |
| :--- | :--- | :--- |
| **Publicado** | `withdrawal.requested` | Notifica la retención provisional de fondos a la Billetera |
| **Publicado** | `withdrawal.completed` | Notifica la finalización exitosa del desembolso bancario |
| **Publicado** | `withdrawal.failed` | Notifica la liberación de fondos por rechazo bancario |

---

## 🧪 4. Pruebas Unitarias y Cobertura (+80%)

Para ejecutar la suite de pruebas unitarias con reporte de cobertura:

```bash
cd retiros-usd-service
npm run test:cov
```

---

## 🚀 5. Guía de Ejecución

### Opción A: Ejecución con Docker Compose (Recomendado)
```bash
docker-compose up -d --build
```

### Opción B: Ejecución Local
```bash
cd retiros-usd-service
npm install
npm run start:dev
```

* **API REST Base**: `http://localhost:3000/retiros`
* **Documentación Swagger UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
