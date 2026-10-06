# 📂 Estructura de Carpetas & Módulos: retiros-usd-service

Este documento detalla la **estructura interna de directorios** del microservicio NestJS bajo Arquitectura Hexagonal.

---

## 📁 Árbol de Carpetas (`retiros-usd-service/src/`)

```text
retiros-usd-service/
├── src/
│   ├── application/                           # ⚙️ CAPA DE APLICACIÓN (Casos de Uso y DTOs)
│   │   ├── dtos/
│   │   │   ├── crear-retiro.dto.ts            # DTO de entrada HTTP con class-validator
│   │   │   └── respuesta-retiro.dto.ts        # DTO de salida de la API
│   │   └── use-cases/
│   │       ├── crear-retiro.caso-uso.ts       # Caso de uso: Crear Retiro (PENDIENTE)
│   │       ├── consultar-retiro.caso-uso.ts   # Caso de uso: Consultar por ID / usuarioId
│   │       ├── procesar-fondos-reservados.caso-uso.ts # Caso de uso: Confirmar en Banco (COMPLETADO)
│   │       └── procesar-fondos-rechazados.caso-uso.ts # Caso de uso: Rechazar Retiro (FALLIDO)
│   │
│   ├── domain/                                # 💎 CAPA DE DOMINIO (Reglas de Negocio Puras)
│   │   ├── enums/
│   │   │   └── estado-retiro.enum.ts          # Enum: PENDIENTE, COMPLETADO, FALLIDO, RECHAZADO
│   │   ├── models/
│   │   │   └── retiro.modelo.ts               # Entidad de Dominio Retiro (Aggregate Root)
│   │   ├── ports/
│   │   │   ├── input/                         # Puertos de Entrada (Interfaces de Casos de Uso)
│   │   │   └── output/                        # Puertos de Salida (Repositorio, Eventos, Pasarela)
│   │   │       ├── repositorio-retiro.puerto.ts
│   │   │       ├── publicador-eventos.puerto.ts
│   │   │       └── pasarela-bancaria.puerto.ts
│   │   └── value-objects/
│   │       └── monto-usd.vo.ts                # Value Object: Validaciones de Límites ($1 - $10,000)
│   │
│   └── infrastructure/                        # 🔌 CAPA DE INFRAESTRUCTURA (Adaptadores y Frameworks)
│       ├── adapters/
│       │   ├── bank/
│       │   │   └── pasarela-bancaria.adaptador.ts # Adaptador de Transferencias Bancarias ACH
│       │   ├── messaging/
│       │   │   └── publicador-rabbitmq.adaptador.ts # Adaptador Productor RabbitMQ AMQP
│       │   └── persistence/
│       │       ├── entidad-retiro.orm.ts      # Entidad ORM TypeORM PostgreSQL
│       │       └── repositorio-retiro.adaptador.ts # Adaptador de Repositorio TypeORM
│       ├── controllers/
│       │   ├── retiro-http.controlador.ts    # Controlador REST (POST/GET /retiros)
│       │   └── retiro-eventos.controlador.ts # Controlador de Consumo de Eventos RabbitMQ
│       └── modules/
│           └── modulo-retiros.module.ts       # Módulo Principal NestJS
│
├── Dockerfile                                 # Multi-stage build Node 20
├── package.json
└── tsconfig.json
```
